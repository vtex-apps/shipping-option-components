import React, { PropsWithChildren } from 'react'
import ReactModal from 'react-modal'
import { useCssHandles } from 'vtex.css-handles'
import { useDevice } from 'vtex.device-detector'
import { IconArrowBack } from 'vtex.styleguide'

interface Props {
  onClose: () => void
  isOpen: boolean
  title: string
  showArrowBack: boolean
  onArrowBack: () => void
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '40px',
    transform: 'translate(-50%, -50%)',
    borderRadios: '12px',
    minHeight: '388px',
    maxHeight: '640px',
    width: 'unset',
    minWidth: 'unset',
  },
  overlay: {
    backgroundColor: 'rgba(3, 4, 78, 0.55)',
    zIndex: '99999',
    width: '100vw',
    height: '100vh',
  },
}

const CSS_HANDLES = [
  'modalCloseButton',
  'modalBackButton',
  'shippingMethodModalTitle',
]

const Modal = ({
  children,
  isOpen,
  title,
  onArrowBack,
  showArrowBack,
}: PropsWithChildren<Props>) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { isMobile } = useDevice()

  if (isMobile) {
    customStyles.content.width = '100%'
  } else {
    customStyles.content.minWidth = '522px'
  }

  return (
    <ReactModal style={customStyles} isOpen={isOpen}>
      <div className="flex justify-between items-center mb3">
        <div className="flex items-center flex-row">
          {showArrowBack && (
            <button
              className={`pa0 mr3 ${handles.modalBackButton}`}
              onClick={onArrowBack}
            >
              <IconArrowBack />
            </button>
          )}
          <p className={`f3 fw6 ma0 ${handles.shippingMethodModalTitle}`}>
            {title}
          </p>
        </div>
      </div>
      {children}
    </ReactModal>
  )
}

export default Modal
