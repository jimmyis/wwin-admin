import { Token } from '@pancakeswap/sdk'
import { TokenList } from '@uniswap/token-lists'
import ManageTokens from './ManageTokens'
import { CurrencyModalView } from './types'

export default function Manage({
  setModalView,
  setImportList,
  setImportToken,
  setListUrl,
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
}) {
  return (
    <div>
      <ManageTokens setModalView={setModalView} setImportToken={setImportToken} />
    </div>
  )
}
