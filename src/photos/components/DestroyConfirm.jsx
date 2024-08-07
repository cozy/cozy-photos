import styles from '../styles/confirms.styl'
import classNames from 'classnames'

import React from 'react'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Button from 'cozy-ui/transpiled/react/Buttons'

const DestroyConfirm = ({ t, confirm, onClose }) => {
  const confirmationTexts = ['forbidden', 'eye', 'link'].map(type => (
    <p
      className={classNames(styles['fil-confirm-text'], styles[`icon-${type}`])}
      key={type}
    >
      {t(`destroyconfirmation.${type}`)}
    </p>
  ))
  return (
    <ConfirmDialog
      open={true}
      onClose={onClose}
      title={t('destroyconfirmation.title')}
      content={confirmationTexts}
      actions={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
            label={t('destroyconfirmation.cancel')}
          />
          <Button
            color="error"
            label={t('destroyconfirmation.delete')}
            onClick={confirm}
          />
        </>
      }
    />
  )
}

export default DestroyConfirm
