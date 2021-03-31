export const filToAttoFil = (amount: number): string => {
  const attoAmount = BigInt(amount * 1000) * BigInt(1000000000000000)
  return attoAmount.toString()
}

export const attoFilToFil = (amount: string): number => {
  return Number(BigInt(amount) / BigInt(1000000000000000)) / 1000
}
