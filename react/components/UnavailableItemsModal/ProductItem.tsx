import React from 'react'

interface Props {
  imageUrl: string
  productName: string
}

const ProductItem = ({ imageUrl, productName }: Props) => {
  return (
    <div className="flex flex-row pa5 bg-base t-body c-on-base br3 b--muted-4 ba mb5">
      <img
        className="br2"
        style={{ width: '64px', height: '64px' }}
        src={imageUrl}
        alt={productName}
      />
      <p className="ml6">{productName}</p>
    </div>
  )
}

export default ProductItem
