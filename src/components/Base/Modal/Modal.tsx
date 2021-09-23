import React, { Fragment } from 'react'
import { ModalProps } from './types'
import { Dialog, Transition } from '@headlessui/react'
import { IoCloseOutline } from 'react-icons/io5'

const Modal: React.FC<ModalProps> = ({
  header,
  headerClassName,
  bodyClassName,
  footerClassName,
  footer,
  onDismiss,
  children,
}) => {
  return (
    <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto modal" onClose={onDismiss}>
      <div className="min-h-screen px-4 text-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <Dialog.Overlay className="fixed inset-0 modal-overlay" />
        </Transition.Child>

        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95">
          <div className="modal-content">
            <button type="button" className="modal-close" onClick={onDismiss}>
              <IoCloseOutline />
            </button>
            <div className={`modal-header ${headerClassName || ''}`}>{header}</div>
            <div className={`modal-body ${bodyClassName || ''}`}>{children}</div>
            {footer && <div className={`modal-footer ${footerClassName || ''}`}>{footer}</div>}
          </div>
        </Transition.Child>
      </div>
    </Dialog>
  )
}

export default Modal
