import React from 'react'

interface Props {
  filled?: boolean
}

const PinIcon = ({ filled = true }: Props) =>
  filled ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      width="16"
      height="16"
      viewBox="0 0 256 256"
      xmlSpace="preserve"
    >
      <defs />
      <g
        transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
        style={{
          stroke: 'none',
          strokeWidth: 0,
          strokeDasharray: 'none',
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
          fill: 'none',
          fillRule: 'nonzero',
          opacity: 1,
        }}
      >
        <path
          style={{
            stroke: 'none',
            strokeWidth: 1,
            strokeDasharray: 'none',
            strokeLinecap: 'butt',
            strokeLinejoin: 'miter',
            strokeMiterlimit: 10,
            fill: '#727273',
            fillRule: 'nonzero',
            opacity: 1,
          }}
          d="M 45 0 C 25.463 0 9.625 15.838 9.625 35.375 c 0 8.722 3.171 16.693 8.404 22.861 L 45 90 l 26.97 -31.765 c 5.233 -6.167 8.404 -14.139 8.404 -22.861 C 80.375 15.838 64.537 0 45 0 z M 45 48.705 c -8.035 0 -14.548 -6.513 -14.548 -14.548 c 0 -8.035 6.513 -14.548 14.548 -14.548 s 14.548 6.513 14.548 14.548 C 59.548 42.192 53.035 48.705 45 48.705 z"
          transform=" matrix(1 0 0 1 0 0) "
          strokeLinecap="round"
        />
      </g>
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
    >
      <path
        d="M12.7082 1.04199C13.8985 1.08233 15.0692 1.3569 16.1533 1.85001C17.2375 2.34312 18.2138 3.04509 19.0264 3.91578C19.8391 4.78648 20.4721 5.80882 20.8894 6.92435C21.3066 8.03988 21.4999 9.22671 21.4582 10.417C21.4582 15.6253 14.5832 23.9587 12.4998 23.9587C10.4165 23.9587 3.5415 15.417 3.5415 10.417C3.55147 7.96947 4.51399 5.62199 6.22511 3.87198C7.93623 2.12198 10.2615 1.10695 12.7082 1.04199ZM12.4998 13.542C12.9931 13.5448 13.4819 13.4496 13.9382 13.2622C14.3944 13.0747 14.8089 12.7986 15.1576 12.4498C15.5064 12.101 15.7825 11.6865 15.97 11.2303C16.1575 10.7741 16.2526 10.2852 16.2498 9.79199C16.2319 8.83834 15.859 7.92565 15.2041 7.23221C14.5492 6.53877 13.6592 6.1144 12.7082 6.04199C12.1992 6.01665 11.6903 6.09474 11.2124 6.27155C10.7344 6.44836 10.2972 6.72022 9.92727 7.07071C9.5573 7.4212 9.26223 7.84305 9.05986 8.31077C8.85749 8.77849 8.75202 9.28237 8.74984 9.79199C8.81348 10.7656 9.229 11.6829 9.91895 12.3729C10.6089 13.0628 11.5262 13.4783 12.4998 13.542Z"
        stroke="#505050"
        strokeWidth="1.5"
        strokeMiterlimit="10"
      />
    </svg>
  )

export default PinIcon
