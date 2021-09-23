import React, { useState, useCallback } from 'react'
import { ListLogo } from 'components/Logo'
import { TokenList } from '@uniswap/token-lists'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import useFetchListCallback from 'hooks/useFetchListCallback'
import { removeList, enableList } from 'state/lists/actions'
import { useAllLists } from 'state/lists/hooks'

interface ImportProps {
  listURL: string
  list: TokenList
  onImport: () => void
}

function ImportList({ listURL, list, onImport }: ImportProps) {
  const dispatch = useDispatch<AppDispatch>()

  // user must accept
  const [confirmed, setConfirmed] = useState(false)

  const lists = useAllLists()
  const fetchList = useFetchListCallback()

  // monitor is list is loading
  const adding = Boolean(lists[listURL]?.loadingRequestId)
  const [addError, setAddError] = useState<string | null>(null)

  const handleAddList = useCallback(() => {
    if (adding) return
    setAddError(null)
    fetchList(listURL)
      .then(() => {
        dispatch(enableList(listURL))
        onImport()
      })
      .catch((error) => {
        setAddError(error.message)
        dispatch(removeList(listURL))
      })
  }, [adding, dispatch, fetchList, listURL, onImport])

  return (
    <div>
      <div>
        <div>
          <div>
            <div>
              <div>
                {list.logoURI && <ListLogo logoURI={list.logoURI} size="40px" />}
                <div style={{ marginLeft: '20px' }}>
                  <div>
                    <div>{list.name}</div>
                    {/* <TextDot /> */}
                    <div>{list.tokens.length} tokens</div>
                  </div>
                  {/* <Link
                    small
                    external
                    ellipsis
                    maxWidth="90%"
                    href={`https://tokenlists.org/token-list?url=${listURL}`}>
                    {listURL}
                  </Link> */}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div>
              <div>{'Import at your own risk'}</div>
              <div>
                {
                  'By adding this list you are implicitly trusting that the data is correct. Anyone can create a list, including creating fake versions of existing lists and lists that claim to represent projects that do not have one.'
                }
              </div>
              <div>{typeof 'If you purchase a token from this list, you may not be able to sell it back.'}</div>
              <div>
                {/* <Checkbox
                  name="confirmed"
                  type="checkbox"
                  checked={confirmed}
                  onChange={() => setConfirmed(!confirmed)}
                  scale="sm"
                /> */}
                <div style={{ userSelect: 'none' }}>{'I understand'}</div>
              </div>
            </div>
          </div>

          <button disabled={!confirmed} onClick={handleAddList}>
            {'Import'}
          </button>
          {addError ? <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{addError}</div> : null}
        </div>
      </div>
    </div>
  )
}

export default ImportList
