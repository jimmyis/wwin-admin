import { FC, useCallback, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import CurrencyInputPanel from 'components/Input/CurrencyInputPanel'
import { useCurrency } from 'hooks/Tokens'
import { getBusdAddress, getWWinAddress, getBathAddress, getwBNBAddress } from 'utils/addressHelpers'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useBathMasterContract, usePresaleMasterContract, useSnftDummyContract } from 'hooks/useContract'
import { API_BASE_URL, CHAIN_ID } from 'configs'
import { BATH_MASTER_ADDRESS, PRESALE_MASTER_ADDRESS } from 'configs/constants'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal'
import { useModal } from 'components/Base/Modal'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useGasPrice } from 'state/user/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { calculateGasMargin } from 'utils'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'

import NFTImg from 'assets/images/d52da6ac-a3e8-4607-bcc9-29e263311472.jpeg'
import BNBImg from 'assets/images/bnb.svg'
import { CurrencyLogo } from 'components/Logo'
import CircleLoader from 'components/Loader/CircleLoader'

const unitPrice = 2

const Reserve: FC = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const masterContract = usePresaleMasterContract()
  const nftDummyContract = useSnftDummyContract()

  const gasPrice = useGasPrice()

  const addTransaction = useTransactionAdder()

  const [bnbBalance, setBnbBalance] = useState<BigNumber>(BIG_ZERO)

  // Get Currency
  const wbnbAddress = getwBNBAddress()
  const wbnbCurrency = useCurrency(wbnbAddress)
  const wbnbCurrencyAmount = useCurrencyBalance(account, wbnbCurrency)
  const wbnbCurrencyAmountBig = wbnbCurrencyAmount ? new BigNumber(wbnbCurrencyAmount.toSignificant()) : BIG_ZERO

  // Approve
  const [approval, approveCallback] = useApproveCallback(wbnbCurrencyAmount, PRESALE_MASTER_ADDRESS)

  // modal and loading
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const [txHash, setTxHash] = useState<string>('')

  // Claim
  const [claim, setClaim] = useState<{ dummy: number; logs: any[] }>({ dummy: 0, logs: [] })
  const [claiming, setClaiming] = useState<boolean>(false)

  useEffect(() => {
    if (account) {
      handleFetchClaim()
      handleFetchUserBalance()
    }
  }, [account])

  // Handle Event
  const handleReserve = async () => {
    if (!chainId || !library || !account) return

    const estimate = masterContract.estimateGas.commitBNB
    const method = masterContract.commitBNB
    const value = new BigNumber(unitPrice).times(BIG_TEN.pow(18)).toString(10) // 2 BNB

    setAttemptingTxn(true)
    await estimate({ value })
      .then((estimatedGasLimit) =>
        method({
          gasLimit: calculateGasMargin(estimatedGasLimit),
          gasPrice,
          value,
        })
          .then((response) => {
            setAttemptingTxn(false)

            addTransaction(response, {
              summary: `Reserved`,
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

  const handleClaim = async () => {
    setClaiming(true)

    const balance = await nftDummyContract.balanceOf(account).then((r: any) => +r.toString())
    const dummy = balance / Math.pow(10, 18)

    setClaim({ ...claim, dummy })

    if (dummy < 1) {
      alert('Insufficient balance.')
      return setClaiming(false)
    }

    if (claim.logs.length >= dummy) {
      alert('You have already claimed.')
      return setClaiming(false)
    }

    const res = await fetch(`${API_BASE_URL}/handleRandom/api/random/get/random`, {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ address: account }),
    }).then((r) => r.json())

    if (res) await handleFetchClaim()

    setClaiming(false)
  }

  const handleFetchClaim = async () => {
    const res = await fetch(`${API_BASE_URL}/handleRandom/api/random/${account}`, {
      method: 'post',
      headers: { 'content-type': 'application/json' },
    }).then((res) => res.json())

    setClaim({ ...claim, logs: res.randoms })
  }

  const receiveMessage = () => {
    const dateNow = new Date()
    const hh = dateNow.getHours()
    if (hh >= 22 || hh <= 9) {
      return 'You will receive SNFT in your wallet within 12 hours.'
    } else {
      return 'You will receive SNFT in your wallet shortly.'
    }
  }

  const handleFetchUserBalance = useCallback(async () => {
    const balace = await library.getBalance(account)
    setBnbBalance(new BigNumber(balace.toString()).div(BIG_TEN.pow(18)))
  }, [account, setBnbBalance])

  // Reserve Confirm Modal
  const ReserveModalBottom = () => {
    return (
      <>
        <div className="my-1">
          <div className="flex items-center justify-between">
            <span>BNB Reserve</span>
            <div className="flex items-center">
              <img src={BNBImg} className="square-8 mr-1" />
              <span className="ml-2">2</span>
            </div>
          </div>
        </div>
        <div className="pt-5">
          <button className="button is-primary w-full text-xl py-3" onClick={handleReserve}>
            Confirm Reserve
          </button>
        </div>
      </>
    )
  }

  const pendingText = `Reserving`

  const handleDismissConfirmation = useCallback(() => {
    setTxHash('')
  }, [txHash])

  const [onPresentReserveModal] = useModal(
    <TransactionConfirmationModal
      title={'You will reserve'}
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={() => <ConfirmationModalContent topContent={() => null} bottomContent={() => <ReserveModalBottom />} />}
      pendingText={pendingText}
    />,
    true,
    'confirmReserveModal',
  )

  return (
    <div className="container">
      <div className="grid grid-cols-2 gap-12 py-12 lg:grid-cols-1">
        <div>
          <h1 className="text-2xl text-center">Poramesuan Garuda “Prosperity” Gold Model</h1>

          <div className="border border-black-100 p-6 mt-8 rounded-xl max-w-80 mx-auto">
            <div className="grid">
              <div className="flex flex-col items-center justify-center w-full">
                <span className="text-black-400 text-xl">Current price</span>
                <div className="flex items-center py-3">
                  <img src={BNBImg} className="square-14 mr-1" />
                  <span className="text-2xl font-semibold">{unitPrice} BNB</span>
                </div>
              </div>
              {/* <div>
                <span className="text-black-400 text-xl">Available</span>
                <div className="flex items-center py-3" style={{ height: 80 }}>
                  <span className="text-2xl font-semibold">298/300</span>
                </div>
              </div> */}
            </div>
            {account ? (
              // typeof wbnbCurrencyAmount === 'undefined' ? (
              //   <CircleLoader className="mx-auto text-primary-400" />
              // ) : wbnbCurrencyAmountBig.isZero() || wbnbCurrencyAmountBig.isNaN() ? (
              bnbBalance.isZero() || bnbBalance.isNaN() || bnbBalance.isLessThan(unitPrice) ? (
                <button
                  type="button"
                  className="button bg-black-50 border-none border-black-50 text-black-300 w-full text-sm py-3"
                  disabled>
                  Insufficient BNB balance
                </button>
              ) : (
                // ) : approval !== ApprovalState.APPROVED ? (
                //   <button
                //     className="button is-primary text-lg w-full min-h-12 uppercase mt-3"
                //     onClick={approveCallback}
                //     disabled={approval === ApprovalState.PENDING}>
                //     {approval === ApprovalState.PENDING ? (
                //       <span>Approving {wbnbCurrency?.symbol}...</span>
                //     ) : (
                //       <span>Approve {wbnbCurrency?.symbol}</span>
                //     )}
                //   </button>
                // approval === ApprovalState.APPROVED && (
                <button
                  className="button is-primary text-lg w-full min-h-12 uppercase mt-3"
                  onClick={onPresentReserveModal}>
                  Purchase
                </button>
                // )
              )
            ) : (
              <ConnectWalletButton className="w-full is-primary text-xl py-3" />
            )}
          </div>

          <h3 className="mt-8">Description</h3>
          <h4 className="font-normal text-lg mt-3">Fire Element | Part of the WWIN Element Collection</h4>
          <div className="text-sm text-black-400">
            <p className="text-sm">
              Blessed by Luang Por Wara Punyawaro, Head Monk of Wat Pho Thong Video Link of{' '}
              <a className="text-primary-500" href="https://youtu.be/z_rVlasNjTs" target="_blank">
                Blessing Ceremony Youtube
              </a>
            </p>
            <p className="text-sm mt-4">
              It’s said that the God Garuda is the bone of the Sun. Garuda got his power by fulfilling his destiny by
              bringing Amrit Water (Elixir of Life) to help his mother atone. After a long and tiresome battle, Vishnu
              was impressed with Garuda’s selfless act and that he did not drink Amrit water to become invincible.
              Vishnu blessed him with immortality and Garuda becomes undefeatable and invincible.
            </p>
            <p className="text-sm mt-4">Garuda represents the act of being respectful to parents.</p>
            <p className="text-sm ">Garuda’s Virtue of the Buddha includes</p>
            <ul className="list-disc pl-6">
              <li>Protection and Abundance</li>
              <li>Wealth</li>
              <li>Getting Promoted to higher rank</li>
              <li>Ward off Danger</li>
            </ul>

            <p className="text-sm mt-4">WWIN will use some of the proceeds from sales:</p>
            <ul className="list-disc pl-6">
              <li>Buying back and burning WWIN.</li>
              <li>
                Education scholarships for orphans and kids from low income families from the 12 charities and 17
                different ethnic groups under the care of Luang Por Wara of Wat Pho Thong temple.
              </li>
              <li>
                The purchase PPE and other equipment for medical workers, and food, medicine, ventilators, and other
                necessities for people with Covid-19.
              </li>
              <li>To renovate the Garuda Pavilion in Wat Pho Thong Temple.</li>
            </ul>
          </div>
          {account && (
            <div className="border border-black-100 p-6 mt-8 rounded-xl mx-auto">
              {claim.logs.length ? (
                <div className="mb-2">
                  <p>You will receive Poramesuan Garuda “Prosperity” Gold</p>
                  <p>
                    Serial No: <b>{claim.logs.map((r) => r.number).join(', ')}</b>
                  </p>
                  <p>{receiveMessage()}</p>
                </div>
              ) : null}

              <button className="button w-full is-primary text-xl py-3" disabled={claiming} onClick={handleClaim}>
                {claiming ? <CircleLoader className="mx-auto text-primary-400" /> : 'Claim'}
              </button>
            </div>
          )}
        </div>
        <div>
          <div className="pointer-events-none">
            <img src={NFTImg} className="rounded-xl object-cover pointer-events-none" />
          </div>
          <div className="mt-8">
            <h3>Properties</h3>
            <div className="flex flex-wrap gap-3 mt-3">
              <div className="border border-black-100 p-3 text-primary-500 text-sm text-center rounded-lg">
                <h4>Gold</h4>
                <p>30% has this trait</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reserve
