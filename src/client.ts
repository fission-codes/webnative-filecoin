import axios from 'axios'
import { MessageBody } from './message'

const API_URL = 'http://localhost:3000/api/v1/filecoin'

export const formatMessage = async (to: string, ownPubKey: string, amount: number): Promise<MessageBody> => {
  const resp = await axios.get(`${API_URL}/format?to=${to}&ownPubKey=${ownPubKey}&amount=${amount}`)
  return resp.data
}
