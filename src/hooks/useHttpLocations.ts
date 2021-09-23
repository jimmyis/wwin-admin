import { useMemo } from 'react'
import contenthashToUri from 'utils/contenthashToUri'
import { parseENSAddress } from 'utils/ENS/parseENSAddress'
import uriToHttp from 'utils/uriToHttp'
import useENSContentHash from './ENS/useENSContentHash'

export default function useHttpLocations(uri: string | undefined): string[] {
  const isPublicURL = uri.includes('%PUBLIC_URL%')
  const ens = useMemo(() => (uri ? parseENSAddress(uri) : undefined), [uri])
  const resolvedContentHash = useENSContentHash(ens?.ensName)

  return useMemo(() => {
    if (ens) {
      return resolvedContentHash.contenthash ? uriToHttp(contenthashToUri(resolvedContentHash.contenthash)) : []
    }

    if (isPublicURL) {
      return [uri.replace('%PUBLIC_URL%', window.location.origin)]
    }

    return uri ? uriToHttp(uri) : []
  }, [ens, resolvedContentHash.contenthash, uri])
}
