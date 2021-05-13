export type Address = string

export type WalletInfo = {
  aggPubKey: string
  address: string
  balance: number 
  providerBalance: number
  providerAddress: string
}

export type SignedMessage = {
  Message: MessageBody
  Signature: Signature
}

export type MessageBody = {
  Version: number
  To: string
  From: string
  Nonce: number
  Value: string
  GasLimit: number
  GasFeeCap: string
  GasPremium: string
  Method: number
  Params: string
  CID?: CIDObj
}

export type Signature = {
  Type: number
  Data: string
}

export type CIDObj = {
  "/": string
}

export enum MessageStatus {
  Sent = 0,
  Partial = 1,
  Verified = 2,
}

export type Receipt = {
  messageId: string
  from: Address
  to: Address
  amount: number
  time: number
  blockheight: number | null
  status: MessageStatus
}

export type CompletedReceipt = Receipt & {
  blockheight: number
}

export type KeyFile = {
  privateKey: string
  publicKey: string
  type: string
}

export interface HasDid {
  did: string
}
