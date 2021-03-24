import Wallet from './wallet'

export const getWallet = async (): Promise<Wallet> => {
  const privKey = '3cf423b87b7fd25e1d252565e6a397f4712cc61750073fadc25ee738ff8c9055'
  return Wallet.create(privKey)
}
