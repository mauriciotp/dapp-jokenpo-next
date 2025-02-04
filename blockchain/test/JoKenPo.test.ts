import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { expect } from 'chai'
import hre from 'hardhat'

describe('JoKenPo', function () {
  enum Options {
    NONE,
    ROCK,
    PAPER,
    SCISSORS,
  }

  const DEFAULT_BID = hre.ethers.parseEther('0.01')

  async function deployFixture() {
    const [owner, player1, player2] = await hre.ethers.getSigners()

    const JoKenPo = await hre.ethers.getContractFactory('JoKenPo')
    const joKenPo = await JoKenPo.deploy()

    return { joKenPo, owner, player1, player2 }
  }

  it('Should get leaderboard', async function () {
    const { joKenPo, player1, player2 } = await loadFixture(deployFixture)

    const player1Instance = joKenPo.connect(player1)
    await player1Instance.play(Options.PAPER, { value: DEFAULT_BID })

    const player2Instance = joKenPo.connect(player2)
    await player2Instance.play(Options.ROCK, { value: DEFAULT_BID })

    const leaderboard = await joKenPo.getLeaderBoard()

    expect(leaderboard.length).to.equal(1)
    expect(leaderboard[0].wallet).to.equal(player1.address)
    expect(leaderboard[0].wins).to.equal(1)
  })

  it('Should set bid', async function () {
    const { joKenPo } = await loadFixture(deployFixture)

    const newBid = hre.ethers.parseEther('0.02')

    await joKenPo.setBid(newBid)

    const updatedBid = await joKenPo.getBid()

    expect(updatedBid).to.equal(newBid)
  })

  it('Should NOT set bid (permission)', async function () {
    const { joKenPo, player1 } = await loadFixture(deployFixture)

    const newBid = hre.ethers.parseEther('0.02')

    const player1Instance = joKenPo.connect(player1)

    await expect(player1Instance.setBid(newBid)).to.be.revertedWith(
      'You do not have permission',
    )
  })

  it('Should NOT set bid (game in progress)', async function () {
    const { joKenPo, player1 } = await loadFixture(deployFixture)

    const player1Instance = joKenPo.connect(player1)

    await player1Instance.play(Options.ROCK, { value: DEFAULT_BID })

    const newBid = hre.ethers.parseEther('0.02')

    await expect(joKenPo.setBid(newBid)).to.be.revertedWith(
      'You cannot change the bid with a game in progress',
    )
  })

  it('Should set commission', async function () {
    const { joKenPo } = await loadFixture(deployFixture)

    const newCommission = 20n

    await joKenPo.setCommission(newCommission)

    const updatedCommission = await joKenPo.getCommission()

    expect(updatedCommission).to.equal(newCommission)
  })

  it('Should NOT set commission (permission)', async function () {
    const { joKenPo, player1 } = await loadFixture(deployFixture)

    const newCommission = 20n

    const player1Instance = joKenPo.connect(player1)

    await expect(
      player1Instance.setCommission(newCommission),
    ).to.be.revertedWith('You do not have permission')
  })

  it('Should NOT set commission (game in progress)', async function () {
    const { joKenPo, player1 } = await loadFixture(deployFixture)

    const newCommission = 20n

    const player1Instance = joKenPo.connect(player1)

    await player1Instance.play(Options.ROCK, { value: DEFAULT_BID })

    await expect(joKenPo.setCommission(newCommission)).to.be.revertedWith(
      'You cannot change the commission with a game in progress',
    )
  })

  it('Should play alone', async function () {
    const { joKenPo, player1 } = await loadFixture(deployFixture)

    const player1Instance = joKenPo.connect(player1)

    await player1Instance.play(Options.ROCK, { value: DEFAULT_BID })

    const result = await joKenPo.getResult()

    expect(result).to.equal(
      'Player 1 already choose his/her option, waiting for player 2.',
    )
  })

  it('Should play along', async function () {
    const { joKenPo, player1, player2 } = await loadFixture(deployFixture)

    const player1Instance = joKenPo.connect(player1)
    const player2Instance = joKenPo.connect(player2)

    await player1Instance.play(Options.ROCK, { value: DEFAULT_BID })
    await player2Instance.play(Options.SCISSORS, { value: DEFAULT_BID })

    const result = await joKenPo.getResult()

    expect(result).to.equal('Rock breaks scissors, player 1 won.')
  })

  it('Should NOT play alone (owner)', async function () {
    const { joKenPo } = await loadFixture(deployFixture)

    await expect(
      joKenPo.play(Options.ROCK, { value: DEFAULT_BID }),
    ).to.be.revertedWith('The owner cannot play')
  })

  it('Should NOT play alone (wrong option)', async function () {
    const { joKenPo, player1 } = await loadFixture(deployFixture)

    const player1Instance = joKenPo.connect(player1)

    await expect(
      player1Instance.play(Options.NONE, { value: DEFAULT_BID }),
    ).to.be.revertedWith('Invalid choice')
  })

  it('Should NOT play alone (twice in a row)', async function () {
    const { joKenPo, player1 } = await loadFixture(deployFixture)

    const player1Instance = joKenPo.connect(player1)

    await player1Instance.play(Options.ROCK, { value: DEFAULT_BID })

    await expect(
      player1Instance.play(Options.PAPER, { value: DEFAULT_BID }),
    ).to.be.revertedWith('Wait the another player')
  })

  it('Should NOT play alone (wrong bid)', async function () {
    const { joKenPo, player1 } = await loadFixture(deployFixture)

    const player1Instance = joKenPo.connect(player1)

    await expect(
      player1Instance.play(Options.ROCK, { value: DEFAULT_BID - 1n }),
    ).to.be.revertedWith('Invalid bid')
  })
})
