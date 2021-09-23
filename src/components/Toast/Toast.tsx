import { Alert, alertVariants } from 'components/Alert'
import React, { useCallback, useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { ToastProps, types } from './types'

const alertTypeMap = {
  [types.INFO]: alertVariants.INFO,
  [types.SUCCESS]: alertVariants.SUCCESS,
  [types.DANGER]: alertVariants.DANGER,
  [types.WARNING]: alertVariants.WARNING,
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove, style, ttl, ...props }) => {
  const timer = useRef<number>()
  const ref = useRef(null)
  const removeHandler = useRef(onRemove)
  const { id, title, description, type } = toast

  const handleRemove = useCallback(() => removeHandler.current(id), [id, removeHandler])

  const handleMouseEnter = () => {
    clearTimeout(timer.current)
  }

  const handleMouseLeave = () => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = window.setTimeout(() => {
      handleRemove()
    }, ttl)
  }

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = window.setTimeout(() => {
      handleRemove()
    }, ttl)

    return () => {
      clearTimeout(timer.current)
    }
  }, [timer, ttl, handleRemove])

  return (
    <CSSTransition nodeRef={ref} timeout={250} style={style} {...props}>
      <div className="toast" ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Alert title={title} variant={alertTypeMap[type]} onClick={handleRemove}>
          {description}
        </Alert>
      </div>
    </CSSTransition>
  )
}

export default Toast
