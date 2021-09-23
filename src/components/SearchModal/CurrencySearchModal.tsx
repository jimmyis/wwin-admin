import { useCallback, useState } from 'react'
import { Currency, Token } from '@pancakeswap/sdk'
import usePrevious from 'hooks/usePreviousValue'
import { TokenList } from '@uniswap/token-lists'
import CurrencySearch from './CurrencySearch'
import ImportToken from './ImportToken'
import Manage from './Manage'
import ImportList from './ImportList'
import { CurrencyModalView } from './types'
import { Modal } from 'components/Base/Modal'
import { InjectedModalProps } from 'components/Base/Modal/types'
import { IoArrowBackOutline } from 'react-icons/io5'

interface CurrencySearchModalProps extends InjectedModalProps {
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
}

export default function CurrencySearchModal({
  onDismiss = () => null,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases = false,
}: CurrencySearchModalProps) {
  const [modalView, setModalView] = useState<CurrencyModalView>(CurrencyModalView.search)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (onCurrencySelect) {
        onDismiss()
        onCurrencySelect(currency)
      }
    },
    [onDismiss, onCurrencySelect],
  )

  // for token import view
  const prevView = usePrevious(modalView)

  // used for import token flow
  const [importToken, setImportToken] = useState<Token | undefined>()

  // used for import list
  const [importList, setImportList] = useState<TokenList | undefined>()
  const [listURL, setListUrl] = useState<string | undefined>()

  const config = {
    [CurrencyModalView.search]: { title: 'Select a Token', onBack: undefined },
    [CurrencyModalView.manage]: { title: 'Manage', onBack: () => setModalView(CurrencyModalView.search) },
    [CurrencyModalView.importToken]: {
      title: 'Import Tokens',
      onBack: () =>
        setModalView(prevView && prevView !== CurrencyModalView.importToken ? prevView : CurrencyModalView.search),
    },
    [CurrencyModalView.importList]: { title: 'Import List', onBack: () => setModalView(CurrencyModalView.search) },
  }

  return (
    <Modal
      onDismiss={onDismiss}
      header={
        <div className="flex items-center">
          {config[modalView].onBack && (
            <IoArrowBackOutline className="mr-2 cursor-pointer" onClick={config[modalView].onBack} />
          )}
          <div>{config[modalView].title}</div>
        </div>
      }>
      <div className="currecy-search-modal -mx-4">
        {modalView === CurrencyModalView.search ? (
          <CurrencySearch
            onCurrencySelect={handleCurrencySelect}
            selectedCurrency={selectedCurrency}
            otherSelectedCurrency={otherSelectedCurrency}
            showCommonBases={showCommonBases}
            showImportView={() => setModalView(CurrencyModalView.importToken)}
            setImportToken={setImportToken}
          />
        ) : modalView === CurrencyModalView.importToken && importToken ? (
          <ImportToken tokens={[importToken]} handleCurrencySelect={handleCurrencySelect} />
        ) : modalView === CurrencyModalView.importList && importList && listURL ? (
          <ImportList list={importList} listURL={listURL} onImport={() => setModalView(CurrencyModalView.manage)} />
        ) : modalView === CurrencyModalView.manage ? (
          <Manage
            setModalView={setModalView}
            setImportToken={setImportToken}
            setImportList={setImportList}
            setListUrl={setListUrl}
          />
        ) : (
          ''
        )}
        {modalView === CurrencyModalView.search && (
          <button
            onClick={() => setModalView(CurrencyModalView.manage)}
            className="button border-none bg-transparent font-bold text-primary-500">
            Manage Tokens
          </button>
        )}
      </div>
    </Modal>
  )
}
