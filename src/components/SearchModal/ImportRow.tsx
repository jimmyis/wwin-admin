import { CSSProperties } from 'react'
import { Token } from '@pancakeswap/sdk'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { ListLogo } from 'components/Logo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedInactiveList } from 'state/lists/hooks'
import { useIsUserAddedToken, useIsTokenActive } from 'hooks/Tokens'
import { IoCheckmarkCircleSharp } from 'react-icons/io5'

export default function ImportRow({
  token,
  style,
  dim,
  showImportView,
  setImportToken,
}: {
  token: Token
  style?: CSSProperties
  dim?: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
}) {
  // globals
  const { chainId } = useActiveWeb3React()

  // check if token comes from list
  const inactiveTokenList = useCombinedInactiveList()
  const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list

  // check if already active on list or local storage tokens
  const isAdded = useIsUserAddedToken(token)
  const isActive = useIsTokenActive(token)

  return (
    <div style={style} className="currency-row">
      <CurrencyLogo currency={token} size="24px" style={{ opacity: dim ? '0.6' : '1' }} />
      <div style={{ opacity: dim ? '0.6' : '1' }}>
        <div className="flex flex-col">
          <span className="font-bold">{token.symbol}</span>
          <span className="text-sm text-black-500 -mt-1">{token.name}</span>
        </div>
        {list && list.logoURI && (
          <div className="flex items-center">
            <div className="mr-1 text-xs text-black-300">via {list.name}</div>
            <ListLogo logoURI={list.logoURI} size="12px" />
          </div>
        )}
      </div>
      {!isActive && !isAdded ? (
        <button
          className="button is-primary"
          onClick={() => {
            if (setImportToken) {
              setImportToken(token)
            }
            showImportView()
          }}>
          Import
        </button>
      ) : (
        <div className="text-green-600 flex items-center justify-end" style={{ minWidth: 'fit-content' }}>
          <IoCheckmarkCircleSharp className="text-lg mr-1" />
          <div>Active</div>
        </div>
      )}
    </div>
  )
}
