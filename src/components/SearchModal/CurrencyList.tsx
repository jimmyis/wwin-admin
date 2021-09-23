import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { Currency, CurrencyAmount, currencyEquals, ETHER, Token } from '@pancakeswap/sdk'
import { FixedSizeList } from 'react-window'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import QuestionHelper from 'components/QuestionHelper'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedActiveList } from '../../state/lists/hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useIsUserAddedToken, useAllInactiveTokens } from '../../hooks/Tokens'
import { CurrencyLogo } from '../Logo'
import CircleLoader from '../Loader/CircleLoader'
import { isTokenOnList } from '../../utils'
import ImportRow from './ImportRow'
import classNames from 'classnames'

function currencyKey(currency: Currency): string {
  return currency instanceof Token ? currency.address : currency === ETHER ? 'ETHER' : ''
}

function Balance({ balance }: { balance: CurrencyAmount }) {
  return <span title={balance.toExact()}>{balance.toSignificant(4)}</span>
}

interface CurrencyRowProps {
  currency: Currency
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
}

const CurrencyRow: React.FC<CurrencyRowProps> = ({ currency, onSelect, isSelected, otherSelected, style }) => {
  const { account } = useActiveWeb3React()
  const key = currencyKey(currency)
  const selectedTokenList = useCombinedActiveList()
  const isOnSelectedList = isTokenOnList(selectedTokenList, currency)
  const customAdded = useIsUserAddedToken(currency)
  const balance = useCurrencyBalance(account ?? undefined, currency)

  const tokenItemClass = classNames(`token-item-${key}`, 'currency-row', {
    disabled: isSelected,
    selected: otherSelected,
  })

  // only show add or remove buttons if not on selected list
  return (
    <div style={style} className={tokenItemClass} onClick={() => (isSelected ? null : onSelect())}>
      <CurrencyLogo currency={currency} size="24px" />
      <div className="flex flex-col">
        <span className="font-bold">{currency.symbol}</span>
        <div className="-mt-1">
          {!isOnSelectedList && customAdded && (
            <>
              <span className="text-sm text-green-600">Added by user</span>
              <span className="text-sm text-black-500 mx-1">•</span>
            </>
          )}
          <span className="text-sm text-black-500">{currency.name}</span>
        </div>
      </div>
      <div style={{ justifySelf: 'flex-end' }}>
        {balance ? <Balance balance={balance} /> : account ? <CircleLoader className="text-primary-300" /> : null}
      </div>
    </div>
  )
}

export default function CurrencyList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH,
  showImportView,
  setImportToken,
  breakIndex,
}: {
  height: number
  currencies: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH: boolean
  showImportView: () => void
  setImportToken: (token: Token) => void
  breakIndex: number | undefined
}) {
  const itemData: (Currency | undefined)[] = useMemo(() => {
    let formatted: (Currency | undefined)[] = showETH ? [Currency.ETHER, ...currencies] : currencies
    if (breakIndex !== undefined) {
      formatted = [...formatted.slice(0, breakIndex), undefined, ...formatted.slice(breakIndex, formatted.length)]
    }
    return formatted
  }, [breakIndex, currencies, showETH])

  const { chainId } = useActiveWeb3React()

  const inactiveTokens: {
    [address: string]: Token
  } = useAllInactiveTokens()

  const Row = useCallback(
    ({ data, index, style }) => {
      const currency: Currency = data[index]
      const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
      const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
      const handleSelect = () => onCurrencySelect(currency)

      const token = wrappedCurrency(currency, chainId)

      const showImport = inactiveTokens && token && Object.keys(inactiveTokens).includes(token.address)

      if (index === breakIndex || !data) {
        return (
          <div className="px-4 flex items-center justify-center w-full" style={style}>
            <div className="p-3 border border-black-50 w-full text-center rounded-md bg-backdrop flex items-center justify-center">
              <span className="mr-1 text-sm text-black-400">{'Expanded results from inactive Token Lists'}</span>
              <QuestionHelper
                text={
                  "Tokens from inactive lists. Import specific tokens below or click 'Manage' to activate more lists."
                }
              />
            </div>
          </div>
        )
      }

      if (showImport && token) {
        return (
          <ImportRow style={style} token={token} showImportView={showImportView} setImportToken={setImportToken} dim />
        )
      }
      return (
        <CurrencyRow
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
        />
      )
    },
    [
      chainId,
      inactiveTokens,
      onCurrencySelect,
      otherCurrency,
      selectedCurrency,
      setImportToken,
      showImportView,
      breakIndex,
    ],
  )

  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), [])

  return (
    <FixedSizeList
      className="currency-list-wrapper"
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={itemData}
      itemCount={itemData.length}
      itemSize={56}
      itemKey={itemKey}>
      {Row}
    </FixedSizeList>
  )
}
