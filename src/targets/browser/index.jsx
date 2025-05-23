import 'cozy-ui/dist/cozy-ui.utils.min.css'
import 'cozy-ui/transpiled/react/stylesheet.css'
import 'cozy-bar/dist/stylesheet.css'
import 'cozy-sharing/dist/stylesheet.css'
import 'cozy-viewer/dist/stylesheet.css'
import 'photos/styles/main.styl'

// Uncomment to activate why-did-you-render
// https://github.com/welldone-software/why-did-you-render
// import './wdyr'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { compose, createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

import { DataProxyProvider } from 'cozy-dataproxy-lib'
import { BarProvider } from 'cozy-bar'
import CozyClient, { CozyProvider, RealTimeQueries } from 'cozy-client'
import { RealtimePlugin } from 'cozy-realtime'
import flag from 'cozy-flags'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'
import SharingProvider from 'cozy-sharing'
import { WebviewIntentProvider } from 'cozy-intent'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import AlertProvider from 'cozy-ui/transpiled/react/providers/Alert'

import { DOCTYPE_ALBUMS } from 'lib/doctypes'

import PushBannerProvider from 'components/PushBanner/PushBannerProvider'
import appReducers from 'photos/reducers'
import AppRouter from 'photos/components/AppRouter'
import memoize from 'lodash/memoize'

import appMetadata from 'photos/appMetadata'
import doctypes from './doctypes'

import {
  BackupDataProvider,
  useBackupData
} from 'photos/ducks/backup/hooks/useBackupData'
import WaitFlags from 'photos/components/WaitFlags'

const loggerMiddleware = createLogger()

const setupAppContext = memoize(() => {
  const root = document.querySelector('[role=application]')
  const data = JSON.parse(root.dataset.cozy)
  const protocol = window.location ? window.location.protocol : 'https:'
  const cozyUrl = `${protocol}//${data.domain}`
  const client = new CozyClient({
    uri: cozyUrl,
    token: data.token,
    appMetadata,
    schema: doctypes,
    store: false
  })
  client.registerPlugin(RealtimePlugin)
  client.registerPlugin(flag.plugin)

  let middlewares = [thunkMiddleware, loggerMiddleware]

  // Enable Redux dev tools
  const composeEnhancers =
    (flag('debug') && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

  const store = createStore(
    combineReducers({ ...appReducers, cozy: client.reducer() }),
    composeEnhancers(applyMiddleware.apply(this, middlewares))
  )
  client.setStore(store)
  const locale = data.locale

  return { store, locale, client, root }
})

const App = props => {
  const { setBackupInfo } = useBackupData()

  return (
    <WebviewIntentProvider
      methods={{
        updateBackupInfo: backupInfo => {
          setBackupInfo(backupInfo)
        }
      }}
    >
      <Provider store={props.store}>
        <I18n
          lang={props.locale}
          dictRequire={lang => require(`photos/locales/${lang}`)}
        >
          <CozyProvider client={props.client}>
            <DataProxyProvider>
              <BarProvider>
                <WaitFlags>
                  <BreakpointsProvider>
                    <CozyTheme className="u-w-100">
                      <AlertProvider>
                        <RealTimeQueries doctype="io.cozy.settings" />
                        <SharingProvider
                          doctype={DOCTYPE_ALBUMS}
                          documentType="Albums"
                        >
                          <PushBannerProvider>
                            {props.children}
                          </PushBannerProvider>
                        </SharingProvider>
                      </AlertProvider>
                    </CozyTheme>
                  </BreakpointsProvider>
                </WaitFlags>
              </BarProvider>
            </DataProxyProvider>
          </CozyProvider>
        </I18n>
      </Provider>
    </WebviewIntentProvider>
  )
}

const AppWithRouter = props => (
  <BackupDataProvider>
    <App {...props}>
      <AppRouter />
    </App>
  </BackupDataProvider>
)

const init = () => {
  const { store, locale, client, root } = setupAppContext()
  render(<AppWithRouter store={store} locale={locale} client={client} />, root)
}
document.addEventListener('DOMContentLoaded', () => {
  init()
})

if (module.hot) {
  init()
  module.hot.accept()
}
