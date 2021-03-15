export type Message = {
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
  CID: CIDObj

}

export type Signature = {
  Type: number
  Data: string
}

export type CIDObj = {
  "/": string
}
