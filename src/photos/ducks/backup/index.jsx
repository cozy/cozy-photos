import React from 'react'
import Topbar from '../../components/Topbar'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import styles from '../../styles/layout.styl'
import backupStyles from '../../styles/backup.styl'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import BackupHeader from './components/BackupHeader'
import BackupInfo from './components/BackupInfo'
import BackupActions from './components/BackupActions'
import BackupDescription from './components/BackupDescription'
import InstallAppAlert from './components/InstallAppAlert'
import UpdateAppAlert from './components/UpdateAppAlert'
import AllowPermissionsModal from './components/AllowPermissionsModal'
import { BackupError } from './components/BackupError'

import { BackupActionsProvider } from 'photos/ducks/backup/hooks/useBackupActions'
import { isFlagshipApp } from 'cozy-device-helper'

const BackupPageContent = () => {
  const { isMobile } = useBreakpoints()

  const isFlagshipAppBackupReady = window?.cozy?.flagship?.backup_available

  if (isFlagshipApp() && isFlagshipAppBackupReady) {
    return (
      <>
        <BackupHeader />
        <BackupInfo />
        <BackupActions />
        <BackupDescription />
      </>
    )
  } else if (isFlagshipApp() && !isFlagshipAppBackupReady) {
    return (
      <>
        <BackupHeader />
        <UpdateAppAlert />
        <BackupDescription />
      </>
    )
  } else {
    return (
      <>
        {isMobile ? <BackupHeader /> : null}
        <InstallAppAlert />
      </>
    )
  }
}

const BackupPage = () => {
  return (
    <Content className="u-pt-0-s u-pt-1">
      <div
        data-testid="backup-pho-content-wrapper"
        className={styles['pho-content-wrapper']}
      >
        <Topbar viewName="backup"></Topbar>
        <BackupActionsProvider>
          <div className={backupStyles['pho-backup-container']}>
            <div className={backupStyles['pho-backup-wrapper']}>
              <BackupPageContent />
            </div>
          </div>
          <AllowPermissionsModal />
          <BackupError />
        </BackupActionsProvider>
      </div>
    </Content>
  )
}

export default BackupPage
