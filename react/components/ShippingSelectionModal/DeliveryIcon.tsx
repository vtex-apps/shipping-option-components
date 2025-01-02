import React from 'react'

interface Props {
  width?: number
  height?: number
}

const DeliveryIcon = ({ width = 34, height = 32 }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 34 32"
    fill="none"
  >
    <path
      d="M8.27603 16H3.91309"
      stroke="#3F3F40"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.2767 23.5007H6.82239"
      stroke="#3F3F40"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25.4797 25.0012H32C32.5523 25.0012 33 24.5535 33 24.0012V16.6103C33 16.236 32.791 15.893 32.4583 15.7215L27.1827 13.0007L25.9137 7.76493C25.805 7.31637 25.4034 7.00049 24.9418 7.00049H14.0939V25.0012H17.2512"
      stroke="#3F3F40"
      strokeWidth="2"
      strokeMiterlimit="10"
    />
    <path
      d="M1 8.5H8.27158"
      stroke="#3F3F40"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 0.999756H14.0888V6.99999"
      stroke="#3F3F40"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.3554 31.0001C23.765 31.0001 25.7183 28.9853 25.7183 26.4999C25.7183 24.0146 23.765 21.9998 21.3554 21.9998C18.9458 21.9998 16.9924 24.0146 16.9924 26.4999C16.9924 28.9853 18.9458 31.0001 21.3554 31.0001Z"
      stroke="#3F3F40"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="square"
    />
  </svg>
)

export default DeliveryIcon
