import callYupApi from './base_api'

export const apiGetAccount = async (accountName) =>
  callYupApi({
    url: `/accounts/${accountName}`
  })

export const apiSetETHAddress = async (ethData) =>
  callYupApi({
    url: '/accounts/linked/eth',
    method: 'POST',
    data: ethData
  })

export const apiGetAccountByEthAddress = async (address) =>
  callYupApi({
    url: `/accounts/eth`,
    params: { address }
  })

export const apiRequestWhitelist = async (address, signature, email) =>
  callYupApi({
    url: '/accounts/application/eth',
    method: 'POST',
    data: { address, signature, email }
  })

export const apiValidateUsername = async (username) =>
  callYupApi({
    url: `/accounts/validate/${username}`,
    method: 'POST'
  })

export const apiMirrorAccount = async (address, signature, username) =>
  callYupApi({
    url: '/accounts/eth/mirror',
    method: 'POST',
    data: { address, signature, username }
  })

export const apiUploadProfileImage = async (imageData) =>
  callYupApi({
    url: '/accounts/account/profileImage',
    method: 'POST',
    data: imageData
  })
