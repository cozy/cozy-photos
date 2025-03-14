import React from 'react'
import { Navigate, RouterProvider } from 'react-router-dom'
import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'

import Spinner from 'cozy-ui/transpiled/react/Spinner'

import Layout from './Layout'
import Timeline from '../ducks/timeline'
import Backup from '../ducks/backup'
import { AlbumsView, AlbumPhotos, PhotosPicker } from '../ducks/albums'
import { TimelinePhotosViewer, AlbumPhotosViewer } from './PhotosViewer'

import { sentryCreateBrowserRouter } from 'lib/sentry'

function ErrorBoundary() {
  // If there is error uncaugth we redirect to homepage
  return <Navigate to="photos" replace />
}

const getRouter = () => {
  const DEFAULT_ROUTE =
    flag('flagship.backup.enabled') && isFlagshipApp() ? 'backup' : 'photos'

  return sentryCreateBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: '/*',
          element: <Navigate to={DEFAULT_ROUTE} replace />
        },
        {
          path: 'backup',
          element: <Backup />
        },
        {
          path: 'photos',
          element: <Timeline />,
          children: [
            {
              path: ':photoId',
              element: <TimelinePhotosViewer />,
              errorElement: <ErrorBoundary />
            }
          ]
        },
        {
          path: 'albums',
          children: [
            {
              path: '',
              element: <AlbumsView />
            },
            {
              path: 'new',
              element: <PhotosPicker />
            },
            {
              path: ':albumId',
              element: <AlbumPhotos />,
              errorElement: <ErrorBoundary />,
              children: [
                {
                  path: 'edit',
                  element: <PhotosPicker />
                },
                {
                  path: ':photoId',
                  element: <AlbumPhotosViewer />,
                  errorElement: <ErrorBoundary />
                }
              ]
            }
          ]
        }
      ]
    }
  ])
}

const AppRouter = () => {
  return <RouterProvider router={getRouter()} fallbackElement={<Spinner />} />
}
export default AppRouter
