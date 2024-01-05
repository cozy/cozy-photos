import React from 'react'
import cx from 'classnames'

import Icon from 'cozy-ui/transpiled/react/Icon'
import SpinnerIcon from 'cozy-ui/transpiled/react/Icons/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const AnalysisInProgress = ({ mediasLoadedCount }) => {
  const { t } = useI18n()

  const analysisCountText = mediasLoadedCount ? ` (${mediasLoadedCount}) ` : ' '

  return (
    <Typography variant="body1" className={cx('u-mt-1 u-ta-center')}>
      <Icon
        icon={SpinnerIcon}
        spin
        aria-hidden
        focusable="false"
        className="u-mr-half"
      />
      {t('Backup.info.analysisInProgress')}
      {analysisCountText}...
    </Typography>
  )
}

export default AnalysisInProgress
