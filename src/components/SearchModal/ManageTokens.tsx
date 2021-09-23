import { useRef, RefObject, useCallback, useState, useMemo } from 'react'
import { Token } from '@pancakeswap/sdk'
import { useToken } from 'hooks/Tokens'
import { useRemoveUserAddedToken } from 'state/user/hooks'
import useUserAddedTokens from 'state/user/hooks/useUserAddedTokens'
import { CurrencyLogo } from 'components/Logo'
import { getBscScanLink, isAddress } from 'utils'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ImportRow from './ImportRow'
import { CurrencyModalView } from './types'
import { IoCloseSharp, IoArrowRedoCircleOutline } from 'react-icons/io5'

export default function ManageTokens({
  setModalView,
  setImportToken,
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
}) {
  const { chainId } = useActiveWeb3React()

  const [searchQuery, setSearchQuery] = useState<string>('')

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
  }, [])

  // if they input an address, use it
  const searchToken = useToken(searchQuery)

  // all tokens for local list
  const userAddedTokens: Token[] = useUserAddedTokens()
  const removeToken = useRemoveUserAddedToken()

  const handleRemoveAll = useCallback(() => {
    if (chainId && userAddedTokens) {
      userAddedTokens.map((token) => {
        return removeToken(chainId, token.address)
      })
    }
  }, [removeToken, userAddedTokens, chainId])

  const tokenList = useMemo(() => {
    return (
      chainId &&
      userAddedTokens.map((token) => (
        <div className="flex px-4 py-2" key={token.address}>
          <div className="flex items-center">
            <CurrencyLogo currency={token} size="20px" />
            <a href={getBscScanLink(token.address, 'address', chainId)} target="_blank" className="ml-1">
              {token.symbol}
            </a>
          </div>
          <div className="ml-auto flex items-center">
            <IoCloseSharp
              className="text-2xl text-error-500 cursor-pointer mr-2"
              onClick={() => removeToken(chainId, token.address)}
            />
            <a href={getBscScanLink(token.address, 'address', chainId)} target="_blank" className="inline-flex">
              <IoArrowRedoCircleOutline className="text-2xl text-blue-500" />
            </a>
          </div>
        </div>
      ))
    )
  }, [userAddedTokens, chainId, removeToken])

  const isAddressValid = searchQuery === '' || isAddress(searchQuery)

  return (
    <div>
      <div style={{ width: '100%', flex: '1 1' }}>
        <div className="pb-2">
          <div className="px-4">
            <div>
              <input
                placeholder="0x0000"
                value={searchQuery}
                autoComplete="off"
                ref={inputRef as RefObject<HTMLInputElement>}
                onChange={handleInput}
                className="form-control"
              />
            </div>
            {!isAddressValid && <div className="text-error-500 mt-1 text-sm">Enter valid token address</div>}
          </div>
          {searchToken && (
            <ImportRow
              token={searchToken}
              showImportView={() => setModalView(CurrencyModalView.importToken)}
              setImportToken={setImportToken}
              style={{ height: 'fit-content' }}
            />
          )}
        </div>
        {tokenList}
        <div className="mt-4 px-4 flex items-center justify-between">
          <span className="text-primary-400 font-bold">
            {userAddedTokens?.length} {userAddedTokens.length === 1 ? 'Custom Token' : 'Custom Tokens'}
          </span>
          {userAddedTokens.length > 0 && (
            <button className="button border-none font-bold text-warning-500 bg-warning-100" onClick={handleRemoveAll}>
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
