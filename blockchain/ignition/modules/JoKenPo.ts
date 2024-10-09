import { buildModule } from '@nomicfoundation/hardhat-ignition/modules'

const JoKenPoModule = buildModule('JoKenPoModule', (m) => {
  const joKenPo = m.contract('JoKenPo')

  const jkpAdapter = m.contract('JKPAdapter')

  m.call(jkpAdapter, 'upgrade', [joKenPo])

  return { joKenPo, jkpAdapter }
})

export default JoKenPoModule
