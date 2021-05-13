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
  exp: Date.now() + 60000,
  rsc: { 
    cosign: did
  },
  ptc: {
    fil: {
      max: 1000
    }
  }
})
