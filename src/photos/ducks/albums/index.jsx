import React from 'react'

import { Query, withMutations, useQuery, useClient } from 'cozy-client'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import AlbumsView from './components/AlbumsView'
import AlbumPhotos from './components/AlbumPhotos'
import PhotosPicker from './components/PhotosPicker'
import AddToAlbumModal from './components/AddToAlbumModal'
import Loading from '../../components/Loading'
import Oops from 'photos/components/Error/Oops'

import { DOCTYPE_ALBUMS } from 'lib/doctypes'
import { useParams } from 'react-router-dom'
import { buildAlbumsQuery } from '../../queries/queries'

const ALBUMS_QUERY = client =>
  client
    .find(DOCTYPE_ALBUMS, { created_at: { $gt: null } })
    .partialIndex({
      auto: { $exists: false }
    })
    .indexFields(['created_at'])
    .include(['photos'])
    .sortBy([{ created_at: 'desc' }])

const addPhotos = async (album, photos, showAlert, t) => {
  try {
    const photoCountBefore = album.photos.data.length
    await album.photos.addById(photos.map(({ _id }) => _id))
    const photoCountAfter = album.photos.data.length
    if (photoCountBefore + photos.length !== photoCountAfter) {
      showAlert({
        message: t('Alerter.photos.already_added_photo'),
        severity: 'secondary'
      })
    } else {
      showAlert({
        message: t('Albums.add_photos.success', {
          name: album.name,
          smart_count: photos.length
        }),
        severity: 'success'
      })
    }
  } catch (error) {
    showAlert({
      message: t('Albums.add_photos.error.reference'),
      severity: 'error'
    })
  }
}

const ALBUM_MUTATIONS = (client, showAlert, t) => ({
  updateAlbum: async album => {
    const unique = await client
      .collection(DOCTYPE_ALBUMS)
      .checkUniquenessOf('name', album.name)
    if (unique !== true) {
      showAlert({
        message: t('Albums.create.error.already_exists', { name }),
        severity: 'error'
      })
      return
    } else {
      return client.save(album)
    }
  },
  deleteAlbum: album => client.destroy(album),
  addPhotos: async (album, photos) => addPhotos(album, photos, showAlert, t),
  removePhotos: async (album, photos, clearSelection) => {
    try {
      await album.photos.removeById(photos.map(({ _id }) => _id))
      showAlert({
        message: t('Albums.remove_photos.success', {
          album_name: album.name
        }),
        severity: 'success'
      })
      clearSelection()
    } catch (e) {
      showAlert({
        message: t('Albums.remove_photos.error.generic'),
        severiy: 'error'
      })
    }
  }
})

const ALBUMS_MUTATIONS = (showAlert, t) => client => ({
  addPhotos: async (album, photos) => addPhotos(album, photos, showAlert, t),
  createAlbum: async (name, photos, created_at = new Date()) => {
    try {
      if (!name) {
        showAlert({
          message: t('Albums.create.error.name_missing'),
          severity: 'error'
        })
        return
      }
      const album = { _type: DOCTYPE_ALBUMS, name, created_at }

      const unique = await client
        .collection(DOCTYPE_ALBUMS)
        .checkUniquenessOf('name', album.name)
      if (unique !== true) {
        showAlert({
          message: t('Albums.create.error.already_exists', { name }),
          severity: 'error'
        })
        return
      }
      const resp = await client.create(
        DOCTYPE_ALBUMS,
        album,
        { photos },
        {
          updateQueries: {
            albums: (previousData, result) => [result.data, ...previousData]
          }
        }
      )
      showAlert({
        message: t('Albums.create.success', {
          name: album.name,
          smart_count: photos.length
        }),
        severity: 'success'
      })
      return resp.data
    } catch (error) {
      showAlert({
        message: t('Albums.create.error.generic'),
        severity: 'error'
      })
    }
  }
})

const ConnectedAlbumsView = props => (
  <Query query={ALBUMS_QUERY}>
    {result => {
      return <AlbumsView albums={result} {...props} />
    }}
  </Query>
)

const ConnectedAddToAlbumModal = props => {
  const { t } = useI18n()
  const { showAlert } = useAlert()

  return (
    <Query
      query={ALBUMS_QUERY}
      as="albums"
      mutations={ALBUMS_MUTATIONS(showAlert, t)}
    >
      {(result, { createAlbum, addPhotos }) => (
        <AddToAlbumModal
          {...result}
          createAlbum={createAlbum}
          addPhotos={addPhotos}
          {...props}
        />
      )}
    </Query>
  )
}

export const AlbumPhotosWithLoader = () => {
  const client = useClient()
  const { t } = useI18n()
  const { showAlert } = useAlert()
  const { updateAlbum, deleteAlbum, removePhotos } = ALBUM_MUTATIONS(
    client,
    showAlert,
    t
  )

  const { albumId } = useParams()

  const albumQuery = buildAlbumsQuery(albumId)
  const albumResult = useQuery(albumQuery.definition, albumQuery.options)

  const { data: album, fetchStatus, lastFetch } = albumResult

  if (album && fetchStatus === 'loaded') {
    return (
      <AlbumPhotos
        album={album}
        photos={album.photos.data}
        updateAlbum={updateAlbum}
        deleteAlbum={deleteAlbum}
        removePhotos={removePhotos}
        hasMore={album.photos.hasMore}
        fetchMore={album.photos.fetchMore.bind(album.photos)}
        lastFetch={lastFetch}
      />
    )
  } else if (fetchStatus === 'failed') {
    return <Oops />
  } else {
    return (
      <Loading size={'xxlarge'} loadingType={'photos_fetching'} middle={true} />
    )
  }
}

const CreateAlbumPicker = ({ showAlert, t }) =>
  withMutations(ALBUMS_MUTATIONS(showAlert, t))(PhotosPicker)

const ConnectedPhotosPicker = ({ ...props }) => {
  const { albumId } = useParams()
  const { t } = useI18n()
  const { showAlert } = useAlert()

  if (albumId) {
    const albumsQuery = buildAlbumsQuery(albumId)
    return (
      <Query
        query={albumsQuery.definition}
        as={albumsQuery.as}
        mutations={ALBUMS_MUTATIONS(showAlert, t)}
        {...props}
      >
        {({ data }, { addPhotos }) => (
          <PhotosPicker album={data} addPhotos={addPhotos} />
        )}
      </Query>
    )
  }

  return <CreateAlbumPicker showAlert={showAlert} t={t} />
}

export {
  ConnectedAlbumsView as AlbumsView,
  ConnectedPhotosPicker as PhotosPicker,
  AlbumPhotosWithLoader as AlbumPhotos,
  ConnectedAddToAlbumModal as AddToAlbumModal
}

export const belongsToAlbums = photos => {
  if (!photos) {
    return false
  }
  for (const photo of photos) {
    if (
      photo.relationships &&
      photo.relationships.referenced_by &&
      photo.relationships.referenced_by.data &&
      photo.relationships.referenced_by.data.length > 0
    ) {
      const refs = photo.relationships.referenced_by.data
      for (const ref of refs) {
        if (ref.type === DOCTYPE_ALBUMS) {
          return true
        }
      }
    }
  }
  return false
}
