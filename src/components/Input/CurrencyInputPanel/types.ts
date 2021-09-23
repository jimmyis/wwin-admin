import BigNumber from 'bignumber.js'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'

export interface CurrencyInputPanelProps {
  value: BigNumber
  label?: string
  onValueChange?: (value: BigNumber) => void
  placeholder?: string
  currency?: Currency | null
  disableCurrencySelect?: boolean
  id: string
  onMax?: () => void
  showMaxButton?: boolean
  onCurrencySelect?: (currency: Currency) => void
  otherCurrency?: Currency | null
  showCommonBases?: boolean
  readonly?: boolean
  thousandSeparator?: boolean
  maxLength?: number
}
