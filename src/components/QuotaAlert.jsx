import React from 'react'
import UIQuotaAlert from 'cozy-ui-plus/dist/Paywall/QuotaPaywall'

import flag from 'cozy-flags'

const QuotaAlert = ({ onClose }) => {
  return (
    <UIQuotaAlert
      isIapEnabled={flag('flagship.iap.enabled')}
      onClose={onClose}
    />
  )
}

export default QuotaAlert
