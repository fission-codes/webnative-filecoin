import axios from 'axios'
import { CID } from 'webnative/ipfs'
import { Address, SignedMessage, MessageBody, WalletInfo, Receipt } from './types'

// const API_URL = process.env.COSIGNER_API || 'https://cosigner.runfission.com/api/v1/filecoin'
const API_URL = 'https://cosigner.runfission.com/api/v1/filecoin'

export const cosignMessage = async (message: SignedMessage): Promise<CID> => {
  const resp = await axios.post(`${API_URL}/message`, { message })
  return resp.data
}

export const formatMessage = async (to: string, ownPubKey: string, amount: number): Promise<MessageBody> => {
  const resp = await axios.get(`${API_URL}/format?to=${to}&ownPubKey=${ownPubKey}&amount=${amount}`)
  return resp.data
}

export const getAggregatedAddress = async (publicKey: string): Promise<Address> => {
  const resp = await axios.get(`${API_URL}/address?ownPubKey=${publicKey}`)
  return resp.data
}

export const getWalletInfo = async (publicKey: string): Promise<WalletInfo> => {
  const resp = await axios.get(`${API_URL}/wallet?ownPubKey=${publicKey}`)
  return resp.data
}

export const getProviderAddress = async (): Promise<Address> => {
  const resp = await axios.get(`${API_URL}/provider/address`)
  return resp.data
}

export const getBalance = async (address: string): Promise<number> => {
  const resp = await axios.get(`${API_URL}/balance/${address}`)
  return resp.data.balance
}

export const createKeypair = async (publicKey: string): Promise<WalletInfo> => {
  const resp = await axios.post(`${API_URL}/keypair`, { publicKey })
  return resp.data
}

export const getOrCreateWallet = async (publicKey: string): Promise<WalletInfo> => {
  let wallet: WalletInfo
  try {
    wallet = await getWalletInfo(publicKey)
  } catch(err) {
    wallet = await createKeypair(publicKey)
  }
  return wallet
}

export const waitForReceipt = async (messageId: string): Promise<Receipt> => {
  const resp = await axios.get(`${API_URL}/waitmsg/${messageId}`, { timeout: 0 })
  return resp.data
}

export const getPastReciepts = async (publicKey: string): Promise<any> => {
  const resp = await axios.get(`${API_URL}/receipts/${publicKey}`)
  return resp.data
}
