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
