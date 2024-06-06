import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import AlbumAddIcon from 'cozy-ui/transpiled/react/Icons/AlbumAdd'

import styles from 'photos/styles/toolbar.styl'
import MoreMenu from '../../../components/MoreMenu'
import { newAlbum } from '../../../components/actions'

const AlbumsToolbar = ({ navigate }) => {
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()

  const actions = [newAlbum(navigate)]

  return (
    <div
      data-testid="pho-toolbar-albums"
      className={styles['pho-toolbar']}
      role="toolbar"
    >
      {isMobile ? (
        <MoreMenu actions={actions} />
      ) : (
        <Button
          component="a"
          data-testid="album-add"
          variant="secondary"
          href="#/albums/new"
          startIcon={<Icon icon={AlbumAddIcon} />}
          label={t('Toolbar.album_new')}
        />
      )}
    </div>
  )
}

export default AlbumsToolbar
