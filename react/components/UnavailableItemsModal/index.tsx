/* eslint-disable no-restricted-globals */
import React, { useState } from 'react'
import { Button } from 'vtex.styleguide'
import { useIntl } from 'react-intl'

import Modal from '../Modal'
import ProductItem from './ProductItem'
import { removeCartProductsById } from '../../client'
import { getOrderFormId } from '../../utils/cookie'
import messages from '../../messages'

export type CartProduct = { id: string; name: string; imageUrl: string }

export type CartItem = {
  cartItemIndex: number
  product: CartProduct
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onTryAgain: () => void
  addressLabel: string
  unavailableCartItems: CartItem[]
}

const UnavailableItemsModal = ({
  isOpen,
  onClose,
  onTryAgain,
  addressLabel,
  unavailableCartItems,
}: Props) => {
  const intl = useIntl()

  const [isLoading, setIsLoading] = useState(false)

  const handleRemoveItemsClick = () => {
    const orderFormId = getOrderFormId()

    setIsLoading(true)
    removeCartProductsById(
      orderFormId,
      unavailableCartItems.map((item) => item.cartItemIndex)
    ).then(() => setIsLoading(false))

    onClose()
    location.reload()
  }

  return (
    <Modal
      showArrowBack={false}
      isTopCloseButton={false}
      title={intl.formatMessage(messages.unavailableItemsModalTitle)}
      isOpen={isOpen}
      onClose={onClose}
      nonDismissible
    >
      <div className="flex-auto flex flex-column justify-between mt0">
        <p className="mid-gray ma0">
          {intl.formatMessage(messages.unavailableItemsModalDescription, {
            addressLabel: ` ${addressLabel}`,
          })}
        </p>
        <div className="mv7 overflow-auto">
          {unavailableCartItems.map(({ product }) => (
            <ProductItem
              key={product.id}
              imageUrl={product.imageUrl}
              productName={product.name}
            />
          ))}
        </div>
        <div style={{ gap: '.75rem' }} className="flex flex-column">
          <Button
            className="mb3"
            isLoading={isLoading}
            onClick={handleRemoveItemsClick}
          >
            {intl.formatMessage(messages.unavailableItemsModalRemoveButton)}
          </Button>
          <Button
            isLoading={isLoading}
            variation="secondary"
            onClick={onTryAgain}
          >
            {intl.formatMessage(messages.unavailableItemsModalRetryButton)}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default UnavailableItemsModal
