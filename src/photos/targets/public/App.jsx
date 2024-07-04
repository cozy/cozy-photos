import React, { Component } from 'react'
import flatten from 'lodash/flatten'
import PropTypes from 'prop-types'
import { Outlet, useParams } from 'react-router-dom'

import { Query } from 'cozy-client'
import { Spinner, useBreakpoints } from 'cozy-ui/transpiled/react'
import { Main } from 'cozy-ui/transpiled/react/Layout'
import { BarComponent } from 'cozy-bar'

import Selection from 'photos/ducks/selection'
import PhotoBoard from 'photos/components/PhotoBoard'
import ErrorUnsharedComponent from 'photos/components/ErrorUnshared'
import { buildAlbumsQuery } from '../../queries/queries'
import { TopbarPublic } from '../../components/TopbarPublic'

export class App extends Component {
  static contextTypes = {
    t: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired
  }

  onDownload = selected => {
    const photos = selected.length !== 0 ? selected : null
    this.downloadPhotos(photos)
  }

  downloadPhotos = async photos => {
    let allPhotos
    const { album } = this.props
    if (photos !== null) {
      allPhotos = flatten(photos)
    } else {
      const photosRequested = await this.context.client
        .getStackClient()
        .collection('io.cozy.files')
        .findReferencedBy(
          {
            _type: 'io.cozy.photos.albums',
            _id: album.id
          },
          { limit: 99999 }
        )
      allPhotos = photosRequested.data
    }

    this.context.client.collection('io.cozy.files').downloadArchive(
      allPhotos.map(({ _id }) => _id),
      album.name
    )
  }

  render() {
    const { album, hasMore, photos, fetchMore } = this.props

    return (
      <Main className="u-pt-1-half">
        <BarComponent isPublic />
        <Selection>
          {(selected, active, selection) => (
            <div>
              <TopbarPublic
                title={album.name}
                onDownload={docs =>
                  docs ? this.onDownload(docs) : this.onDownload(selected)
                }
              />
              <PhotoBoard
                lists={[{ photos }]}
                selected={selected}
                photosContext="shared_album"
                showSelection={active}
                onPhotoToggle={selection.toggle}
                onPhotosSelect={selection.select}
                onPhotosUnselect={selection.unselect}
                fetchStatus={photos.fetchStatus}
                hasMore={hasMore}
                fetchMore={fetchMore}
              />
              <Outlet />
            </div>
          )}
        </Selection>
      </Main>
    )
  }
}

App.propTypes = {
  album: PropTypes.object.isRequired,
  hasMore: PropTypes.bool, // see https://github.com/cozy/cozy-client/issues/345
  photos: PropTypes.array.isRequired,
  fetchMore: PropTypes.func.isRequired
}

const ConnectedApp = props => {
  const { albumId } = useParams()
  const { isMobile } = useBreakpoints()
  const albumsQuery = buildAlbumsQuery(albumId)
  return (
    <Query query={albumsQuery.definition} as={albumsQuery.as} {...props}>
      {({ data: album, fetchStatus }) => {
        if (fetchStatus === 'failed') {
          return <ErrorUnsharedComponent />
        }
        if (fetchStatus === 'loaded') {
          return (
            <App
              album={album}
              photos={album.photos.data}
              hasMore={album.photos.hasMore}
              fetchMore={album.photos.fetchMore.bind(album.photos)}
              isMobile={isMobile}
            >
              {props.children}
            </App>
          )
        } else {
          return (
            <Spinner
              size={'xxlarge'}
              loadingType={'photos_fetching'}
              middle={true}
              color="var(--primaryColor)"
            />
          )
        }
      }}
    </Query>
  )
}

export default ConnectedApp
