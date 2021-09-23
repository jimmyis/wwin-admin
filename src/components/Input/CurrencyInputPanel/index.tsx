import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import NumberFormat from 'react-number-format'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { CurrencyInputPanelProps } from './types'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
import { CurrencyLogo } from 'components/Logo'
import classNames from 'classnames'
import { useModal } from 'components/Base/Modal'
import { IoChevronDownOutline } from 'react-icons/io5'

const CurrencyInputPanel: React.FC<CurrencyInputPanelProps> = ({
  label = 'Label',
  value,
  onValueChange,
  placeholder,
  id,
  currency,
  disableCurrencySelect,
  showMaxButton,
  onMax,
  onCurrencySelect,
  otherCurrency,
  showCommonBases,
  readonly,
  thousandSeparator = true,
  maxLength = 10,
}) => {
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  const handleInputMax = () => {
    if (!readonly) {
      onValueChange(new BigNumber(selectedCurrencyBalance?.toSignificant(6)))
    }
  }

  // ClassNames
  const currencySelectButtonClass = classNames('open-currency-select-button', {
    disabled: disableCurrencySelect,
  })

  // Modal
  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
    />,
  )

  return (
    <div id={id} className="currency-input-panel">
      <div className="currency-input-panel-label">
        <label>{label}</label>
        {account && (
          <span onClick={handleInputMax} className={readonly ? '' : 'cursor-pointer'}>
            Balance: {selectedCurrencyBalance?.toSignificant(6) || '0'}
          </span>
        )}
      </div>
      <div className="flex mt-2">
        {readonly ? (
          <NumberFormat
            autoFocus
            value={value.isZero() ? '' : value.toString(10)}
            thousandSeparator={thousandSeparator}
            allowNegative={false}
            placeholder={placeholder || '0.0'}
            readOnly
          />
        ) : (
          <NumberFormat
            autoFocus
            value={value.isZero() ? '' : value.toString(10)}
            onValueChange={({ value }) => onValueChange(new BigNumber(value || 0))}
            thousandSeparator={thousandSeparator}
            allowNegative={false}
            placeholder={placeholder || '0.0'}
            maxLength={maxLength}
          />
        )}

        {account && currency && showMaxButton && !readonly && (
          <button className="currency-max-button" onClick={handleInputMax}>
            MAX
          </button>
        )}

        <button
          className={currencySelectButtonClass}
          onClick={() => {
            if (!disableCurrencySelect) {
              onPresentCurrencyModal()
            }
          }}>
          {currency ? <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} /> : null}
          <div>
            {(currency && currency.symbol && currency.symbol.length > 20
              ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                  currency.symbol.length - 5,
                  currency.symbol.length,
                )}`
              : currency?.symbol) || 'Select a currency'}
          </div>
          {!disableCurrencySelect && <IoChevronDownOutline />}
        </button>
      </div>
    </div>
  )
}

export default CurrencyInputPanel
