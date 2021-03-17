import axios from 'axios'
import { MessageBody } from './message'

const API_URL = 'http://localhost:3000/api/v1/filecoin'

export const formatMessage = async (to: string, ownPubKey: string, amount: number): Promise<MessageBody> => {
  const resp = await axios.get(`${API_URL}/format?to=${to}&ownPubKey=${ownPubKey}&amount=${amount}`)
  return resp.data
}

export const getProviderAddress = async (): Promise<string> => {
  const resp = await axios.get(`${API_URL}/provider/address`)
  return resp.data
}

export const getBalance = async (address: string): Promise<number> => {
  const resp = await axios.get(`${API_URL}/balance/${address}`)
  return resp.data.balance
}
