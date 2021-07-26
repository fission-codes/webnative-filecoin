import * as wn from 'webnative'

type ServerVars = {
  url: string
  did: string
  networkPrefix: string
  maxFil: number
  expiry: number
}

let serverVars: ServerVars = {
  url: 'https://cosigner.runfission.com/api/v1/filecoin',
  did:
    'did:key:z2AHoGyfRQZ3Zdf8BJiTr7KJpFbzrif6NbFP7rutAcsHHQ3pbzecLF5VfdPpGuQ57cPYcBKAkHjrWnbARcaXGfokLC5i2L4XKCSrDtg',
  networkPrefix: 't',
  maxFil: 1,
  expiry: 3600
}

let wnImpl = wn

export const webnative = (impl: typeof wn): void => {
  wnImpl = impl
}

export const getWebnative = (): typeof wn => {
  return wnImpl
}

export const server = (update: Partial<ServerVars>): void => {
  serverVars = {
    ...serverVars,
    ...update
  }
}

export const getServerUrl = (): string => {
  return serverVars.url
}

export const getServerDid = (): string => {
  return serverVars.did
}

export const getNetworkPrefix = (): string => {
  return serverVars.networkPrefix
}

export const getMaxFil = (): number => {
  return serverVars.maxFil
}

export const getExpiry = (): number => {
  return serverVars.expiry
}
