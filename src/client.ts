import axios from 'axios'
import { CID } from 'webnative/dist/ipfs'
import { getWebnative, getServerUrl, getServerDid } from './setup'
import { Address, SignedMessage, MessageBody, WalletInfo, Receipt } from './types'


export const cosignMessage = async (message: SignedMessage, prf: string): Promise<Receipt> => {
  const wn = getWebnative()
  const decoded = wn.ucan.decode(prf)
  const ucan = await wn.ucan.build({
    addSignature: true,
    audience: getServerDid(),
    resource: decoded.payload.rsc,
    potency: decoded.payload.ptc,
    proof: prf
  })
  const encoded = wn.ucan.encode(ucan)
  const headers = { Authorization: `Bearer ${encoded}`}
  const resp = await axios.post(`${getServerUrl()}/message`, { message }, { headers })
  return resp.data
}

export const formatMessage = async (to: string, ownPubKey: string, amount: number): Promise<MessageBody> => {
  const resp = await axios.get(`${getServerUrl()}/format?to=${to}&ownPubKey=${ownPubKey}&amount=${amount}`)
  return resp.data
}

export const getAggregatedAddress = async (publicKey: string): Promise<Address> => {
  const resp = await axios.get(`${getServerUrl()}/address?publicKey=${publicKey}`)
  return resp.data
}

export const getWalletInfo = async (publicKey: string): Promise<WalletInfo | null> => {
  try{
    const resp = await axios.get(`${getServerUrl()}/wallet?publicKey=${publicKey}`)
    return resp.data
  } catch(err) {
    return null
  }
}

export const getProviderAddress = async (): Promise<Address> => {
  const resp = await axios.get(`${getServerUrl()}/provider/address`)
  return resp.data
}

export const getProviderBalance = async (pubkey: string): Promise<number> => {
  const resp = await axios.get(`${getServerUrl()}/provider/balance/${pubkey}`)
  return resp.data.balance
}

export const getBalance = async (address: string): Promise<number> => {
  const resp = await axios.get(`${getServerUrl()}/balance/${address}`)
  return resp.data.balance
}

export const createWallet = async (publicKey: string, rootDid: string): Promise<WalletInfo> => {
  const resp = await axios.post(`${getServerUrl()}/wallet`, { publicKey, rootDid })
  return resp.data
}

export const waitForReceipt = async (messageId: string): Promise<Receipt> => {
  const resp = await axios.get(`${getServerUrl()}/waitmsg/${messageId}`, { timeout: 0 })
  return resp.data
}

export const getPastReciepts = async (publicKey: string): Promise<Receipt[]> => {
  const resp = await axios.get(`${getServerUrl()}/receipts/${publicKey}`)
  return resp.data
}

export const getMessageStatus = async (messageId: CID): Promise<Receipt> => {
  const resp = await axios.get(`${getServerUrl()}/message/${messageId}`)
  return resp.data
}

export const getBlockHeight = async (): Promise<number> => {
  const resp = await axios.get(`${getServerUrl()}/blockheight`)
  return resp.data.height
}

