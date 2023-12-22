import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SyncIcon from 'cozy-ui/transpiled/react/Icons/Sync'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const StartBackupActions = ({ onClick }) => {
  const { t } = useI18n()

  return (
    <div className="u-mt-1-half u-flex u-flex-justify-center">
      <Button
        label={t('Backup.actions.startBackup')}
        variant="primary"
        onClick={onClick}
        startIcon={<Icon icon={SyncIcon} />}
      />
    </div>
  )
}

export default StartBackupActions
