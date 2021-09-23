import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getMulticallAddress } from 'utils/addressHelpers'

// Imports below migrated from Exchange useContract.ts
import { ChainId, WETH } from '@pancakeswap/sdk'
import { Contract } from '@ethersproject/contracts'
import multiCallAbi from 'configs/abi/Multicall.json'
import { getContract } from 'utils'

import ENS_PUBLIC_RESOLVER_ABI from 'configs/abi/ens-public-resolver.json'
import ENS_ABI from 'configs/abi/ens-registrar.json'
import ERC20_ABI from 'configs/abi/erc20.json'
import BATH_MASTER from 'configs/abi/bath-master.json'
import PRESALE_MASTER from 'configs/abi/presale-master.json'
import PANCAKE_ROUTER from 'configs/abi/pancake-router.json'
import SNFTD_DUMMY from 'configs/abi/snftd-token-dummy.json'
import { ERC20_BYTES32_ABI } from 'configs/abi/erc20'
import { ROUTER_ADDRESS, BATH_MASTER_ADDRESS, PRESALE_MASTER_ADDRESS, SNFTD_DUMMY_ADDRESS } from 'configs/constants'
import { getBep20Contract } from 'utils/contractHelpers'

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export const useERC20 = (address: string) => {
  const { library } = useActiveWeb3React()
  return useMemo(() => getBep20Contract(address, library.getSigner()), [address, library])
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    // eslint-disable-next-line default-case
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.TESTNET:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
        break
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  return useContract(getMulticallAddress(), multiCallAbi, false)
}

export function useBathMasterContract(): Contract | null {
  return useContract(BATH_MASTER_ADDRESS, BATH_MASTER)
}

export function usePresaleMasterContract(): Contract | null {
  return useContract(PRESALE_MASTER_ADDRESS, PRESALE_MASTER, true)
}

export function useSnftDummyContract(): Contract | null {
  return useContract(SNFTD_DUMMY_ADDRESS, SNFTD_DUMMY)
}

export function usePancakeRouterContract(): Contract | null {
  return useContract(ROUTER_ADDRESS, PANCAKE_ROUTER)
}
