import React from 'react'
import { AlertProps, variants } from './types'
import { IoCloseCircle, IoCloseOutline, IoWarning, IoCheckmarkCircle, IoInformationCircle } from 'react-icons/io5'

const getThemeColor = (variant: AlertProps['variant'] = variants.INFO) => {
  switch (variant) {
    case variants.DANGER:
      return 'text-error-500'
    case variants.WARNING:
      return 'text-warning-500'
    case variants.SUCCESS:
      return 'text-success-500'
    case variants.INFO:
    default:
      return 'text-blue-500'
  }
}

const getIcon = (variant: AlertProps['variant'] = variants.INFO) => {
  const textSize = 'text-2xl'

  switch (variant) {
    case variants.DANGER:
      return <IoCloseCircle className={textSize} />
    case variants.WARNING:
      return <IoWarning className={textSize} />
    case variants.SUCCESS:
      return <IoCheckmarkCircle className={textSize} />
    case variants.INFO:
    default:
      return <IoInformationCircle className={textSize} />
  }
}

const Alert: React.FC<AlertProps> = ({ title, children, variant, onClick }) => {
  const Icon = getIcon(variant)
  const classTextColor = getThemeColor(variant)

  return (
    <div className={`alert ${classTextColor}`}>
      <div className="alert-icon">{Icon}</div>
      <div className="alert-content">
        <span className="text-black-500">{title}</span>
        {typeof children === 'string' ? <p className="text-black-500">{children}</p> : children}
      </div>
      {onClick && (
        <button className="alert-close" onClick={onClick}>
          <IoCloseOutline className="text-2xl text-black-400" />
        </button>
      )}
    </div>
  )
}

export default Alert
