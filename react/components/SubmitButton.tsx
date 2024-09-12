import React from 'react'
import { useIntl } from 'react-intl'
import { Button } from 'vtex.styleguide'

import messages from '../messages'

interface Props {
  onSubmit: () => void
  isLoading: boolean
  isHidden: boolean
}

const SubmitButton = ({ onSubmit, isLoading, isHidden }: Props) => {
  const intl = useIntl()

  return isHidden ? null : (
    <Button isLoading={isLoading} onClick={onSubmit}>
      {intl.formatMessage(messages.updateButtonLabel)}
    </Button>
  )
}

export default SubmitButton
