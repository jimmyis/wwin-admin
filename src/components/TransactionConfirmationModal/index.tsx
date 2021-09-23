import React, { useCallback } from 'react'
import { ChainId, Currency, Token } from '@pancakeswap/sdk'
import { registerToken } from 'utils/wallet'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import { getBscScanLink } from '../../utils'
import { MetamaskIcon } from 'components/Svg'
import { Modal } from 'components/Base/Modal'
import { InjectedModalProps } from 'components/Base/Modal/types'
import CircleLoader from 'components/Loader/CircleLoader'
import { IoArrowUpCircleOutline, IoCloseCircle } from 'react-icons/io5'

function ConfirmationPendingContent({ pendingText }: { pendingText: string }) {
  return (
    <div className="flex flex-col justify-center items-center text-center">
      <CircleLoader className="square-24 text-blue-400" />
      <div className="mt-5">
        <h4>Waiting For Confirmation</h4>
        <p className="my-2">{pendingText}</p>
        <p className="text-sm text-black-400">Confirm this transaction in your wallet</p>
      </div>
    </div>
  )
}

function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  currencyToAdd,
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
  currencyToAdd?: Currency | undefined
}) {
  const { library } = useActiveWeb3React()

  const token: Token | undefined = wrappedCurrency(currencyToAdd, chainId)

  return (
    <div className="flex flex-col justify-center items-center text-center">
      <IoArrowUpCircleOutline className="text-8xl text-blue-400" />
      <div className="mt-5 flex flex-col items-center w-full">
        <h4>Transaction Submitted</h4>
        {chainId && hash && (
          <a href={getBscScanLink(hash, 'transaction', chainId)} target="_blank" className="link my-4">
            View on BscScan
          </a>
        )}
        {currencyToAdd && library?.provider?.isMetaMask && (
          <button
            onClick={() => registerToken(token.address, token.symbol, token.decimals)}
            className="button border-none bg-warning-100 text-warning-600">
            <span className="mr-2 text-sm">Add {currencyToAdd.symbol} to Metamask</span>
            <MetamaskIcon width="22px" />
          </button>
        )}
        <button onClick={onDismiss} className="button is-primary py-2 mt-7 w-full text-lg">
          Close
        </button>
      </div>
    </div>
  )
}

export function ConfirmationModalContent({
  bottomContent,
  topContent,
}: {
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
}) {
  return (
    <div>
      <div>{topContent()}</div>
      <div>{bottomContent()}</div>
    </div>
  )
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="my-4">
        <IoCloseCircle className="text-8xl text-error-400" />
        <span style={{ textAlign: 'center', width: '85%' }}>{message}</span>
      </div>

      <button onClick={onDismiss} className="button is-primary py-2 mt-7 w-full text-lg">
        Dismiss
      </button>
    </div>
  )
}

interface ConfirmationModalProps {
  title: string
  customOnDismiss?: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
  currencyToAdd?: Currency | undefined
}

const TransactionConfirmationModal: React.FC<InjectedModalProps & ConfirmationModalProps> = ({
  title,
  onDismiss,
  customOnDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd,
}) => {
  const { chainId } = useActiveWeb3React()

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss()
  }, [customOnDismiss, onDismiss])

  if (!chainId) return null

  return (
    <Modal header={title} onDismiss={handleDismiss}>
      {attemptingTxn ? (
        <ConfirmationPendingContent pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={handleDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </Modal>
  )
}

export default TransactionConfirmationModal
