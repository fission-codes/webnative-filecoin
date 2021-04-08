import { KeyFile, Receipt } from "./types"
import * as keys from './keys'

const ATTO_MULTIPLIER = BigInt(1000000000000000)
const PICO_MULTIPLIER = BigInt(1000000000)

export const filToAttoFil = (amount: number): string => {
  const attoAmount = BigInt(amount * 1000) * ATTO_MULTIPLIER
  return attoAmount.toString()
}

export const attoFilToFil = (amount: string): number => {
  return Number(BigInt(amount) / ATTO_MULTIPLIER) / 1000
}

export const filToPicoFil = (amount: number): string => {
  const attoAmount = BigInt(amount * 1000) * PICO_MULTIPLIER
  return attoAmount.toString()
}

export const picoFilToFil = (amount: string): number => {
  return Number(BigInt(amount) / PICO_MULTIPLIER) / 1000
}

export const picoFilToAttoFil = (amount: string): string => {
  const attoAmount = BigInt(amount) * BigInt(1000000)
  return attoAmount.toString()
}

export const attoFilToPicoFil = (amount: string): string => {
  const picoAmount = BigInt(amount) / BigInt(1000000)
  return picoAmount.toString()
}

export const wait = async (time: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

export const mostRecent = (a: Receipt, b: Receipt): number => {
  return a.time - b.time
}

export const genPrivKey = (): string => {
  const arr = new Uint8Array(32)
  window.crypto.getRandomValues(arr)
  return Buffer.from(arr).toString('hex')
}

export const genKeyFile = (): KeyFile => {
  const privateKey = genPrivKey()
  const publicKey = keys.privToPub(privateKey)

  return {
    privateKey,
    publicKey,
    type: 'bls12-381',
  }
}
