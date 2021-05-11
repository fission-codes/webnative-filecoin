# Webnative Filecoin

[![NPM](https://img.shields.io/npm/v/webnative)](https://www.npmjs.com/package/webnative-filecoin)
[![Build Status](https://travis-ci.org/fission-suite/webnative-fielcoin.svg?branch=master)](https://travis-ci.org/fission-suite/webnative-filecoin)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/fission-suite/blob/master/LICENSE)
[![Maintainability](https://api.codeclimate.com/v1/badges/b06e29f811583d24009a/maintainability)](https://codeclimate.com/github/fission-suite/webnative-filecoin/maintainability)
[![Built by FISSION](https://img.shields.io/badge/⌘-Built_by_FISSION-purple.svg)](https://fission.codes)
[![Discord](https://img.shields.io/discord/478735028319158273.svg)](https://discord.gg/zAQBDEq)
[![Discourse](https://img.shields.io/discourse/https/talk.fission.codes/topics)](https://talk.fission.codes)

Send secure Filecoin transactions from the browser.

Use Fission's [webnative](https://github.com/fission-suite/webnative) SDK to store keys and securely send transactions by aggregating signatures between the in-browser key and a cosigning server that depends on [UCANs](https://blog.fission.codes/auth-without-backend/) (user-controlled, distributed auth tokens).

# Get started
```ts
import { getWallet, getWalletFromKey, DEFAULT_KEY_PERMISSION } from 'webnative-filecoin'
import * as wn from 'webnative'

// Initialize webnative
const state = await wn.initialise({
  permissions: {
    app: {
      name: 'AppName',
      creator: 'Creator'
    },
    fs: {
      // make sure to request permission for the keychain path
      privatePaths:[DEFAULT_KEY_PERMISSION] // Defaults to `private/Keychain/fil-cosigner`
      publicPaths:[]
    }
  }
})
// Do necessary state checks / redirects

// Pass the filesystem to webnative-filecoin as well as your implementation of wn
const wallet = await getWallet(state.fs, wn) // if using a keyName other than the default, pass that as a third param
// Fund the Fission storage provider
const receipt = await wallet.fundProvider(1)
// Send FIL to an arbitrary address
const receipt2 = await wallet.send('t1hx...', 1)
// Wait for tx to be confirmed on Filecoin network
const verifiedReceipt = await wallet.waitForReceipt(receipt.messageId)
```

# Development
```shell
# install dependencies
yarn

# build
yarn build

# build w/ reloading
yarn dev

# test
yarn test

# test w/ reloading
yarn test:watch
```
