import cx from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'

import FileInput from 'cozy-ui/transpiled/react/FileInput'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import UploadIcon from 'cozy-ui/transpiled/react/Icons/Upload'

const UploadButton = ({ label, inMenu, disabled, onUpload, className }) => (
  <FileInput
    accept="image/*"
    className={cx(className)}
    data-testid="upload-btn"
    disabled={disabled}
    multiple
    onChange={onUpload}
    value={[]} // always erase the value to be able to re-upload the same file
  >
    {inMenu ? (
      <span>
        <span>{label}</span>
      </span>
    ) : (
      <Button
        component="div"
        label={label}
        startIcon={<Icon icon={UploadIcon} />}
      />
    )}
  </FileInput>
)

UploadButton.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  inMenu: PropTypes.bool,
  onUpload: PropTypes.func.isRequired,
  className: PropTypes.string
}

UploadButton.defaultProps = {
  disabled: false,
  inMenu: false
}

export default UploadButton
