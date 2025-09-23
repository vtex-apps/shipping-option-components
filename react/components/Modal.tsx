import type { PropsWithChildren } from 'react'
import React from 'react'
import ReactModalComponent from 'react-modal'
import { useCssHandles } from 'vtex.css-handles'
import { useDevice } from 'vtex.device-detector'
import { IconClose, IconArrowBack } from 'vtex.styleguide'

// Work around type issues with react-modal in React 16
const ReactModal = ReactModalComponent as any

interface Props {
  onClose: () => void
  isOpen: boolean
  title: string
  showArrowBack: boolean
  isTopCloseButton: boolean
  nonDismissible?: boolean
  onArrowBack?: () => void
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '40px 40px 64px 40px',
    transform: 'translate(-50%, -50%)',
    borderRadius: '12px',
    minHeight: '388px',
    maxHeight: '640px',
    width: 'unset',
    minWidth: 'unset',
    display: 'flex',
    'flex-direction': 'column',
  },
  overlay: {
    backgroundColor: 'rgba(3, 4, 78, 0.55)',
    zIndex: '99999',
    width: '100vw',
    height: '100vh',
  },
}

const CSS_HANDLES = [
  'modalBackButton',
  'modalCloseButton',
  'shippingMethodModalTitle',
]

const headerActionButtonStyle: React.CSSProperties = {
  cursor: 'pointer',
  backgroundColor: 'unset',
  border: 0,
}

const Modal = ({
  children,
  onClose,
  isOpen,
  title,
  onArrowBack,
  showArrowBack,
  isTopCloseButton,
  nonDismissible = false,
}: PropsWithChildren<Props>) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { isMobile } = useDevice()

  if (isMobile) {
    customStyles.content.width = '100%'
  } else {
    customStyles.content.width = '522px'
    customStyles.content.minWidth = '522px'
  }

  if (nonDismissible) {
    customStyles.content.padding = '64px 40px'
  } else {
    customStyles.content.padding = '40px 40px 64px 40px'
  }

  return (
    <ReactModal
      style={customStyles}
      isOpen={isOpen}
      onRequestClose={nonDismissible ? undefined : onClose}
      ariaHideApp={false}
    >
      <>
        <div
          className={`flex justify-between items-center mb3 ${
            isTopCloseButton ? 'flex-column-reverse' : 'flex-row'
          }`}
        >
          <div className="flex items-center self-start flex-row">
            {showArrowBack && onArrowBack && (
              <button
                className={`pa0 mr4 ${handles.modalBackButton}`}
                onClick={onArrowBack}
              >
                <IconArrowBack />
              </button>
            )}
            <p className={`f3 fw6 ma0 ${handles.shippingMethodModalTitle}`}>
              {title}
            </p>
          </div>

          {!nonDismissible && (
            <div className="flex justify-end self-end">
              <button
                onClick={onClose}
                className={handles.modalCloseButton}
                style={headerActionButtonStyle}
              >
                <IconClose size={24} />
              </button>
            </div>
          )}
        </div>
        {children}
      </>
    </ReactModal>
  )
}

export default Modal
