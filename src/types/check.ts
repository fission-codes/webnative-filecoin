import { SignedMessage, MessageBody, Signature, KeyFile } from './types'

export const isMessageBody = (obj: any): obj is MessageBody => {
  return typeof obj === 'object'
      && typeof obj.Version === 'number'
      && typeof obj.To === 'string'
      && typeof obj.From === 'string'
      && typeof obj.Nonce === 'number'
      && typeof obj.GasLimit === 'number'
      && typeof obj.GasFeeCap === 'string'
      && typeof obj.GasPremium === 'string'
      && typeof obj.Method === 'number'
      && typeof obj.Params === 'string'
}

export const isSignature = (obj: any): obj is Signature => {
  return typeof obj === 'object'
      && typeof obj.Type === 'number'
      && typeof obj.Data === 'string'
}

export const isMessage = (obj: any): obj is SignedMessage => {
  return typeof obj === 'object'
      && isMessageBody(obj.Message)
      && isSignature(obj.Signature)
}

export const isKeyFile = (obj: any): obj is KeyFile => {
  return typeof obj === 'object'
      && typeof obj.privateKey === 'string'
      && typeof obj.publicKey === 'string'
      && typeof obj.type === 'string'
}
