import React from 'react'
import PropTypes from 'prop-types'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { HOME_LINK_HREF } from 'photos/constants/config'
import CozyHomeLinkIcon from 'components/Button/CozyHomeLinkIcon'

const CozyHomeLink = ({ className }) => {
  const { t } = useI18n()
  return (
    <Button
      component="a"
      label={t('Share.create-cozy')}
      startIcon={<Icon icon={CozyHomeLinkIcon} />}
      className={className}
      href={HOME_LINK_HREF}
    />
  )
}

CozyHomeLink.propTypes = {
  from: PropTypes.string
}

CozyHomeLink.defaultProps = {
  from: ''
}

export default CozyHomeLink
