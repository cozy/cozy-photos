import React from 'react'
import ErrorShare from 'components/Error/ErrorShare'
import { Main } from 'cozy-ui/transpiled/react/Layout'

const ErrorUnsharedComponent = () => (
  <Main className="u-pt-1-half">
    <ErrorShare errorType={`public_album_unshared`} />
  </Main>
)

export default ErrorUnsharedComponent
