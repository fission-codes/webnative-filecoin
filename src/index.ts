import Wallet from './wallet'

export * from './wallet'
export * from './keys'
export * from './util'
export * from './types'

export const getWallet = async (privKey: string): Promise<Wallet> => {
  return Wallet.create(privKey)
}
