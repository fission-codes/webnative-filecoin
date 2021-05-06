import * as keys from './keys'
import * as client from './client'
import { requestCosignPermissions } from './permissions'
import { Receipt, MessageBody, MessageStatus } from './types'
import { keyBy } from 'lodash'
import { CID } from 'webnative/dist/ipfs'
import * as setup from './setup'
import * as util from './util'

type ConstructorParams = {
  privKey: string
  pubKey: string
  address: string
  providerAddress: string
  balance: number
  providerBalance: number
  blockheight: number
  receipts: { [cid: string]: Receipt }
  ucan: string | null
}

export class Wallet {

  private privKey: string
  pubKey: string
  address: string
  providerAddress: string
  balance: number
  providerBalance: number
  blockheight: number
  receipts: { [cid: string]: Receipt }
  ucan: string | null

  constructor({ privKey, pubKey, address, providerAddress, balance, providerBalance, blockheight, receipts, ucan }: ConstructorParams) {
    this.privKey = privKey
    this.pubKey = pubKey
    this.address = address
    this.providerAddress = providerAddress
    this.balance = balance
    this.providerBalance = providerBalance
    this.blockheight = blockheight
    this.receipts = receipts
    this.ucan = ucan
  }

  static async create(privKey: string, requestPermission = true): Promise<Wallet> {
    const pubKey = keys.privToPub(privKey)
    const [providerAddress, walletInfo] = await Promise.all([
      client.getProviderAddress(),
      client.getOrCreateWallet(pubKey)
    ])
    const { address, balance, providerBalance } = walletInfo

    let ucan = null
    if(requestPermission) {
      await requestCosignPermissions(address)
      const dict = setup.getWebnative().ucanInternal.getDictionary()
      ucan = dict[`cosign:${address}`] || null
    }


    const receiptsList = await client.getPastReciepts(pubKey)
    const receipts = keyBy(receiptsList, 'messageId')

    const blockheight = await client.getBlockHeight()

    const wallet = new Wallet({
      privKey,
      pubKey,
      address,
      providerAddress,
      balance,
      providerBalance,
      blockheight,
      receipts,
      ucan
    })

    wallet.keepBlockHeightInSync()


    return wallet
  }

  getAddress(): string {
    return this.address
  }

  getProviderAddress(): string {
    return this.providerAddress
  }

  async getBalance(): Promise<number> {
    this.balance = await client.getBalance(this.address)
    return this.balance
  }

  async getProviderBalance(): Promise<number> {
    this.providerBalance = await client.getProviderBalance(this.pubKey)
    return this.providerBalance
  }

  async getBlockHeight(): Promise<number> {
    this.blockheight = await client.getBlockHeight()
    return this.blockheight
  }

  async formatMessage(address: string, amount: number): Promise<MessageBody> {
    if(amount > this.balance) throw new Error("Not enough funds")
    return client.formatMessage(address, this.pubKey, amount)
  }

  async send(address: string, amount: number): Promise<Receipt> {
    if(amount > this.balance) throw new Error("Not enough funds")
    if(this.ucan === null) throw new Error("No valid ucan, request permission first")
    const msg = await this.formatMessage(address, amount)
    const signed = await keys.signLotusMessage(msg, this.privKey)
    const receipt = await client.cosignMessage(signed, this.ucan)
    this.receipts[receipt.messageId] = receipt
    return receipt
  }

  async waitForReceipt(messageId: CID, status = MessageStatus.Partial): Promise<Receipt> {
    // wait 10s between polling for first confirmation & 2 min for final verification
    const waitTime = status === MessageStatus.Partial ? 10000 : 120000 
    const getStatus = async (): Promise<Receipt> => {
      const receipt = await this.getMessageStatus(messageId)
      this.receipts[receipt.messageId] = receipt
      if(receipt.status >= status) {
        return receipt
      }
      await util.wait(waitTime)
      return getStatus()
    }
    return getStatus()
  }

  async getMessageStatus(messageId: CID): Promise<Receipt> {
    return client.getMessageStatus(messageId)
  }

  async fundProvider(amount: number):  Promise<Receipt> {
    return this.send(this.providerAddress, amount)
  }

  getPrevReceipts(): Receipt[] {
    return Object.values(this.receipts).sort(util.mostRecent)
  }

  keepBlockHeightInSync(): void {
    //increment every 30s
    const update = (): void => {
      this.blockheight++
      setTimeout(update, 30000)
    }
    update()

    // every 5 min, make sure we have the correct number
    const verify = async (): Promise<void> => {
      this.blockheight = await client.getBlockHeight()
      setTimeout(verify, 300000)
    }
    verify()
  }
}

export default Wallet
