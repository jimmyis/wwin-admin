import {
  MetamaskIcon,
  WalletConnectIcon,
  TrustWalletIcon,
  MathWalletIcon,
  TokenPocketIcon,
  BinanceChainIcon,
  SafePalIcon,
  Coin98Icon,
} from 'components/Svg'

import { Config, ConnectorNames } from './types'

const connectors: Config[] = [
  {
    title: 'Metamask',
    icon: MetamaskIcon,
    connectorId: ConnectorNames.Injected,
    priority: 1,
  },
  {
    title: 'WalletConnect',
    icon: WalletConnectIcon,
    connectorId: ConnectorNames.WalletConnect,
    priority: 2,
  },
  {
    title: 'Trust Wallet',
    icon: TrustWalletIcon,
    connectorId: ConnectorNames.Injected,
    priority: 3,
  },
  {
    title: 'MathWallet',
    icon: MathWalletIcon,
    connectorId: ConnectorNames.Injected,
    priority: 999,
  },
  {
    title: 'TokenPocket',
    icon: TokenPocketIcon,
    connectorId: ConnectorNames.Injected,
    priority: 999,
  },

  {
    title: 'Binance Chain',
    icon: BinanceChainIcon,
    connectorId: ConnectorNames.BSC,
    priority: 999,
  },
  {
    title: 'SafePal',
    icon: SafePalIcon,
    connectorId: ConnectorNames.Injected,
    priority: 999,
  },
  {
    title: 'Coin98',
    icon: Coin98Icon,
    connectorId: ConnectorNames.Injected,
    priority: 999,
  },
]

export default connectors
export const connectorLocalStorageKey = 'connectorIdv2'
export const walletLocalStorageKey = 'wallet'
