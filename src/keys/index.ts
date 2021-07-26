import filecoinAddress from '@glif/filecoin-address'
import * as filTools from './serialization'
import * as bls from 'noble-bls12-381'
import { SignedMessage, MessageBody } from '../types'
import { getNetworkPrefix } from '../setup'

export const normalizeToHex = (
  hexOrBuf: string | Buffer | Uint8Array
): string => {
  if (typeof hexOrBuf === 'string') return hexOrBuf
  return hexOrBuf.toString('hex')
}

export const hexToBase64 = (hex: string): string => {
  return Buffer.from(hex, 'hex').toString('base64')
}

export const signLotusMessage = async (
  message: MessageBody,
  key: string
): Promise<SignedMessage> => {
  const serialized = filTools.transactionSerializeRaw(message)
  const digest = filTools.getCID(serialized)
  const sigBuf = await bls.sign(digest, key)
  const sig = Buffer.from(sigBuf).toString('base64')
  return {
    Message: message,
    Signature: {
      Data: sig,
      Type: 2
    }
  }
}

export const privToPub = (privateHex: string): string => {
  const publicKey = bls.getPublicKey(privateHex)
  return normalizeToHex(publicKey)
}

export const privToPubBuf = (privateHex: string): Buffer => {
  const pubkey = privToPub(privateHex)
  return Buffer.from(pubkey, 'hex')
}

export const pubToAddress = (publicHex: string): string => {
  const pubBuf = Buffer.from(publicHex, 'hex')
  return pubBufToAddress(pubBuf)
}

export const pubBufToAddress = (publicKey: Buffer): string => {
  const rawAddress = filecoinAddress.newBLSAddress(publicKey)
  return filecoinAddress.encode(getNetworkPrefix(), rawAddress)
}

export const addressToPubKey = (address: string): string => {
  const rawAddress = filecoinAddress.newFromString(address)
  return Buffer.from(rawAddress.payload()).toString('hex')
}

export const privToAddress = (privateHex: string): string => {
  const publicKeyBuffer = privToPubBuf(privateHex)
  return pubBufToAddress(publicKeyBuffer)
}

export const aggKeyBufs = (key1: Buffer, key2: Buffer): Buffer => {
  const aggPubkey = bls.aggregatePublicKeys([key1, key2])
  return Buffer.from(aggPubkey)
}

export const aggKeys = (key1: string, key2: string): string => {
  const pubkey1 = Buffer.from(key1, 'hex')
  const pubkey2 = Buffer.from(key2, 'hex')
  const aggPubkey = aggKeyBufs(pubkey1, pubkey2)
  return aggPubkey.toString('hex')
}

export const pubBufToAggAddress = (key1: Buffer, key2: Buffer): string => {
  const aggPubkey = aggKeyBufs(key1, key2)
  return pubBufToAddress(aggPubkey)
}

export const privToAggAddress = (key1: string, key2: string): string => {
  const pubkey1 = privToPubBuf(key1)
  const pubkey2 = privToPubBuf(key2)
  return pubBufToAggAddress(pubkey1, pubkey2)
}

export const pubToAggAddress = (key1: string, key2: string): string => {
  const pubkey1 = Buffer.from(key1, 'hex')
  const pubkey2 = Buffer.from(key2, 'hex')
  return pubBufToAggAddress(pubkey1, pubkey2)
}

export const aggregateSigs = (sig1B64: string, sig2B64: string): string => {
  const sigs = [sig1B64, sig2B64].map(s => Buffer.from(s, 'base64'))
  const aggSig = bls.aggregateSignatures(sigs)
  return Buffer.from(aggSig).toString('base64')
}
