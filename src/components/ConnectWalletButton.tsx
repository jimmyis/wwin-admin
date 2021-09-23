import useAuth from 'hooks/useAuth'
import useWalletModal from './Menu/UserMenu/WalletModal/useWalletModal'

const ConnectWalletButton = (props) => {
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout)

  return (
    <>
      <button {...props} className={`button ${props.className || ''}`} onClick={onPresentConnectModal}>
        Connect Wallet
      </button>
    </>
  )
}

export default ConnectWalletButton
