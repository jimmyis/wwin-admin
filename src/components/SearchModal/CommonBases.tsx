import { ChainId, Currency, currencyEquals, ETHER, Token } from '@pancakeswap/sdk'

import { SUGGESTED_BASES } from '../../configs/constants'
import QuestionHelper from '../QuestionHelper'
import { CurrencyLogo } from '../Logo'

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId?: ChainId
  selectedCurrency?: Currency | null
  onSelect: (currency: Currency) => void
}) {
  return (
    <div className="currency-common-base">
      <div className="flex items-center">
        <div className="mr-1">Common bases</div>
        <QuestionHelper text={'These tokens are commonly paired with other tokens.'} />
      </div>
      <div className="flex flex-wrap -mx-1">
        <button
          className="button m-1"
          onClick={() => {
            if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
              onSelect(ETHER)
            }
          }}
          disabled={selectedCurrency === ETHER}>
          <CurrencyLogo currency={ETHER} style={{ marginRight: 8 }} />
          <span>BNB</span>
        </button>

        {(chainId ? SUGGESTED_BASES[chainId] : []).map((token: Token) => {
          const selected = selectedCurrency instanceof Token && selectedCurrency.address === token.address
          return (
            <button
              className="button m-1"
              onClick={() => !selected && onSelect(token)}
              disabled={selected}
              key={token.address}>
              <CurrencyLogo currency={token} style={{ marginRight: 8 }} />
              <span>{token.symbol}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
