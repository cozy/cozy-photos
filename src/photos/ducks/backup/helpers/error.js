const IGNORED_ERRORS = [
  'Backup already preparing',
  'Copia de seguridad ya se está preparando',
  'Sauvegarde déjà en préparation'
]

export const parseBackupError = ({ message }) => {
  try {
    const parsed = JSON.parse(message)

    return {
      message: parsed.message,
      statusCode: parsed.statusCode
    }
  } catch {
    if (IGNORED_ERRORS.includes(message)) {
      return null
    }

    return {
      message
    }
  }
}

export const shouldDisplayQuotaPaywall = backupInfo => {
  return (
    backupInfo?.currentBackup?.status === 'done' &&
    backupInfo?.lastBackup?.code === 413 &&
    !backupInfo.lastBackup?.alreadyDisplayed
  )
}
