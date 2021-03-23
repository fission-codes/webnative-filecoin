// eslint-disable-next-line @typescript-eslint/no-var-requires
// import type FileSystem from 'webnative/fs'
import Wallet from './wallet'
// import * as zondax from '@zondax/filecoin-signing-tools'
// import * as zondax from './zondax/filecoin_signer_wasm'
// import * as wasm from './zondax/filecoin_signer_wasm_bg.wasm'
// import * as zondax from './zondax'

export const getWallet = async (): Promise<Wallet> => {
  // const privKey = '3cf423b87b7fd25e1d252565e6a397f4712cc61750073fadc25ee738ff8c9055'
  // const privateKeyBuf = Buffer.from(privKey, 'hex')
  // const privKeyArr = new Uint8Array(privateKeyBuf)

  // const wasm = await require('./zondax/filecoin_signer_wasm_bg.wasm');
  // const wasmModule = new WebAssembly.Module(wasm);
  // const wasmInstance = new WebAssembly.Instance(wasmModule);
  // const keyRecoverBLS = wasmInstance.exports.keyRecoverBLS as CallableFunction; // exports.add if you test with the below linked wasm.
  // console.log(keyRecoverBLS(privKeyArr, true))
  // const zondax = await (wasm as any)()
  // console.log(zondax)
  // const publicKeyHexZondax = zondax.keyRecoverBLS(privateKeyBuf, true).public_hexstring
  // console.log(publicKeyHexZondax)
  return {} as any

  // return Wallet.create(privKey)
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
