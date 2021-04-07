import Wallet from './wallet'
import FileSystem from 'webnative/fs'
import { genKeyFile } from './util'
import { DEFAULT_KEY_NAME } from './constants'
import { isKeyFile } from './types'

export * from './wallet'
export * from './keys'
export * from './util'
export * from './types'
export * from './constants'

export const getWallet = async (fs: FileSystem, keyname = DEFAULT_KEY_NAME): Promise<Wallet> => {
  const path = `private/Keychain/${keyname}/key.json`
  let keyFile = null
  try {
    keyFile = await fs.read(path)
    if(keyFile !== null){
      console.log("🗝️ Got existing private key")
    }
  } catch(err) {
    // key doesn't exist yet, we'll create one
  }

  if(keyFile !== null && (!isKeyFile(keyFile) || keyFile.type !== 'bls12-381')) {
    throw new Error(`Found an invalid keyfile at ${path}. Must be a valid bls12-381 private key`)
  }

  if(keyFile === null) {
    keyFile = genKeyFile()
    await fs.write(path, keyFile)
    await fs.publish()
    console.log("🔑 Created new private key")
  }

  return Wallet.create(keyFile.privateKey)
}
