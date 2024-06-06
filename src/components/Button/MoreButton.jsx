import React from 'react'
import cx from 'classnames'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'

import styles from './index.styl'

const MoreButton = ({ disabled, onClick, ...props }) => {
  const { t } = useI18n()
  return (
    <Button
      data-testid="more-button"
      className={cx('u-miw-auto', styles['dri-btn--more'])}
      variant="secondary"
      label={<Icon icon={DotsIcon} />}
      disabled={disabled}
      onClick={onClick}
      aria-label={t('Toolbar.more')}
      {...props}
    />
  )
}

export default MoreButton
