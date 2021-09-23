import { useModal } from 'components/Base/Modal'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useAuth from 'hooks/useAuth'
import AccountModal from './WalletModal/AccountModal'
import { IoWalletOutline } from 'react-icons/io5'

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

const UserMenu: React.FC<Props> = (props) => {
  const { account } = useActiveWeb3React()
  const { logout } = useAuth()
  const [onPresentAccountModal] = useModal(<AccountModal account={account} logout={logout} />)
  const accountEllipsis = account ? `${account.substring(0, 2)}...${account.substring(account.length - 4)}` : null

  const UserAccount = () => {
    return (
      <button onClick={() => onPresentAccountModal()} className="button pl-3 is-primary">
        <IoWalletOutline className="text-2xl mr-2" />
        <span>{accountEllipsis}</span>
      </button>
    )
  }

  return <div {...props}>{!account ? <ConnectWalletButton /> : <UserAccount />}</div>
}

export default UserMenu
