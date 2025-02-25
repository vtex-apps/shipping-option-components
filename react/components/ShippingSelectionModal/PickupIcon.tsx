import React from 'react'

interface Props {
  width?: number
  height?: number
}

const PickupIcon = ({ width = 34, height = 34 }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 34 34"
    fill="none"
  >
    <path
      d="M27.6667 1H6.33333L1 10.6C1 13.5461 3.3872 15.9333 6.33333 15.9333C9.27947 15.9333 11.6667 13.5461 11.6667 10.6C11.6667 13.5461 14.0539 15.9333 17 15.9333C19.9461 15.9333 22.3333 13.5461 22.3333 10.6C22.3333 13.5461 24.7205 15.9333 27.6667 15.9333C30.6128 15.9333 33 13.5461 33 10.6L27.6667 1Z"
      stroke="#3F3F40"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M29 21V33H5V21"
      stroke="#3F3F40"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.7998 33.0001V24.4668H20.1998V33.0001"
      stroke="#3F3F40"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default PickupIcon
