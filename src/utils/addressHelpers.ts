import { ChainId } from '@pancakeswap/sdk'
import addresses from 'configs/constants/contracts'
import tokens from 'configs/constants/tokens'
import { Address } from 'configs/constants/types'

export const getAddress = (address: Address): string => {
  const chainId = process.env.REACT_APP_CHAIN_ID
  return address[chainId] ? address[chainId] : address[ChainId.MAINNET]
}

export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
}

// Token Address
export const getBusdAddress = () => {
  return getAddress(tokens.busd.address)
}
export const getBathAddress = () => {
  return getAddress(tokens.bath.address)
}
export const getWWinAddress = () => {
  return getAddress(tokens.wwin.address)
}
export const getwBNBAddress = () => {
  return getAddress(tokens.wbnb.address)
}
