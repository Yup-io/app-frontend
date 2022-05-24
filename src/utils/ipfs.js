import isIpfs from 'is-ipfs'
import { ipfsGatewayUrl } from '../config'

export function hashToUrl (fileHash) {
  return `${ipfsGatewayUrl}/${fileHash}`
}

export function urlToHash (url) {
  // Gets the ipfs hash from urls of the format https://ipfs.yup.io/QmStMEDbaAjmgdfHL9roJR7wLGRmvqN9PAbZPwYkpXy5JT
  const fmtUrl = new URL(url)
  const basename = fmtUrl.pathname.split('/').pop()

  if (isIpfs.multihash(basename)) {
    return basename
  }
  return null
}

export function parseIpfsRef (str) {
  if (!str) { return }
  if (str.includes('ipfs2')) { return str }
  if (isIpfs.url(str)) {
    // Use default api gateway instead of one referenced in url
    const hash = urlToHash(str)
    return hashToUrl(hash)
  } else if (isIpfs.multihash(str)) {
    return hashToUrl(str)
  }
  return str
}
