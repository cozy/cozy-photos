import React from 'react'
import classNames from 'classnames'

import { translate } from 'cozy-ui/transpiled/react/providers/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import styles from '../styles/loading.styl'

export const Loading = ({
  size = 'xxlarge',
  loadingType,
  noMargin = false,
  middle = true
}) => {
  return (
    <div data-testid="loading" className={classNames(styles['pho-loading'])}>
      <Spinner
        size={size}
        loadingType={loadingType}
        color="var(--primaryColor)"
        noMargin={noMargin}
        middle={middle}
      />
    </div>
  )
}

export default translate()(Loading)
