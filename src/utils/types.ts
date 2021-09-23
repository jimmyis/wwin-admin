export enum ConnectorNames {
  Injected = 'injected',
  WalletConnect = 'walletconnect',
  BSC = 'bsc',
}

export interface ConnectorName {
  [ConnectorNames.Injected]: any
  [ConnectorNames.WalletConnect]: any
  [ConnectorNames.BSC]: any
}

export const connectorLocalStorageKey = 'connectorIdv2'
