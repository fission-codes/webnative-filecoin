// import type FileSystem from 'webnative/fs'
import Wallet from './wallet'
// import * as zondax from '@zondax/filecoin-signing-tools'
// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as zondax from './zondax'
// import * as zondax from './zondax'

export const getWallet = async (): Promise<Wallet> => {
  const privKey = '3cf423b87b7fd25e1d252565e6a397f4712cc61750073fadc25ee738ff8c9055'
  return Wallet.create(privKey)
  // const providerAddress = 't1hxbjgl7p2oexr2kckig6mkbw5t4qstjth54l2ja'
  // const balance = 10
  // const providerBalance = 250.3
  // const receiptTemplate = {
  //   from: address,
  //   to: providerAddress,
  //   amount: 0,
  //   time: Date.now(),
  //   blockheight: 31330
  // }
  // const receipts = [
  //   {
  //     ...receiptTemplate,
  //     amount: 1,
  //     time: 1612376941000
  //   },
  //   {
  //     ...receiptTemplate,
  //     amount: 2.2,
  //     time: 1613413741000
  //   }
  // ] 
  // return new Wallet({ privKey, address, providerAddress, balance, providerBalance, receipts })
}
