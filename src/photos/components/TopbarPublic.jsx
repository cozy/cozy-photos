import React from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import BarTitle from 'cozy-ui/transpiled/react/BarTitle'
import { BarCenter, BarRight } from 'cozy-bar'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'

import { CozyHomeLink } from 'components/Button'
import MoreMenu from './MoreMenu'
import { createCozy, download } from './actions'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const TopbarPublic = ({ title, onDownload }) => {
  const { isMobile } = useBreakpoints()
  const { t } = useI18n()

  if (isMobile) {
    return (
      <>
        <BarCenter>
          <BarTitle>
            <span className="u-ml-1">{title}</span>
          </BarTitle>
        </BarCenter>
        <BarRight>
          <MoreMenu
            actions={[
              createCozy,
              download(onDownload, t('Toolbar.album_download'))
            ]}
          />
        </BarRight>
      </>
    )
  }

  return (
    <div className="u-flex u-mh-2 u-flex-items-baseline">
      <Typography variant="h3">{title}</Typography>
      <CozyHomeLink className="u-ml-auto" />
      <Button
        className="u-ml-half"
        variant="secondary"
        onClick={() => onDownload()}
        startIcon={<Icon icon={DownloadIcon} />}
        label={t('Toolbar.album_download')}
      />
    </div>
  )
}

export { TopbarPublic }
