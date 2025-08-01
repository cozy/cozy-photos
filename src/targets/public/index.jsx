import 'cozy-ui/dist/cozy-ui.min.css'
import 'cozy-ui/transpiled/react/stylesheet.css'
import 'cozy-bar/dist/stylesheet.css'
import 'cozy-sharing/dist/stylesheet.css'
import 'cozy-viewer/dist/stylesheet.css'
import 'photos/styles/main.styl'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { DataProxyProvider } from 'cozy-dataproxy-lib'
import SharingProvider from 'cozy-sharing'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { HashRouter, Route, Navigate } from 'react-router-dom'
import CozyClient, { CozyProvider, RealTimeQueries } from 'cozy-client'
import { RealtimePlugin } from 'cozy-realtime'
import flag from 'cozy-flags'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'
import { SentryRoutes } from 'lib/sentry'

import { BarProvider } from 'cozy-bar'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { getQueryParameter } from 'react-cozy-helpers'
import getSharedDocument from 'cozy-sharing/dist/getSharedDocument'
import ErrorUnsharedComponent from 'photos/components/ErrorUnshared'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { Layout as LayoutUI } from 'cozy-ui/transpiled/react/Layout'

import appMetadata from 'photos/appMetadata'
import doctypes from '../browser/doctypes'

import App from './App'
import { AlbumPhotosViewer } from 'photos/components/PhotosViewer'

import { WebviewIntentProvider } from 'cozy-intent'
import { DOCTYPE_ALBUMS } from 'lib/doctypes'

document.addEventListener('DOMContentLoaded', init)

async function init() {
  const lang = document.documentElement.getAttribute('lang') || 'en'
  const root = document.querySelector('[role=application]')
  const data = JSON.parse(root.dataset.cozy)
  const { sharecode } = getQueryParameter()
  const protocol = window.location ? window.location.protocol : 'https:'
  const cozyUrl = `${protocol}//${data.domain}`
  const client = new CozyClient({
    uri: cozyUrl,
    token: sharecode,
    appMetadata,
    schema: doctypes,
    store: false
  })

  client.registerPlugin(RealtimePlugin)
  client.registerPlugin(flag.plugin)

  const store = createStore(
    combineReducers({
      cozy: client.reducer()
    }),
    applyMiddleware(thunkMiddleware, createLogger())
  )

  let app = null
  client.setStore(store)

  try {
    const { id } = await getSharedDocument(client)
    app = (
      <WebviewIntentProvider>
        <Provider store={store}>
          <CozyProvider client={client}>
            <DataProxyProvider>
              <BarProvider>
                <BreakpointsProvider>
                  <AlertProvider>
                    <RealTimeQueries doctype="io.cozy.settings" />
                    <SharingProvider
                      doctype={DOCTYPE_ALBUMS}
                      documentType="Albums"
                    >
                      <HashRouter>
                        <SentryRoutes>
                          <Route path="shared/:albumId" element={<App />}>
                            <Route
                              path=":photoId"
                              element={<AlbumPhotosViewer isPublic={true} />}
                            />
                          </Route>
                          <Route
                            path="*"
                            element={<Navigate to={`shared/${id}`} />}
                          />
                        </SentryRoutes>
                      </HashRouter>
                    </SharingProvider>
                  </AlertProvider>
                </BreakpointsProvider>
              </BarProvider>
            </DataProxyProvider>
          </CozyProvider>
        </Provider>
      </WebviewIntentProvider>
    )
  } catch (e) {
    app = <ErrorUnsharedComponent />
  } finally {
    render(
      <I18n lang={lang} dictRequire={lang => require(`photos/locales/${lang}`)}>
        <CozyTheme ignoreCozySettings className="u-w-100">
          <LayoutUI monoColumn>{app}</LayoutUI>
          <Sprite />
        </CozyTheme>
      </I18n>,
      root
    )
  }
}
