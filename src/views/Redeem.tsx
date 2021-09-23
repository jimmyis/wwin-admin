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
import { useBathPerUsd, useMintFee, useRedeemFee } from 'hooks/useBathMasterContract'
import { useBathTotalSupply } from 'hooks/useBathContract'

const Redeem: React.FC = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const bathMasterContract = useBathMasterContract()
  const pancakeRouterContract = usePancakeRouterContract()
  const gasPrice = useGasPrice()

  const feeRate = useRedeemFee()
  const exchangeRate = useBathPerUsd()

  const addTransaction = useTransactionAdder()

  // Amount State
  const [amount, setAmount] = useState<BigNumber>(BIG_ZERO)
  const [feeAmount, setFeeAmount] = useState<BigNumber>(BIG_ZERO)
  const [receiveAmount, setReceiveAmount] = useState<BigNumber>(BIG_ZERO)

  // Get Currency
  const busdAddress = getBusdAddress()
  const busdCurrency = useCurrency(busdAddress)

  const wwinAddress = getWWinAddress()
  const wwinCurrency = useCurrency(wwinAddress)
  const wwinCurrencyAmount = useCurrencyBalance(account, wwinCurrency)
  const wwinCurrencyAmountBig: BigNumber = wwinCurrencyAmount
    ? new BigNumber(wwinCurrencyAmount.toSignificant())
    : BIG_ZERO

  const bathAddress = getBathAddress()
  const bathCurrency = useCurrency(bathAddress)
  const bathCurrencyAmount = useCurrencyBalance(account, bathCurrency)
  const bathCurrencyAmountBig: BigNumber = bathCurrencyAmount
    ? new BigNumber(bathCurrencyAmount.toSignificant())
    : BIG_ZERO

  const wwinAmountOfBathMaster = useCurrencyBalance(BATH_MASTER_ADDRESS, wwinCurrency)
  const wwinAmountOfBathMasterBig: BigNumber = wwinAmountOfBathMaster
    ? new BigNumber(wwinAmountOfBathMaster.toSignificant())
    : BIG_ZERO

  // Bath Contract
  const bathTotalSupply = useBathTotalSupply()

  // Approve
  const [approvalA, approveACallback] = useApproveCallback(bathCurrencyAmount, BATH_MASTER_ADDRESS)
  const [approvalB, approveBCallback] = useApproveCallback(wwinCurrencyAmount, BATH_MASTER_ADDRESS)

  // modal and loading
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('')

  // Handle Event
  const redeemText =
    wwinCurrency && bathCurrency && busdCurrency
      ? `${receiveAmount.toString()} ${busdCurrency.symbol} by ${amount.toString()} ${
          bathCurrency.symbol
        } and ${feeAmount.toString()} ${wwinCurrency.symbol}`
      : ''

  const handleTypeInput = useCallback(
    (val) => {
      if (!bathTotalSupply || !feeRate || !exchangeRate || wwinCurrencyAmountBig.isZero()) return
      if (val.toNumber()) {
        setAmount(val)

        const bathAmount = new BigNumber(val).times(BIG_TEN.pow(18)).toString(10)
        pancakeRouterContract.getAmountsOut(bathAmount, [bathAddress, busdAddress]).then(([_, _bath]) => {
          const busdAmount = new BigNumber(_bath.toString()).div(BIG_TEN.pow(18))
          const wWinFee = busdAmount.times(feeRate).dp(10, 1)

          setFeeAmount(wWinFee)
          setReceiveAmount(busdAmount)
        })
      } else {
        setAmount(BIG_ZERO)
        setFeeAmount(BIG_ZERO)
        setReceiveAmount(BIG_ZERO)
      }
    },
    [feeRate, exchangeRate, bathTotalSupply],
  )

  const handleRedeem = async () => {
    if (!chainId || !library || !account) return

    const redeemAmount = amount.times(new BigNumber(BIG_TEN).pow(18)).toString(10)
    const estimate = bathMasterContract.estimateGas.redeem
    const method = bathMasterContract.redeem

    setAttemptingTxn(true)
    await estimate(redeemAmount)
      .then((estimatedGasLimit) =>
        method(redeemAmount, {
          gasLimit: calculateGasMargin(estimatedGasLimit),
          gasPrice,
        })
          .then((response) => {
            setAttemptingTxn(false)

            addTransaction(response, {
              summary: `Redeem ${redeemText}`,
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

  // Redeem Confirm Modal
  const RedeemModalBottom = () => {
    return (
      <>
        <div className="my-1">
          <div className="flex items-center justify-between">
            <span>{bathCurrency.symbol} Redeemed</span>
            <div className="flex items-center">
              <CurrencyLogo currency={bathCurrency} />
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
            <span>{busdCurrency.symbol} Received</span>
            <div className="flex items-center">
              <CurrencyLogo currency={busdCurrency} />
              <span className="ml-2">{receiveAmount.toString()}</span>
            </div>
          </div>
        </div>
        <div className="pt-5">
          <button className="button is-primary w-full text-xl py-3" onClick={handleRedeem}>
            Confirm Redeem
          </button>
        </div>
      </>
    )
  }

  const pendingText = `Redeeming ${redeemText}`

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      setAmount(BIG_ZERO)
    }
    setTxHash('')
  }, [setAmount, txHash])

  const [onPresentRedeemBathModal] = useModal(
    <TransactionConfirmationModal
      title={'You will receive'}
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={() => <ConfirmationModalContent topContent={() => null} bottomContent={() => <RedeemModalBottom />} />}
      pendingText={pendingText}
      currencyToAdd={busdCurrency}
    />,
    true,
    'confirmRedeemBathModal',
  )

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex items-center w-full">
          <div className="flex items-center mx-auto bg-black-50 p-1 rounded-full">
            <Link to="mint" className="px-5 py-1 rounded-full text-lg mr-2">
              Mint
            </Link>
            <Link to="redeem" className="px-5 py-1 bg-blue-500 rounded-full text-lg text-white">
              Redeem
            </Link>
          </div>
        </div>

        <div className="card max-w-md mx-auto p-4 mt-3">
          <h3 className="text-center">Redeem {bathCurrency.symbol}</h3>

          <div className="mt-4">
            <CurrencyInputPanel
              id="input-stable-token"
              label={'Input'}
              value={amount}
              onValueChange={handleTypeInput}
              currency={bathCurrency}
              showMaxButton
              thousandSeparator={false}
              disableCurrencySelect
              readonly={!feeRate || !exchangeRate || !bathTotalSupply}
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
              currency={busdCurrency}
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
              ) : bathCurrencyAmountBig.isZero() ||
                amount.isGreaterThan(bathCurrencyAmount.toSignificant()) ||
                bathCurrencyAmountBig.isNaN() ? (
                <button
                  type="button"
                  className="button bg-error-300 border-none border-error-300 text-error-800 w-full text-xl py-3"
                  disabled>
                  Insufficient {bathCurrency.symbol} balance
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
                            <span>Approving {bathCurrency.symbol}...</span>
                          ) : (
                            <span>Approve {bathCurrency.symbol}</span>
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
                    onClick={onPresentRedeemBathModal}>
                    Redeem
                  </button>
                </>
              )
            ) : (
              <ConnectWalletButton className="w-full is-primary text-xl py-3" />
            )}
          </div>

          <div className="bg-blue-100 text-blue-900 p-3 rounded-lg mt-3">
            <p>
              Redeem {busdCurrency.symbol} by using {bathCurrency.symbol} + fee in {wwinCurrency.symbol}.
            </p>

            <div className="mt-3">
              <p>30 BATH = 1 BUSD</p>
              <p>Redeem Fee (wWin) 0.5%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Redeem
