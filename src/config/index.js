
export const polygonConfig = {
  rpcUrl: process.env.NEXT_PUBLIC_POLY_RPC_URL,
  chainId: Number(process.env.NEXT_PUBLIC_POLY_CHAIN_ID),
  backupRpcUrls: process.env.NEXT_PUBLIC_POLY_BACKUP_RPC_URL.split(',')
}

export const ethereumConfig = {
  chainId: Number(process.env.NEXT_PUBLIC_ETH_CHAIN_ID)
}

export const alchemyApiKeys = {
  [polygonConfig.chainId]: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_POLYGON,
  [ethereumConfig.chainId]: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_ETHEREUM
}

export const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API
export const webAppUrl = process.env.NEXT_PUBLIC_WEB_APP_URL
export const landingPageUrl = process.env.NEXT_PUBLIC_YUP_LANDING

export const runtimeEnv = process.env.NODE_ENV
export const isDevEnv = runtimeEnv === 'development'
export const isProdEnv = runtimeEnv === 'production'

export const rollbarConfig = {
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_ACCESS_KEY
}

export const reactionIcons = process.env.NEXT_PUBLIC_ICONS.split(',')
export const voteCategories = process.env.NEXT_PUBLIC_VOTE_CATEGORIES.split(',')
export const professorCategories = process.env.NEXT_PUBLIC_PROF_CATEGORIES.split(',')
export const mapsCategories = process.env.NEXT_PUBLIC_MAPS_CATEGORIES.split(',')
export const courseCategories = process.env.NEXT_PUBLIC_COURSE_CATEGORIES.split(',')
export const electionCategories = process.env.NEXT_PUBLIC_ELECTION_CATEGORIES.split(',')
export const nftArtCategories = process.env.NEXT_PUBLIC_NFT_ART_CATEGORIES.split(',')
export const nftMusicCategories = process.env.NEXT_PUBLIC_NFT_MUSIC_CATEGORIES.split(',')

export const eosConfig = {
  apiUrl: process.env.NEXT_PUBLIC_EOS_API,
  chainId: process.env.NEXT_PUBLIC_EOS_CHAINID
}

export const yupXTokenAccount = process.env.NEXT_PUBLIC_YUPX_TOKEN_ACCOUNT
export const yupContractAccount = process.env.NEXT_PUBLIC_YUP_CONTRACT_ACCOUNT
export const yupAccountManager = process.env.NEXT_PUBLIC_YUP_ACCOUNT_MANAGER
export const yupCreator = process.env.NEXT_PUBLIC_YUP_CREATOR
export const vergilSearchUrl = process.env.NEXT_PUBLIC_VERGIL_SEARCH
export const defaultPostImageUrl = process.env.NEXT_PUBLIC_DEFAULT_POST_IMAGE
export const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME
export const audisEmbedUrl = process.env.NEXT_PUBLIC_AUDIUS_EMBED
export const yupDocsUrl = process.env.NEXT_PUBLIC_YUP_DOCS_URL
export const yupBuyLink = process.env.NEXT_PUBLIC_YUP_BUY_LINK
export const rewardsManagerApi = process.env.NEXT_PUBLIC_REWARDS_MANAGER_API
export const subgraphApiPolygonUrl = process.env.NEXT_PUBLIC_SUBGRAPH_API_POLY
export const subgraphApiEthUrl = process.env.NEXT_PUBLIC_SUBGRAPH_API_ETH
