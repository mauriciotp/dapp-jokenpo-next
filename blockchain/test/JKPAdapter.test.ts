import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { expect } from 'chai'
import hre from 'hardhat'

describe('JKPAdapter', function () {
  enum Options {
    NONE,
    ROCK,
    PAPER,
    SCISSORS,
  }

  const DEFAULT_BID = hre.ethers.parseEther('0.01')
  const DEFAULT_COMMISSION = 10

  async function deployFixture() {
    const [owner, player1, player2] = await hre.ethers.getSigners()

    const JoKenPo = await hre.ethers.getContractFactory('JoKenPo')
    const joKenPo = await JoKenPo.deploy()

    const JKPAdapter = await hre.ethers.getContractFactory('JKPAdapter')
    const jkpAdapter = await JKPAdapter.deploy()

    return { joKenPo, jkpAdapter, owner, player1, player2 }
  }

  it('Should get implementation address', async function () {
    const { joKenPo, jkpAdapter } = await loadFixture(deployFixture)

    const address = await joKenPo.getAddress()
    await jkpAdapter.upgrade(address)
    const implementationAddress = await jkpAdapter.getImplementationAddress()

    expect(address).to.equal(implementationAddress)
  })

  it('Should get bid', async function () {
    const { joKenPo, jkpAdapter } = await loadFixture(deployFixture)

    const address = await joKenPo.getAddress()

    await jkpAdapter.upgrade(address)

    const bid = await jkpAdapter.getBid()

    expect(bid).to.equal(DEFAULT_BID)
  })

  it('Should NOT get bid (upgrade)', async function () {
    const { jkpAdapter } = await loadFixture(deployFixture)

    await expect(jkpAdapter.getBid()).to.be.revertedWith(
      'You must upgrade first',
    )
  })

  it('Should get commission', async function () {
    const { joKenPo, jkpAdapter } = await loadFixture(deployFixture)

    const address = joKenPo.getAddress()

    await jkpAdapter.upgrade(address)

    const commission = await jkpAdapter.getCommission()

    expect(commission).to.equal(DEFAULT_COMMISSION)
  })

  it('Should NOT get commission (upgrade)', async function () {
    const { jkpAdapter } = await loadFixture(deployFixture)

    await expect(jkpAdapter.getCommission()).to.be.revertedWith(
      'You must upgrade first',
    )
  })

  it('Should NOT upgrade (permission)', async function () {
    const { joKenPo, jkpAdapter, player1 } = await loadFixture(deployFixture)

    const address = await joKenPo.getAddress()

    const player1Instance = jkpAdapter.connect(player1)

    await expect(player1Instance.upgrade(address)).to.be.revertedWith(
      'You do not have permission',
    )
  })

  it('Should play alone by adapter', async function () {
    const { joKenPo, jkpAdapter, player1 } = await loadFixture(deployFixture)

    const address = joKenPo.getAddress()

    await jkpAdapter.upgrade(address)

    const player1Instance = jkpAdapter.connect(player1)

    await player1Instance.play(Options.ROCK, { value: DEFAULT_BID })

    const result = await player1Instance.getResult()

    expect(result).to.equal(
      'Player 1 already choose his/her option, waiting for player 2.',
    )
  })

  it('Should play along by adapter', async function () {
    const { joKenPo, jkpAdapter, player1, player2 } =
      await loadFixture(deployFixture)

    const address = joKenPo.getAddress()

    await jkpAdapter.upgrade(address)

    const player1Instance = jkpAdapter.connect(player1)

    await player1Instance.play(Options.ROCK, { value: DEFAULT_BID })

    const player2Instance = jkpAdapter.connect(player2)

    await player2Instance.play(Options.SCISSORS, { value: DEFAULT_BID })

    const result = await player1Instance.getResult()

    expect(result).to.equal('Rock breaks scissors, player 1 won.')
  })
})
