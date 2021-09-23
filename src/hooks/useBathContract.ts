import BigNumber from 'bignumber.js'
import { useSingleCallResult } from 'state/multicall/hooks'
import { getBathAddress } from 'utils/addressHelpers'
import { useTokenContract } from './useContract'

export function useBathTotalSupply(): string | undefined {
  const bathAddress = getBathAddress()
  const bathContract = useTokenContract(bathAddress)
  const totalSupply: BigNumber = useSingleCallResult(bathContract, 'totalSupply')?.result?.[0]

  if (!totalSupply) return undefined

  return totalSupply.toString()
}
