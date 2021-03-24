import * as keys from '../keys'
import * as client from '../client'

export enum Network {
  Main = 'f',
  Nerpa = 't',
}

export type Receipt = {
  from: Address
  to: Address
  amount: number
  time: number
  blockheight: number
}

export type Address = string

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
      client.getWalletInfo(pubKey)
    ])
    const { address, balance } = wallet
    const providerBalance = 50
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

  async formatMessage(amount: number, address: string): Promise<any> {
    return client.formatMessage(address, this.pubKey, amount)
  }

  async send(amount: number, address: string): Promise<Receipt> {
    const msg = await this.formatMessage(amount, address)
    const signed = await keys.signLotusMessage(msg, this.privKey)
    const resp = await client.cosignMessage(signed)
    console.log('RESP: ', resp)
    const receipt = {
      from: this.address,
      to: address,
      amount: amount,
      time: Date.now(),
      blockheight: 311330
    }
    this.receipts.push(receipt)
    return receipt 
  }

  async fundProvider(amount: number):  Promise<Receipt> {
    return this.send(amount, this.providerAddress)
  }

  async getPrevReceipts(): Promise<Receipt[]> {
    return this.receipts
  }
}
