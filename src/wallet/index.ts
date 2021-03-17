import * as keys from '../keys'
import * as client from '../client'
// API (for phase 2 stuff)
// -----------------------
// - Get Wallet
// - Send
//   + From wallet to lotus node
//   + Probably just amount and address of wallet managed by Lotus node?
// - Balances
//   + Wallet in app
//   + Wallet managed by Lotus node
// 
// Parts:
// keychain
// UCANs
// lotus node


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
  address: string
  providerAddress: string
  balance: number
  providerBalance: number
  receipts: Receipt[]
}

export default class Wallet {

  private privKey: string
  address: string
  providerAddress: string
  balance: number
  providerBalance: number
  receipts: Receipt[]

  constructor({ privKey, address, providerAddress, balance, providerBalance, receipts }: ConstructorParams) {
    this.privKey = privKey
    this.address = address
    this.providerAddress = providerAddress
    this.balance = balance
    this.providerBalance = providerBalance
    this.receipts = receipts
  }

  static async create(privKey: string): Promise<Wallet> {
    const address = keys.privToAddress(privKey)
    const [providerAddress, balance] = await Promise.all([
      client.getProviderAddress(),
      client.getBalance(address)
    ])
    const providerBalance = 50
    const receipts = [] as Receipt[]

    return new Wallet({
      privKey,
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

  async fundProvider(amount: number):  Promise<Receipt> {
    if(amount > this.balance) {
      throw new Error("Insufficient funds")
    }
    this.balance -= amount
    this.providerBalance += amount
    const receipt = {
      from: this.address,
      to: this.providerAddress,
      amount: amount,
      time: Date.now(),
      blockheight: 311330
    }
    this.receipts.push(receipt)
    return receipt 
  }

  async getPrevReceipts(): Promise<Receipt[]> {
    return this.receipts
  }
}
