import Wallet from './wallet'
import FileSystem from 'webnative/fs'
import { genPrivKey } from './util'
import { DEFAULT_KEY_NAME } from './constants'
import { isKeyFile } from './types'

export * from './wallet'
export * from './keys'
export * from './util'
export * from './types'
export * from './constants'

export const getWallet = async (fs: FileSystem, keyname = DEFAULT_KEY_NAME): Promise<Wallet> => {
  const path = `private/Keychain/${keyname}/key.json`
  let privKey = null
  try {
    privKey = await fs.read(path)
    if(privKey !== null){
      console.log("🗝️ Got existing private key")
    }
  } catch(err) {
    // key doesn't exist yet, we'll create one
  }

  if(privKey !== null && (!isKeyFile(privKey) || privKey.type !== 'bls12-381')) {
    throw new Error(`Found an invalid keyfile at ${path}. Must be a valid bls12-381 private key`)
  }

  if(privKey === null) {
    privKey = genPrivKey()
    await fs.write(path, privKey)
    await fs.publish()
    console.log("🔑 Created new private key")
  }

  return Wallet.create(privKey.key)
}
