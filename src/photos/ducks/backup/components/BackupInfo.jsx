import React from 'react'
import cx from 'classnames'

import Alert from 'cozy-ui/transpiled/react/Alert'
import AlertTitle from 'cozy-ui/transpiled/react/AlertTitle'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import AnalysisInProgress from 'photos/ducks/backup/components/BackupInfo/AnalysisInProgress'

import styles from '../../../styles/backup.styl'
import { useBackupData } from '../hooks/useBackupData'

const formatLastBackupMessage = message => {
  if (!message) return ''

  return message.charAt(0).toUpperCase() + message.slice(1) + '. '
}

const BackupInfo = () => {
  const { t } = useI18n()

  const { backupInfo } = useBackupData()

  if (!backupInfo) return null

  const {
    currentBackup: { status, mediasToBackupCount, mediasLoadedCount },
    lastBackup
  } = backupInfo

  if (status === 'initializing') {
    return <AnalysisInProgress mediasLoadedCount={mediasLoadedCount} />
  } else if (status === 'ready' && mediasToBackupCount > 0) {
    return (
      <div className={cx('u-mt-1-half', styles['pho-backup-info-wrapper'])}>
        <Alert severity="primary">
          <AlertTitle>
            {t('Backup.info.notBackedUpElements', {
              smart_count: backupInfo.currentBackup.mediasToBackupCount
            })}
          </AlertTitle>
          {t('Backup.info.pressStartBackup')}
        </Alert>
      </div>
    )
  } else if (status === 'done') {
    if (lastBackup.status === 'success') {
      return (
        <div className={cx('u-mt-1-half', styles['pho-backup-info-wrapper'])}>
          <Alert severity="success">
            <AlertTitle>{t('Backup.info.successTitle')}</AlertTitle>
            {t('Backup.info.successDescription')}
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
          </Alert>
        </div>
      )
    }
  }

  return null
}

export default BackupInfo
