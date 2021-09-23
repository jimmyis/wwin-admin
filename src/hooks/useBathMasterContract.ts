import BigNumber from 'bignumber.js'
import { useSingleCallResult } from 'state/multicall/hooks'
import { useBathMasterContract, useTokenContract } from './useContract'

export function useRedeemFee(): number | undefined {
  const masterContract = useBathMasterContract()
  const treasuryPermille: BigNumber = useSingleCallResult(masterContract, 'redeemFee')?.result?.[0]

  if (!treasuryPermille) return undefined

  return treasuryPermille.toNumber() / 1000
}

export function useMintFee(): number | undefined {
  const masterContract = useBathMasterContract()
  const wwinPermille: BigNumber = useSingleCallResult(masterContract, 'mintFee')?.result?.[0]

  if (!wwinPermille) return undefined

  return wwinPermille.toNumber() / 1000
}

export function useBathPerUsd(): number | undefined {
  const masterContract = useBathMasterContract()
  const bathPerUsd: BigNumber = useSingleCallResult(masterContract, 'feeDenominator')?.result?.[0]

  if (!bathPerUsd) return undefined

  return bathPerUsd.toNumber()
}
