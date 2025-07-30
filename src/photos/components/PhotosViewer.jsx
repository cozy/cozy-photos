import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Viewer, {
  FooterActionButtons,
  ForwardOrDownloadButton,
  SharingButton
} from 'cozy-viewer'
import { useQuery } from 'cozy-client'

import { buildTimelineQuery, buildAlbumsQuery } from '../queries/queries'

export const TimelinePhotosViewer = () => {
  const timelineQuery = buildTimelineQuery()

  const results = useQuery(timelineQuery.definition, timelineQuery.options)

  if (results.fetchStatus != 'loaded') return null

  return <PhotosViewer photos={results.data} />
}

export const AlbumPhotosViewer = ({ isPublic }) => {
  const { albumId } = useParams()
  const albumsQuery = buildAlbumsQuery(albumId)

  const results = useQuery(albumsQuery.definition, albumsQuery.options)

  if (results.fetchStatus != 'loaded') return null

  return <PhotosViewer photos={results.data.photos.data} isPublic={isPublic} />
}

const PhotosViewer = ({ photos, isPublic = false }) => {
  const navigate = useNavigate()
  let { photoId } = useParams()

  const currentIndex = useMemo(
    () => (photos ? photos.findIndex(p => p.id === photoId) : 0),
    [photos, photoId]
  )

  return (
    <Viewer
      files={photos}
      isPublic={isPublic}
      currentIndex={currentIndex}
      onChangeRequest={nextPhoto => navigate(`../${nextPhoto.id}`)}
      onCloseRequest={() => navigate('..')}
      componentsProps={{
        toolbarProps: {
          showFilePath: !isPublic
        }
      }}
    >
      <FooterActionButtons>
        <SharingButton />
        <ForwardOrDownloadButton />
      </FooterActionButtons>
    </Viewer>
  )
}

export default PhotosViewer
