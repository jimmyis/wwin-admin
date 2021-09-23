import React, { useState } from 'react'
import { Modal, ModalProps } from 'components/Base/Modal'
import WalletCard, { MoreWalletCard } from './WalletCard'
import config, { walletLocalStorageKey } from './config'
import { Config, Login } from './types'

interface Props extends ModalProps {
  login: Login
  displayCount?: number
}

/**
 * Checks local storage if we have saved the last wallet the user connected with
 * If we find something we put it at the top of the list
 *
 * @returns sorted config
 */
const getPreferredConfig = (walletConfig: Config[]) => {
  const preferredWalletName = localStorage.getItem(walletLocalStorageKey)
  const sortedConfig = walletConfig.sort((a: Config, b: Config) => a.priority - b.priority)

  if (!preferredWalletName) {
    return sortedConfig
  }

  const preferredWallet = sortedConfig.find((sortedWalletConfig) => sortedWalletConfig.title === preferredWalletName)

  if (!preferredWallet) {
    return sortedConfig
  }

  return [
    preferredWallet,
    ...sortedConfig.filter((sortedWalletConfig) => sortedWalletConfig.title !== preferredWalletName),
  ]
}

const ConnectModal: React.FC<Props> = ({ login, onDismiss = () => null, displayCount = 3 }) => {
  const [showMore, setShowMore] = useState(false)
  const sortedConfig = getPreferredConfig(config)
  const displayListConfig = showMore ? sortedConfig : sortedConfig.slice(0, displayCount)

  return (
    <Modal onDismiss={onDismiss} header={'Connect Wallet'}>
      <div className="grid grid-cols-2 gap-2">
        {displayListConfig.map((wallet, walletIndex) => (
          <WalletCard walletConfig={wallet} login={login} onDismiss={onDismiss} key={`wallet-${walletIndex}`} />
        ))}
        {!showMore && <MoreWalletCard onClick={() => setShowMore(true)} />}
      </div>
    </Modal>
  )
}

export default ConnectModal
