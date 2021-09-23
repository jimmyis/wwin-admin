import { Modal } from 'components/Base/Modal'
import React from 'react'
// import CopyToClipboard from './CopyToClipboard'
import { connectorLocalStorageKey } from './config'
import WalletTransactions from './WalletTransactions'
import CopyAddress from './CopyAddress'

interface Props {
  account: string
  logout: () => void
  onDismiss?: () => void
}

const AccountModal: React.FC<Props> = ({ account, logout, onDismiss = () => null }) => (
  <Modal header="Your wallet" onDismiss={onDismiss}>
    <div className="flex flex-col">
      <CopyAddress account={account} />
      <div className="mt-6 flex justify-between">
        <a href={`https://bscscan.com/address/${account}`} target="_blank" className="link">
          View on BscScan
        </a>
        <button
          className="font-bold text-error-500"
          onClick={() => {
            logout()
            window.localStorage.removeItem(connectorLocalStorageKey)
            onDismiss()
          }}>
          Disconnect
        </button>
      </div>
    </div>
    <div className="mt-6 bg-backdrop -mx-4 -mb-4 px-4 py-3">
      <WalletTransactions />
    </div>
  </Modal>
)

export default AccountModal
