import React from 'react'
import { Outlet, NavLink as RouterLink } from 'react-router-dom'

import { BarComponent } from 'cozy-bar'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { Layout as LayoutUI, Main } from 'cozy-ui/transpiled/react/Layout'
import Sidebar from 'cozy-ui/transpiled/react/Sidebar'
import Nav, {
  NavItem,
  NavIcon,
  NavText,
  genNavLinkForV6
} from 'cozy-ui/transpiled/react/Nav'
import CozyDevtools from 'cozy-devtools'
import { ModalManager } from 'react-cozy-helpers'
import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'

import ButtonClient from 'components/pushClient/Button'
import { UploadQueue } from '../ducks/upload'
import PushBanner from 'components/PushBanner'

const NavLink = genNavLinkForV6(RouterLink)

const FlagshipNavLinks = () => {
  const { t } = useI18n()

  return (
    <>
      <NavItem>
        <NavLink to="/backup">
          <NavIcon icon="phone-upload" />
          <NavText>{t('Nav.backup')}</NavText>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/photos">
          <NavIcon icon="image" />
          <NavText>{t('Nav.photos')}</NavText>
        </NavLink>
      </NavItem>
      <NavItem data-testid="nav-to-albums">
        <NavLink to="/albums">
          <NavIcon icon="album" />
          <NavText>{t('Nav.albums')}</NavText>
        </NavLink>
      </NavItem>
    </>
  )
}

const NavLinks = () => {
  const { t } = useI18n()

  return (
    <>
      <NavItem>
        <NavLink to="/photos">
          <NavIcon icon="image" />
          <NavText>{t('Nav.photos')}</NavText>
        </NavLink>
      </NavItem>
      <NavItem data-testid="nav-to-albums">
        <NavLink to="/albums">
          <NavIcon icon="album" />
          <NavText>{t('Nav.albums')}</NavText>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink to="/backup">
          <NavIcon icon="phone-upload" />
          <NavText>{t('Nav.backup')}</NavText>
        </NavLink>
      </NavItem>
    </>
  )
}

const NoBackupNavLinks = () => {
  const { t } = useI18n()

  return (
    <>
      <NavItem>
        <NavLink to="/photos">
          <NavIcon icon="image" />
          <NavText>{t('Nav.photos')}</NavText>
        </NavLink>
      </NavItem>
      <NavItem data-testid="nav-to-albums">
        <NavLink to="/albums">
          <NavIcon icon="album" />
          <NavText>{t('Nav.albums')}</NavText>
        </NavLink>
      </NavItem>
    </>
  )
}

const getNavLinks = () => {
  if (flag('flagship.backup.enabled')) {
    if (isFlagshipApp()) {
      return <FlagshipNavLinks />
    } else {
      return <NavLinks />
    }
  }

  return <NoBackupNavLinks />
}

export const Layout = () => (
  <LayoutUI>
    <BarComponent searchOptions={{ enabled: false }} />
    <Sidebar className="u-flex-justify-between">
      <Nav>{getNavLinks()}</Nav>
      {!isFlagshipApp() && <ButtonClient />}
    </Sidebar>

    <UploadQueue />
    <Main>
      <PushBanner />
      <Outlet />
    </Main>
    <ModalManager />
    <Sprite />
    {flag('debug') ? <CozyDevtools /> : null}
  </LayoutUI>
)

export default Layout
