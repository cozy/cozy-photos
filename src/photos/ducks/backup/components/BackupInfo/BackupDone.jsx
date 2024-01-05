import React from 'react'
import cx from 'classnames'

import Alert from 'cozy-ui/transpiled/react/Alert'
import AlertTitle from 'cozy-ui/transpiled/react/AlertTitle'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from '../../../../styles/backup.styl'

const formatLastBackupMessage = message => {
  if (!message) return ''

  return message.charAt(0).toUpperCase() + message.slice(1) + '. '
}

const BackupDone = ({ lastBackup }) => {
  const { t } = useI18n()

  const deduplicationMessage = lastBackup.deduplicatedMediaCount
    ? ` ${t('Backup.info.deduplicatedMediaCount', {
        smart_count: lastBackup.deduplicatedMediaCount
      })}`
    : null

  if (lastBackup.status === 'success') {
    return (
      <div className={cx('u-mt-1-half', styles['pho-backup-info-wrapper'])}>
        <Alert severity="success">
          <AlertTitle>{t('Backup.info.successTitle')}</AlertTitle>
          {t('Backup.info.successDescription')}
          {deduplicationMessage}
        </Alert>
      </div>
    )
  } else {
    return (
      <div className={cx('u-mt-1-half', styles['pho-backup-info-wrapper'])}>
        <Alert severity="error">
          <AlertTitle>{t('Backup.info.errorTitle')}</AlertTitle>
          {formatLastBackupMessage(lastBackup.message)}
          {t('Backup.info.errorDescription', {
            smart_count: lastBackup.totalMediasToBackupCount,
            backedUpMediaCount: lastBackup.backedUpMediaCount
          })}
          {deduplicationMessage}
        </Alert>
      </div>
    )
  }
}

export default BackupDone
