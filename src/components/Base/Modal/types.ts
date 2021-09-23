export type Handler = () => void

export interface InjectedModalProps {
  onDismiss?: Handler
}

export interface ModalProps extends InjectedModalProps {
  visible?: boolean
  onDismiss?: Handler
  header?: any
  headerClassName?: string
  bodyClassName?: string
  footer?: any
  footerClassName?: string
  onOverlayClick?: Handler
}
