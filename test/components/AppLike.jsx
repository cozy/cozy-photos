import React from 'react'
import { CozyProvider } from 'cozy-client'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import { I18n } from 'cozy-ui/transpiled/react/providers/I18n'
import CozyTheme from 'cozy-ui/transpiled/react/providers/CozyTheme'
import { SharingContext } from 'cozy-sharing'
import { BarProvider } from 'cozy-bar'

import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { HashRouter } from 'react-router-dom'
import PushBannerProvider from 'components/PushBanner/PushBannerProvider'
import photoEnLocale from 'photos/locales/en.json'

const mockStore = createStore(() => ({
  mobile: {
    url: 'cozy-url://'
  }
}))

export const TestI18n = ({ children, enLocale }) => {
  return (
    <I18n lang={'en'} dictRequire={enLocale}>
      {children}
    </I18n>
  )
}

const mockSharingContextValue = {
  refresh: jest.fn(),
  hasWriteAccess: jest.fn(),
  getRecipients: jest.fn(),
  getSharingLink: jest.fn()
}

const AppLike = ({
  children,
  store,
  client,
  sharingContextValue,
  enLocale
}) => (
  <CozyTheme>
    <Provider store={(client && client.store) || store || mockStore}>
      <CozyProvider client={client}>
        <BarProvider>
          <TestI18n enLocale={enLocale}>
            <SharingContext.Provider
              value={sharingContextValue || mockSharingContextValue}
            >
              <HashRouter>
                <BreakpointsProvider>
                  <PushBannerProvider>{children}</PushBannerProvider>
                </BreakpointsProvider>
              </HashRouter>
            </SharingContext.Provider>
          </TestI18n>
        </BarProvider>
      </CozyProvider>
    </Provider>
  </CozyTheme>
)

export const PhotosAppLike = props => (
  <AppLike enLocale={() => photoEnLocale} {...props} />
)

export default PhotosAppLike
