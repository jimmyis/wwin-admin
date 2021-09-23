import { connectorLocalStorageKey, walletLocalStorageKey } from './config'
import { Login, Config, ConnectorNames } from './types'

interface Props {
  walletConfig: Config
  login: Login
  onDismiss: () => void
}

const CardClassNames = `flex flex-col items-center justify-center border border-black-50 py-2 rounded-lg cursor-pointer hover:border-black-100 hover:bg-backdrop`

export const MoreWalletCard: React.FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>> = (
  props,
) => {
  return (
    <div className={`${CardClassNames}`} {...props}>
      More
    </div>
  )
}

const WalletCard: React.FC<Props> = ({ login, walletConfig, onDismiss }) => {
  const { title, icon: Icon } = walletConfig

  const onSelected = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

    // Since iOS does not support Trust Wallet we fall back to WalletConnect
    if (walletConfig.title === 'Trust Wallet' && isIOS) {
      login(ConnectorNames.WalletConnect)
    } else {
      login(walletConfig.connectorId)
    }

    localStorage.setItem(walletLocalStorageKey, walletConfig.title)
    localStorage.setItem(connectorLocalStorageKey, walletConfig.connectorId)
    onDismiss()
  }

  return (
    <div className={`${CardClassNames}`} onClick={onSelected}>
      <Icon width="48px" />
      <div className="mt-2">{title}</div>
    </div>
  )
}

export default WalletCard
