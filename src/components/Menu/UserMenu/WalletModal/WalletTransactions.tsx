import React from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import { useAllTransactions } from 'state/transactions/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { clearAllTransactions } from 'state/transactions/actions'
import { orderBy } from 'lodash'
import { TransactionDetails } from 'state/transactions/reducer'
import { getBscScanLink } from 'utils'
import CircleLoader from 'components/Loader/CircleLoader'
import { IoCheckmarkCircleOutline, IoCloseOutline, IoOpenOutline } from 'react-icons/io5'

const WalletTransactions: React.FC = () => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()

  const allTransactions = useAllTransactions()
  const sortedTransactions = orderBy(allTransactions, 'addedTime', 'desc')

  const handleClearAll = () => {
    if (chainId) {
      dispatch(clearAllTransactions({ chainId }))
    }
  }

  const renderIcon = (txn: TransactionDetails) => {
    if (!txn.receipt) {
      return <CircleLoader className="text-blue-500" />
    }

    return txn.receipt?.status === 1 || typeof txn.receipt?.status === 'undefined' ? (
      <IoCheckmarkCircleOutline className="text-success-600" />
    ) : (
      <IoCloseOutline className="text-error-600" />
    )
  }

  const TransactionRow = ({ txn }) => {
    if (!txn) {
      return null
    }

    return (
      <a href={getBscScanLink(txn.hash, 'transaction', chainId)} target="_blank" className="flex py-1 hover:underline">
        <div>{renderIcon(txn)}</div>
        <span className="flex-1 mx-1 text-sm text-blue-800">{txn.summary ?? txn.hash}</span>
        <div>
          <IoOpenOutline className="text-blue-700" />
        </div>
      </a>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-sm">Recent Transactions</h5>
        {sortedTransactions.length > 0 && (
          <button className="text-sm text-error-400" onClick={handleClearAll}>
            (Clear all)
          </button>
        )}
      </div>
      {sortedTransactions.length > 0 ? (
        sortedTransactions.map((txn) => <TransactionRow key={txn.hash} txn={txn} />)
      ) : (
        <p className="text-center py-11 text-black-300">No recent transactions</p>
      )}
    </div>
  )
}

export default WalletTransactions
