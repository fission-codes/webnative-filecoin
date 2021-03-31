import * as keys from '../keys'
import * as client from '../client'
import { Receipt, MessageBody } from '../types'
import { CID } from 'webnative/ipfs'

type ConstructorParams = {
  privKey: string
  pubKey: string
  address: string
  providerAddress: string
  balance: number
  providerBalance: number
  receipts: Receipt[]
}

export default class Wallet {

  private privKey: string
  pubKey: string
  address: string
  providerAddress: string
  balance: number
  providerBalance: number
  receipts: Receipt[]

  constructor({ privKey, pubKey, address, providerAddress, balance, providerBalance, receipts }: ConstructorParams) {
    this.privKey = privKey
    this.pubKey = pubKey
    this.address = address
    this.providerAddress = providerAddress
    this.balance = balance
    this.providerBalance = providerBalance
    this.receipts = receipts
  }

  static async create(privKey: string): Promise<Wallet> {
    const pubKey = keys.privToPub(privKey)
    const [providerAddress, wallet] = await Promise.all([
      client.getProviderAddress(),
      client.getOrCreateWallet(pubKey)
    ])
    const { address, balance } = wallet
    const providerBalance = 50
    const transactions = await client.getPastReciepts(pubKey)
    const receipts = [] as Receipt[]

    return new Wallet({
      privKey,
      pubKey,
      address,
      providerAddress,
      balance,
      providerBalance,
      receipts
    })
  }

  getAddress(): string {
    return this.address
  }

  getProviderAddress(): string {
    return this.providerAddress
  }

  async getBalance(): Promise<number> {
    return this.balance
  }

  async getProviderBalance(): Promise<number> {
    return this.providerBalance
  }

  async formatMessage(amount: number, address: string): Promise<MessageBody> {
    return client.formatMessage(address, this.pubKey, amount)
  }

  async send(amount: number, address: string): Promise<CID> {
    const msg = await this.formatMessage(amount, address)
    const signed = await keys.signLotusMessage(msg, this.privKey)
    const resp = await client.cosignMessage(signed)
    return resp
  }

  async fundProvider(amount: number):  Promise<CID> {
    return this.send(amount, this.providerAddress)
  }

  async getPrevReceipts(): Promise<Receipt[]> {
    return this.receipts
  }

  async waitForReceipt(messageId: string): Promise<Receipt> {
    return client.waitForReceipt(messageId)
  }
}
