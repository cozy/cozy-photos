import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import SpinnerIcon from 'cozy-ui/transpiled/react/Icons/Spinner'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const RunningBackupActions = ({
  mediasToBackupCount,
  totalMediasToBackupCount,
  stopBackup
}) => {
  const { t } = useI18n()
  return (
    <div className="u-mt-1 u-flex u-flex-column u-flex-justify-center">
      <Button
        label={t('Backup.actions.backupInProgress', {
          alreadyBackupedCount: totalMediasToBackupCount - mediasToBackupCount,
          totalCount: totalMediasToBackupCount
        })}
        variant="primary"
        disabled
        startIcon={
          <Icon icon={SpinnerIcon} spin aria-hidden focusable="false" />
        }
      />
      <Button
        className="u-mt-half"
        label={t('Backup.actions.cancel')}
        variant="secondary"
        onClick={stopBackup}
      />
    </div>
  )
}

export default RunningBackupActions
