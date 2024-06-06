import styles from '../styles/topbar.styl'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useLocation } from 'react-router-dom'

import { BarCenter, BarRight, BarLeft } from 'cozy-bar'
import SharingProvider from 'cozy-sharing'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { DOCTYPE_ALBUMS } from 'lib/doctypes'
import EditableAlbumName from 'photos/components/EditableAlbumName'

const TopbarTitle = ({ children }) => (
  <h2 data-testid="pho-content-title" className={styles['pho-content-title']}>
    {children}
  </h2>
)

const BackToAlbumsButton = ({ onClick }) => (
  <div
    role="button"
    data-testid="pho-content-album-previous"
    className={styles['pho-content-album-previous']}
    onClick={onClick}
  />
)

BackToAlbumsButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export class Topbar extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }
  componentDidMount() {
    const url = this.props.pathname
    this.parentUrl = url.substring(0, url.lastIndexOf('/'))
  }

  renderTitle() {
    const { t, viewName, albumName = '', onEdit, editing = false } = this.props
    const isAlbumContent = viewName === 'albumContent'

    if (!isAlbumContent) return t(`Nav.${viewName}`)
    else if (editing)
      return <EditableAlbumName albumName={albumName} onEdit={onEdit} />
    else return albumName
  }

  render() {
    const {
      children,
      viewName,
      breakpoints: { isMobile },
      navigate
    } = this.props
    const isAlbumContent = viewName === 'albumContent'
    const title = <TopbarTitle>{this.renderTitle()}</TopbarTitle>
    const responsiveTitle = isMobile ? <BarCenter>{title}</BarCenter> : title
    const responsiveMenu = isMobile ? (
      <BarRight>
        <SharingProvider doctype={DOCTYPE_ALBUMS} documentType="Albums">
          {children}
        </SharingProvider>
      </BarRight>
    ) : (
      children
    )

    const backButton = (
      <BackToAlbumsButton onClick={() => navigate(this.parentUrl)} />
    )
    const responsiveBackButton = isMobile ? (
      <BarLeft>{backButton}</BarLeft>
    ) : (
      backButton
    )

    return (
      <div className={styles['pho-content-header']}>
        {isAlbumContent && responsiveBackButton}
        {responsiveTitle}
        {responsiveMenu}
      </div>
    )
  }
}

Topbar.propTypes = {
  viewName: PropTypes.string.isRequired,
  albumName: PropTypes.string,
  t: PropTypes.func.isRequired,
  editing: PropTypes.bool,
  onEdit: PropTypes.func,
  breakpoints: PropTypes.object.isRequired,
  children: PropTypes.node
}

Topbar.defaultProps = {
  editing: false,
  onEdit: () => {}
}

const TopbarWrapper = props => {
  const navigate = useNavigate()
  const breakpoints = useBreakpoints()
  const { pathname } = useLocation()
  const { t } = useI18n()

  return (
    <Topbar
      {...props}
      t={t}
      breakpoints={breakpoints}
      navigate={navigate}
      pathname={pathname}
    />
  )
}

export default TopbarWrapper
