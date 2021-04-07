import { KeyFile, Receipt } from "./types"

export const filToAttoFil = (amount: number): string => {
  const attoAmount = BigInt(amount * 1000) * BigInt(1000000000000000)
  return attoAmount.toString()
}

export const attoFilToFil = (amount: string): number => {
  return Number(BigInt(amount) / BigInt(1000000000000000)) / 1000
}

export const wait = async (time: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

export const mostRecent = (a: Receipt, b: Receipt): number => {
  return a.time - b.time
}

export const genPrivKeyStr = (): string => {
  const arr = new Uint8Array(32)
  window.crypto.getRandomValues(arr)
  return Buffer.from(arr).toString('hex')
}

export const genPrivKey = (): KeyFile => ({
  key: genPrivKeyStr(),
  type: 'bls12-381',
})
