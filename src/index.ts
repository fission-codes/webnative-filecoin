import Wallet from './wallet'
import * as keys from './keys'
import * as util from './util'
import * as types from './types'

export * from './keys'
export * from './util'
export * from './types'

export const getWallet = async (privKey: string): Promise<Wallet> => {
  return Wallet.create(privKey)
}

export default {
  ...util,
  ...keys,
  ...types,
  getWallet, 
  Wallet
}
