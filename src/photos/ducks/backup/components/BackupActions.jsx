import React, { useState, useEffect } from 'react'

import { useBackupActions } from '../hooks/useBackupActions'
import { useBackupData } from '../hooks/useBackupData'

import DisabledLoadingBackupActions from 'photos/ducks/backup/components/BackupActions/DisabledLoadingBackupActions'
import DisabledBackupActions from 'photos/ducks/backup/components/BackupActions/DisabledBackupActions'
import DoneBackupActions from 'photos/ducks/backup/components/BackupActions/DoneBackupActions'
import RunningBackupActions from 'photos/ducks/backup/components/BackupActions/RunningBackupActions'
import StartBackupActions from 'photos/ducks/backup/components/BackupActions/StartBackupActions'

const BackupActions = () => {
  const { backupInfo } = useBackupData()
  const {
    backupPermissions,
    prepareBackup,
    startBackup,
    stopBackup,
    requestBackupPermissions
  } = useBackupActions()

  const [statusToIgnore, setStatusToIgnore] = useState('')

  useEffect(() => {
    if (backupInfo?.currentBackup?.status !== statusToIgnore) {
      setStatusToIgnore('')
    }
  }, [backupInfo?.currentBackup?.status, statusToIgnore])

  if (!backupPermissions) return null

  if (backupPermissions.granted) {
    if (!backupInfo) {
      return <DisabledLoadingBackupActions />
    }

    const {
      currentBackup: { status, mediasToBackupCount, totalMediasToBackupCount }
    } = backupInfo

    if (status === 'running') {
      return (
        <RunningBackupActions
          mediasToBackupCount={mediasToBackupCount}
          totalMediasToBackupCount={totalMediasToBackupCount}
          stopBackup={stopBackup}
        />
      )
    } else if (status === 'initializing') {
      return <DisabledBackupActions />
    }

    if (mediasToBackupCount === 0) {
      return <DoneBackupActions prepareBackup={prepareBackup} />
    } else if (mediasToBackupCount > 0 && status !== statusToIgnore) {
      return (
        <StartBackupActions
          onClick={() => {
            startBackup()
            setStatusToIgnore(status)
          }}
        />
      )
    } else {
      return <DisabledLoadingBackupActions />
    }
  } else {
    return <StartBackupActions onClick={requestBackupPermissions} />
  }
}

export default BackupActions
