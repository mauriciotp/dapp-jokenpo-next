import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { expect } from 'chai'
import hre from 'hardhat'

describe('JoKenPo', function () {
  async function deployFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners()

    const JoKenPo = await hre.ethers.getContractFactory('JoKenPo')
    const joKenPo = await JoKenPo.deploy()

    return { joKenPo, owner, otherAccount }
  }

  it('Should return true', async function () {
    const { joKenPo } = await loadFixture(deployFixture)

    expect(true).to.equal(true)
  })
})
