import minilog from '@cozy/minilog'

const logger = minilog(`cozy-photos`)
minilog.enable()

minilog.suggest.allow(`cozy-photos`, 'log')
minilog.suggest.allow(`cozy-photos`, 'info')

export default logger
