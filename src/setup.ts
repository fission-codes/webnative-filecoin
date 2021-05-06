import * as wn from 'webnative'

let wnImpl = wn

export const webnative = (impl: typeof wn): void => {
  wnImpl = impl
}

export const getWebnative = (): typeof wn => {
  return wnImpl
}
