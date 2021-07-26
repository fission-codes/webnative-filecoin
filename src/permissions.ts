import { Ucan } from 'webnative/dist/ucan'
import { RawPermission } from 'webnative/dist/ucan/permissions'
import * as setup from './setup'
import { HasDid } from './types'

export const requestCosignPermissions = async (
  hasDid: HasDid
): Promise<void> => {
  return requestCosignPermissionsForDid(hasDid.did)
}

export const requestCosignPermissionsForDid = async (
  did: string
): Promise<void> => {
  const wn = setup.getWebnative()
  const state = await wn.initialise({
    loadFileSystem: false,
    permissions: {
      raw: [rawPermissions(did)]
    }
  })

  if (state.scenario === wn.Scenario.NotAuthorised) {
    wn.redirectToLobby(state.permissions)
    return
  }
}

export const rawPermissions = (did: string): RawPermission => ({
  exp: Math.floor(Date.now() / 1000) + setup.getExpiry(), // Defaults to 1hr
  rsc: {
    cosign: did
  },
  ptc: {
    fil: {
      max: setup.getMaxFil()
    }
  }
})

export const findUcan = (did: string): Ucan | null => {
  const wn = setup.getWebnative()
  const ucan = wn.ucan.dictionary.lookup(`cosign:${did}`)
  if (!ucan) return null
  const decoded = wn.ucan.decode(ucan)
  return wn.ucan.isExpired(decoded) ? null : decoded
}

export const msTilExpire = (ucan: Ucan): number => {
  return ucan.payload.exp * 1000 - Date.now()
}

export const withinSpendLimit = (amount: number, ucan: Ucan): boolean => {
  const ptc = ucan.payload.ptc
  if (ptc === null || ptc === undefined) return false
  if (ptc === '*') return true
  if (typeof ptc !== 'object') return false
  const fil = ptc['fil']
  if (fil === null || fil === undefined) return false
  if (fil === '*') return true
  if (typeof fil !== 'object') return false
  const max = (fil as any)['max']
  if (typeof max !== 'number') return false
  return max >= amount
}
