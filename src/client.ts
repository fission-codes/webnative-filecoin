import axios from 'axios'
import { CID } from 'webnative/dist/ipfs'
import * as setup from './setup'
import { Address, SignedMessage, MessageBody, WalletInfo, Receipt } from './types'

const SERVER_DID = 'did:key:z2AHoGyfRQZ3Zdf8BJiTr7KJpFbzrif6NbFP7rutAcsHHQ3pbzecLF5VfdPpGuQ57cPYcBKAkHjrWnbARcaXGfokLC5i2L4XKCSrDtg'

const API_URL = 'http://localhost:3000/api/v1/filecoin'
// const API_URL = 'https://cosigner.runfission.com/api/v1/filecoin'

// const API_URL = process.env.NODE_ENV === 'development'
//   ? 'http://localhost:3000/api/v1/filecoin'
//   : 'https://cosigner.runfission.com/api/v1/filecoin'


export const cosignMessage = async (message: SignedMessage, prf: string): Promise<Receipt> => {
  const wn = setup.getWebnative()
  const decoded = wn.ucan.decode(prf)
  const ucan = await wn.ucan.build({
    addSignature: true,
    audience: SERVER_DID,
    resource: decoded.payload.rsc,
    potency: decoded.payload.ptc,
    proof: prf
  })
  const encoded = wn.ucan.encode(ucan)
  const headers = { Authorization: `Bearer ${encoded}`}
  const resp = await axios.post(`${API_URL}/message`, { message }, { headers })
  return resp.data
}

export const formatMessage = async (to: string, ownPubKey: string, amount: number): Promise<MessageBody> => {
  const resp = await axios.get(`${API_URL}/format?to=${to}&ownPubKey=${ownPubKey}&amount=${amount}`)
  return resp.data
}

export const getAggregatedAddress = async (publicKey: string): Promise<Address> => {
  const resp = await axios.get(`${API_URL}/address?publicKey=${publicKey}`)
  return resp.data
}

export const getWalletInfo = async (publicKey: string): Promise<WalletInfo | null> => {
  try{
    const resp = await axios.get(`${API_URL}/wallet?publicKey=${publicKey}`)
    return resp.data
  } catch(err) {
    return null
  }
}

export const getProviderAddress = async (): Promise<Address> => {
  const resp = await axios.get(`${API_URL}/provider/address`)
  return resp.data
}

export const getProviderBalance = async (pubkey: string): Promise<number> => {
  const resp = await axios.get(`${API_URL}/provider/balance/${pubkey}`)
  return resp.data.balance
}

export const getBalance = async (address: string): Promise<number> => {
  const resp = await axios.get(`${API_URL}/balance/${address}`)
  return resp.data.balance
}

export const createWallet = async (publicKey: string, rootDid: string): Promise<WalletInfo> => {
  const resp = await axios.post(`${API_URL}/wallet`, { publicKey, rootDid })
  return resp.data
}

export const waitForReceipt = async (messageId: string): Promise<Receipt> => {
  const resp = await axios.get(`${API_URL}/waitmsg/${messageId}`, { timeout: 0 })
  return resp.data
}

export const getPastReciepts = async (publicKey: string): Promise<Receipt[]> => {
  const resp = await axios.get(`${API_URL}/receipts/${publicKey}`)
  return resp.data
}

export const getMessageStatus = async (messageId: CID): Promise<Receipt> => {
  const resp = await axios.get(`${API_URL}/message/${messageId}`)
  return resp.data
}

export const getBlockHeight = async (): Promise<number> => {
  const resp = await axios.get(`${API_URL}/blockheight`)
  return resp.data.height
}

