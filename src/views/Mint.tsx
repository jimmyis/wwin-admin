import { useCallback, useState } from 'react'
import BigNumber from 'bignumber.js'
import CurrencyInputPanel from 'components/Input/CurrencyInputPanel'
import { useCurrency } from 'hooks/Tokens'
import { getBusdAddress, getWWinAddress, getBathAddress } from 'utils/addressHelpers'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useBathMasterContract, usePancakeRouterContract } from 'hooks/useContract'
import { BATH_MASTER_ADDRESS } from 'configs/constants'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal'
import { useModal } from 'components/Base/Modal'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useGasPrice } from 'state/user/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { CurrencyLogo } from 'components/Logo'
import { calculateGasMargin } from 'utils'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { Link } from 'react-router-dom'
import { useMintFee, useBathPerUsd } from 'hooks/useBathMasterContract'

const Mint: React.FC = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const bathMasterContract = useBathMasterContract()
  const pancakeRouterContract = usePancakeRouterContract()
  const gasPrice = useGasPrice()

  const feeRate = useMintFee()
  const exchangeRate = useBathPerUsd()

  const addTransaction = useTransactionAdder()

  // Amount State
  const [amount, setAmount] = useState(BIG_ZERO)
  const [feeAmount, setFeeAmount] = useState(BIG_ZERO)
  const [receiveAmount, setReceiveAmount] = useState(BIG_ZERO)

  // Get Currency
  const busdAddress = getBusdAddress()
  const busdCurrency = useCurrency(busdAddress)
  const busdCurrencyAmount = useCurrencyBalance(account, busdCurrency)
  const busdCurrencyAmountBig = busdCurrencyAmount ? new BigNumber(busdCurrencyAmount.toSignificant()) : BIG_ZERO

  const wwinAddress = getWWinAddress()
  const wwinCurrency = useCurrency(wwinAddress)
  const wwinCurrencyAmount = useCurrencyBalance(account, wwinCurrency)
  const wwinCurrencyAmountBig = wwinCurrencyAmount ? new BigNumber(wwinCurrencyAmount.toSignificant()) : BIG_ZERO

  const bathAddress = getBathAddress()
  const bathCurrency = useCurrency(bathAddress)

  // Approve
  const [approvalA, approveACallback] = useApproveCallback(busdCurrencyAmount, BATH_MASTER_ADDRESS)
  const [approvalB, approveBCallback] = useApproveCallback(wwinCurrencyAmount, BATH_MASTER_ADDRESS)

  // modal and loading
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('')

  // Handle Event
  const mintText =
    wwinCurrency && bathCurrency && busdCurrency
      ? `${receiveAmount.toString()} ${bathCurrency.symbol} by ${amount.toString()} ${
          busdCurrency.symbol
        } and ${feeAmount.toString()} ${wwinCurrency.symbol}`
      : ''

  const handleTypeInput = useCallback(
    (val) => {
      if (val.toNumber()) {
        setAmount(val)

        const busdAmount = new BigNumber(val).times(BIG_TEN.pow(18)).toString(10)
        pancakeRouterContract.getAmountsOut(busdAmount, [busdAddress, bathAddress]).then(([_, _busd]) => {
          const bathAmount = new BigNumber(_busd.toString()).div(BIG_TEN.pow(18))
          const wWinFee = bathAmount.times(feeRate).dp(10, 1)

          setFeeAmount(wWinFee)
          setReceiveAmount(bathAmount)
        })
      } else {
        setAmount(BIG_ZERO)
        setFeeAmount(BIG_ZERO)
        setReceiveAmount(BIG_ZERO)
      }
    },
    [feeRate, exchangeRate],
  )

  const handleMint = async () => {
    if (!chainId || !library || !account) return

    const mintAmount = amount.times(BIG_TEN.pow(18)).toString(10)
    const estimate = bathMasterContract.estimateGas.mint
    const method = bathMasterContract.mint

    setAttemptingTxn(true)
    await estimate(mintAmount)
      .then((estimatedGasLimit) =>
        method(mintAmount, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
          gasPrice,
        })
          .then((response) => {
            setAttemptingTxn(false)

            addTransaction(response, {
              summary: `Mint ${mintText}`,
            })

            setTxHash(response.hash)
          })
          .catch((err) => {
            setAttemptingTxn(false)
            // we only care if the error is something _other_ than the user rejected the tx
            if (err?.code !== 4001) {
              console.error(err)
            }
          }),
      )
      .catch((err) => {
        setAttemptingTxn(false)
        console.error(err)
      })
  }

  // Mint Confirm Modal
  const MintModalBottom = () => {
    return (
      <>
        <div className="my-1">
          <div className="flex items-center justify-between">
            <span>{busdCurrency.symbol} Deposited</span>
            <div className="flex items-center">
              <CurrencyLogo currency={busdCurrency} />
              <span className="ml-2">{amount.toString()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between my-3">
            <span>{wwinCurrency.symbol} Fee</span>
            <div className="flex items-center">
              <CurrencyLogo currency={wwinCurrency} />
              <span className="ml-2">{feeAmount.toString()}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>{bathCurrency.symbol} Received</span>
            <div className="flex items-center">
              <CurrencyLogo currency={bathCurrency} />
              <span className="ml-2">{receiveAmount.toString()}</span>
            </div>
          </div>
        </div>
        <div className="pt-5">
          <button className="button is-primary w-full text-xl py-3" onClick={handleMint}>
            Confirm Mint
          </button>
        </div>
      </>
    )
  }

  const pendingText = `Minting ${mintText}`

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      setAmount(BIG_ZERO)
    }
    setTxHash('')
  }, [setAmount, txHash])

  const [onPresentMintBathModal] = useModal(
    <TransactionConfirmationModal
      title={'You will receive'}
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={() => <ConfirmationModalContent topContent={() => null} bottomContent={() => <MintModalBottom />} />}
      pendingText={pendingText}
      currencyToAdd={bathCurrency}
    />,
    true,
    'confirmMintBathModal',
  )

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex items-center w-full">
          <div className="flex items-center mx-auto bg-black-50 p-1 rounded-full">
            <Link to="mint" className="px-5 py-1 bg-blue-500 rounded-full text-lg text-white mr-2">
              Mint
            </Link>
            <Link to="redeem" className="px-5 py-1 rounded-full text-lg">
              Redeem
            </Link>
          </div>
        </div>

        <div className="card max-w-md mx-auto p-4 mt-3">
          <h3 className="text-center">Mint {bathCurrency.symbol}</h3>

          <div className="mt-4">
            <CurrencyInputPanel
              id="input-stable-token"
              label={'Input'}
              value={amount}
              onValueChange={handleTypeInput}
              currency={busdCurrency}
              showMaxButton
              thousandSeparator={false}
              readonly={!feeRate || !exchangeRate}
            />
          </div>
          <div className="mt-4">
            <CurrencyInputPanel
              id="input-fee-token"
              label={'Fee'}
              value={feeAmount}
              currency={wwinCurrency}
              disableCurrencySelect
              readonly
              thousandSeparator={false}
            />
          </div>

          <div className="mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-arrow-down-short"
              style={{ margin: 'auto' }}
              viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"
              />
            </svg>
          </div>

          <div className="mt-4">
            <CurrencyInputPanel
              id="input-receive-token"
              label={'Receive'}
              value={receiveAmount}
              currency={bathCurrency}
              disableCurrencySelect
              readonly
              thousandSeparator={false}
            />
          </div>

          <div className="mt-4">
            {account ? (
              amount.isZero() || amount.isNaN() ? (
                <button
                  type="button"
                  className="button bg-black-50 text-black-300 border-none w-full text-xl py-3"
                  disabled>
                  Enter an amount
                </button>
              ) : wwinCurrencyAmountBig.isZero() ||
                feeAmount.isGreaterThan(wwinCurrencyAmount.toSignificant()) ||
                wwinCurrencyAmountBig.isNaN() ? (
                <button
                  type="button"
                  className="button bg-error-300 border-none border-error-300 text-error-800 w-full text-xl py-3"
                  disabled>
                  Insufficient {wwinCurrency.symbol} balance
                </button>
              ) : busdCurrencyAmountBig.isZero() ||
                amount.isGreaterThan(busdCurrencyAmount.toSignificant()) ||
                busdCurrencyAmountBig.isNaN() ? (
                <button
                  type="button"
                  className="button bg-error-300 border-none border-error-300 text-error-800 w-full text-xl py-3"
                  disabled>
                  Insufficient {busdCurrency.symbol} balance
                </button>
              ) : (
                <>
                  {(approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED) && (
                    <div className="flex mb-4">
                      {approvalA !== ApprovalState.APPROVED && (
                        <button
                          className="button w-full bg-green-600 hover:bg-green-600 border-none text-white text-lg py-3"
                          onClick={approveACallback}
                          disabled={approvalA === ApprovalState.PENDING}>
                          {approvalA === ApprovalState.PENDING ? (
                            <span>Approving {busdCurrency.symbol}...</span>
                          ) : (
                            <span>Approve {busdCurrency.symbol}</span>
                          )}
                        </button>
                      )}
                      {approvalA !== ApprovalState.APPROVED && approvalB !== ApprovalState.APPROVED && (
                        <span className="mx-2"></span>
                      )}
                      {approvalB !== ApprovalState.APPROVED && (
                        <button
                          className="button w-full bg-green-600 hover:bg-green-600 border-none text-white text-lg py-3"
                          onClick={approveBCallback}
                          disabled={approvalB === ApprovalState.PENDING}>
                          {approvalB === ApprovalState.PENDING ? (
                            <span>Approving {wwinCurrency.symbol}...</span>
                          ) : (
                            <span>Approve {wwinCurrency.symbol}</span>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    className="button w-full is-primary text-xl py-3"
                    disabled={approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
                    onClick={onPresentMintBathModal}>
                    Mint
                  </button>
                </>
              )
            ) : (
              <ConnectWalletButton className="w-full is-primary text-xl py-3" />
            )}
          </div>

          <div className="bg-blue-100 text-blue-900 p-3 rounded-lg mt-3">
            <p>
              Mint {bathCurrency.symbol} Stable Coin by using {busdCurrency.symbol} + fee in {wwinCurrency.symbol}.
            </p>

            <div className="mt-3 grid grid-flow-col justify-between">
              <strong>Rates</strong>
              <b>1 BUSD = 30 BATH</b>
            </div>

            <div className="grid grid-flow-col justify-between">
              <span>Minting fee (wWIN) 1%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Mint
