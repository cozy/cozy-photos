import React from 'react'

import AnalysisInProgress from 'photos/ducks/backup/components/BackupInfo/AnalysisInProgress'
import BackupReady from 'photos/ducks/backup/components/BackupInfo/BackupReady'
import BackupDone from 'photos/ducks/backup/components/BackupInfo/BackupDone'

import { useBackupData } from '../hooks/useBackupData'

const BackupInfo = () => {
  const { backupInfo } = useBackupData()

  if (!backupInfo) return null

  const {
    currentBackup: { status, mediasToBackupCount, mediasLoadedCount },
    lastBackup
  } = backupInfo

  if (status === 'initializing') {
    return <AnalysisInProgress mediasLoadedCount={mediasLoadedCount} />
  } else if (status === 'ready') {
    return <BackupReady mediasToBackupCount={mediasToBackupCount} />
  } else if (status === 'done') {
    return <BackupDone lastBackup={lastBackup} />
  }

  return null
}

export default BackupInfo
