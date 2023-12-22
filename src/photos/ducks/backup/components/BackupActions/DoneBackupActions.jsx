import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CheckIcon from 'cozy-ui/transpiled/react/Icons/Check'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import OpenBackupButton from 'photos/ducks/backup/components/OpenBackupButton'

const DoneBackupActions = ({ prepareBackup }) => {
  const { t } = useI18n()
  return (
    <div className="u-mt-1-half u-flex u-flex-column u-flex-justify-center">
      <Button
        label={t('Backup.actions.saved')}
        variant="primary"
        color="success"
        onClick={prepareBackup}
        startIcon={<Icon icon={CheckIcon} />}
      />
      <OpenBackupButton />
    </div>
  )
}

export default DoneBackupActions
