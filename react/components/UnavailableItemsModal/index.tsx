/* eslint-disable no-restricted-globals */
import React, { useState } from 'react'
import { Button } from 'vtex.styleguide'
import { useIntl } from 'react-intl'

import Modal from '../Modal'
import ProductItem from './ProductItem'
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
  onRemoveItems: () => void
  unavailableCartItems: CartItem[]
  unavailabilityMessage?: string
}

const UnavailableItemsModal = ({
  isOpen,
  onClose,
  onTryAgain,
  onRemoveItems,
  unavailableCartItems,
  unavailabilityMessage,
}: Props) => {
  const intl = useIntl()

  const [isLoading, setIsLoading] = useState(false)

  const handleRemoveItemsClick = async () => {
    setIsLoading(true)
    await onRemoveItems()

    onClose()
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
        <p className="mid-gray ma0">{unavailabilityMessage}</p>
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
