import { RawPermission } from 'webnative/dist/ucan/permissions'
import * as setup from './setup'
import { HasDid } from './types'

export const requestCosignPermissions = async (hasDid: HasDid): Promise<void> => {
  return requestCosignPermissionsForDid(hasDid.did)
}

export const requestCosignPermissionsForDid = async (did: string): Promise<void> => {
  const wn = setup.getWebnative()
  const state = await wn.initialise({
    loadFileSystem: false,
    permissions: {
      raw: [ rawPermissions(did) ]
    }
  })

  if (state.scenario === wn.Scenario.NotAuthorised) {
    wn.redirectToLobby(state.permissions)
    return
  }
}

export const rawPermissions = (did: string): RawPermission => ({
  exp: Math.floor(Date.now() / 1000) + 3600, // 1hr
  rsc: { 
    cosign: did
  },
  ptc: {
    fil: {
      max: 1000
    }
  }
})

export const findUcan = (did: string): string | null => {
  const wn = setup.getWebnative()
  const ucan = wn.ucan.dictionary.lookup(`cosign:${did}`)
  if(!ucan) return null
  const decoded = wn.ucan.decode(ucan)
  return wn.ucan.isExpired(decoded) ? null : ucan
}

export const msTilExpire = (ucan: string): number => {
  const wn = setup.getWebnative()
  const decoded = wn.ucan.decode(ucan)
  return decoded.payload.exp * 1000 - Date.now()
} 
