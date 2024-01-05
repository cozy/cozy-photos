import React from 'react'
import cx from 'classnames'

import Alert from 'cozy-ui/transpiled/react/Alert'
import AlertTitle from 'cozy-ui/transpiled/react/AlertTitle'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from '../../../../styles/backup.styl'

const BackupReady = ({ mediasToBackupCount }) => {
  const { t } = useI18n()

  if (mediasToBackupCount === 0) return null

  return (
    <div className={cx('u-mt-1-half', styles['pho-backup-info-wrapper'])}>
      <Alert severity="primary">
        <AlertTitle>
          {t('Backup.info.notBackedUpElements', {
            smart_count: mediasToBackupCount
          })}
        </AlertTitle>
        {t('Backup.info.pressStartBackup')}
      </Alert>
    </div>
  )
}

export default BackupReady
