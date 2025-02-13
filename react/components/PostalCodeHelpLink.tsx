import React from 'react'
import { useIntl } from 'react-intl'
import { helpers } from 'vtex.address-form'
import { Link } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import messages from '../messages'

const POSTAL_CODE_FIELD = 'postalCode'

const CSS_HANDLES = ['postalCodeHelpLink'] as const

interface Props {
  rules?: any
}

const PostalCodeHelpLink = ({ rules }: Props) => {
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)

  let postalCodeFinderURL

  if (rules) {
    const postalCodeField = rules.fields?.find(
      (field: any) => field.name === POSTAL_CODE_FIELD
    )

    postalCodeFinderURL = postalCodeField?.forgottenURL
  }

  if (!postalCodeFinderURL) {
    return null
  }

  return (
    <Link
      href={postalCodeFinderURL}
      target="_blank"
      className={`${handles.postalCodeHelpLink}`}
    >
      {intl.formatMessage(messages.popoverPostalCodeLink)}
    </Link>
  )
}

export default helpers.injectRules(PostalCodeHelpLink)
