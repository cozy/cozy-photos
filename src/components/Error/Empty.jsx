import React from 'react'
import cx from 'classnames'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import Empty from 'cozy-ui/transpiled/react/Empty'
import PhotosIcon from 'cozy-ui/transpiled/react/Icons/FileTypeImage'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import styles from './empty.styl'

const EmptyIcon = {
  photos: PhotosIcon
}

const EmptyCanvas = ({ type, canUpload, localeKey, hasTextMobileVersion }) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  return (
    <Empty
      data-testid="empty-folder"
      icon={EmptyIcon[type]}
      title={localeKey ? t(`empty.${localeKey}_title`) : t('empty.title')}
      text={
        (hasTextMobileVersion &&
          isMobile &&
          t(`empty.${localeKey}_mobile_text`)) ||
        (localeKey && t(`empty.${localeKey}_text`)) ||
        (canUpload && t('empty.text'))
      }
      className={cx(styles['empty'], 'u-mh-2')}
    />
  )
}

export default EmptyCanvas

export const EmptyPhotos = props => <EmptyCanvas type="photos" {...props} />
