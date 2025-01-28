import React, { useState } from 'react'
import ReactModal from 'react-modal'
import { IconClose } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import NoPickupsState from './NoPickupsState'
import AddLocation from './AddLocation'

const CSS_HANDLES = ['modalCloseButton']

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '64px 40px',
    transform: 'translate(-50%, -50%)',
    borderRadius: '12px',
    minWidth: '520px',
    minHeight: '388px',
    maxHeight: '640px',
    display: 'flex',
    'flex-direction': 'column',
  },
  overlay: {
    backgroundColor: 'rgba(3, 4, 78, 0.55)',
    zIndex: '99999',
  },
}

interface Props {
  isOpen: boolean
  onChange: (zipCode?: string) => void
  onSubmit: (reload?: boolean, validateAndReload?: boolean) => Promise<any>
  isLoading?: boolean
  inputErrorMessage?: string
  zipCode?: string
  isAvaliablePickups: boolean
  showCloseButton?: boolean
}

export const Modal = ({
  isOpen,
  onChange,
  onSubmit,
  isLoading,
  inputErrorMessage,
  zipCode,
  isAvaliablePickups,
  showCloseButton = false,
}: Props) => {
  const [openNoPickupState, setOpenNoPickupState] = useState(false)
  const handles = useCssHandles(CSS_HANDLES)

  const modalStyles = {
    ...customStyles,
    content: {
      ...customStyles.content,
      padding: showCloseButton ? '40px' : '64px 40px',
    },
  }

  return (
    <ReactModal style={modalStyles} isOpen={isOpen && !isAvaliablePickups}>
      {showCloseButton && (
        <button onClick={() => {}} className={handles.modalCloseButton}>
          <IconClose size={24} />
        </button>
      )}
      {openNoPickupState ? (
        <NoPickupsState
          zipCode={zipCode ?? ''}
          onClick={() => setOpenNoPickupState(false)}
        />
      ) : (
        <AddLocation
          onChange={onChange}
          onSubmit={async () => {
            const response = await onSubmit(false, true)

            if (response) {
              setOpenNoPickupState(true)
            }
          }}
          isLoading={isLoading}
          inputErrorMessage={inputErrorMessage}
          zipCode={zipCode}
        />
      )}
    </ReactModal>
  )
}
