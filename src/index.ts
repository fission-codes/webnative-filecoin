import type FileSystem from 'webnative/fs'
import Wallet from './wallet';

export const getWallet = async (fs: FileSystem): Promise<Wallet> => {
  const privKey = 'privKey'
  const address = 't3q5cgdg2b6uzazz7sbkdjqoafxzvuagbawh76wamwazupvvwzol7glitxs4e2j2wd5ncsg2mltrdt2t6gdisa'
  const providerAddress = 't1golw5yofvrksvnlxtiayovr7ptthae6n54ah6na'
  const balance = 10
  const providerBalance = 250.3
  const receiptTemplate = {
    from: address,
    to: providerAddress,
    amount: 0,
    time: Date.now(),
    blockheight: 31330
  }
  const receipts = [
    {
      ...receiptTemplate,
      amount: 1,
      time: 1612376941000
    },
    {
      ...receiptTemplate,
      amount: 2.2,
      time: 1613413741000
    }
  ] 
  return new Wallet({ privKey, address, providerAddress, balance, providerBalance, receipts })
}
