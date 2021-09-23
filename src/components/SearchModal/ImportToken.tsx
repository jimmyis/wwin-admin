import { useState } from 'react'
import { Token, Currency } from '@pancakeswap/sdk'
import { useAddUserToken } from 'state/user/hooks'
import { getBscScanLink } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedInactiveList } from 'state/lists/hooks'
import { ListLogo } from 'components/Logo'
import { IoWarning, IoAlertCircleOutline } from 'react-icons/io5'

interface ImportProps {
  tokens: Token[]
  handleCurrencySelect?: (currency: Currency) => void
}

function ImportToken({ tokens, handleCurrencySelect }: ImportProps) {
  const { chainId } = useActiveWeb3React()

  const [confirmed, setConfirmed] = useState(false)

  const addToken = useAddUserToken()

  // use for showing import source on inactive tokens
  const inactiveTokenList = useCombinedInactiveList()

  return (
    <div className="px-5 py-2">
      <div className="bg-warning-100 p-3 rounded-md border border-warning-400 flex">
        <IoWarning className="text-warning-500 text-2xl mr-2" />
        <div className="flex-1">
          Anyone can create a BEP20 token on BSC with any name, including creating fake versions of existing tokens and
          tokens that claim to represent projects that do not have a token.
          <br />
          <br />
          If you purchase an arbitrary token, you may be unable to sell it back.
        </div>
      </div>

      {tokens.map((token) => {
        const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list
        const address = token.address
          ? `${token.address.substring(0, 6)}...${token.address.substring(token.address.length - 4)}`
          : null
        return (
          <div className="mt-4" key={token.address}>
            {list !== undefined ? (
              <div className="flex items-center border-2 border-green-500 rounded-full px-1">
                {list.logoURI && (
                  <div className="mr-1">
                    <ListLogo logoURI={list.logoURI} size={'14px'} />
                  </div>
                )}
                <span className="text-xs text-green-500">via {list.name}</span>
              </div>
            ) : (
              <div className="border-2 border-error-500 rounded-full p-1 text-error-500 flex items-center">
                <IoAlertCircleOutline className="mr-1" />
                <span className="text-xs">Unknown Source</span>
              </div>
            )}
            <div className="mt-2">
              <span className="mr-1">{token.name}</span>
              <span>({token.symbol})</span>
            </div>
            {chainId && (
              <div className="flex items-center justify-between">
                <div>{address}</div>
                <a href={getBscScanLink(token.address, 'address', chainId)} className="link font-bold" target="_blank">
                  ({'View on BscScan'})
                </a>
              </div>
            )}
          </div>
        )
      })}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center" onClick={() => setConfirmed(!confirmed)}>
          <input type="checkbox" checked={confirmed} onChange={() => setConfirmed(!confirmed)} />
          <div style={{ userSelect: 'none' }} className="ml-2">
            I understand
          </div>
        </div>
        <button
          disabled={!confirmed}
          onClick={() => {
            tokens.map((token) => addToken(token))
            if (handleCurrencySelect) {
              handleCurrencySelect(tokens[0])
            }
          }}
          className="button is-primary font-bold text-lg py-2">
          Import
        </button>
      </div>
    </div>
  )
}

export default ImportToken
