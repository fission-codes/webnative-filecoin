import * as wn from 'webnative'

type ServerVars = {
  url: string
  did: string
}

let serverVars: ServerVars = {
  url: 'https://cosigner.runfission.com/api/v1/filecoin',
  did: 'did:key:z2AHoGyfRQZ3Zdf8BJiTr7KJpFbzrif6NbFP7rutAcsHHQ3pbzecLF5VfdPpGuQ57cPYcBKAkHjrWnbARcaXGfokLC5i2L4XKCSrDtg',
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
