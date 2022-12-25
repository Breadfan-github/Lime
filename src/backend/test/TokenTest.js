const { expect } =  require("chai")

describe('LIMEToken', () => {
	let LIMEToken
	let token

	beforeEach(async () => {
		LIMEToken = await ethers.getContractFactory('LIMEToken');
	    token = await LIMEToken.deploy('100000000000000000000');
	    [deployer, addr1, addr2, addr3, ...addrs] = await ethers.getSigners()
	    })


	describe('Deployment', () => {

		it('initializes the contract with the correct values', async () => {
			expect(await token.name()).to.equal('LIMEToken')
			expect(await token.symbol()).to.equal('$LIME')
			expect(await token.decimals()).to.equal(18)
			expect(await token.totalSupply()).to.equal('100000000000000000000')

		})

		it('allocates the initial supply upon deployment', async ()=> {
			let deployerBalance = await token.balanceOf(deployer.address)
			expect(deployerBalance).to.equal('100000000000000000000')

		})
	})

	describe('handles transfers', () => {

		it('transfers ownership', async () => {
			await token.connect(deployer).transfer(addr1.address, '10000000000000000000')
			let addr1AfterBalance = await token.balanceOf(addr1.address)
			let deployerAfterBalance = await token.balanceOf(deployer.address)
			expect(addr1AfterBalance.toString()).to.equal('10000000000000000000')
			expect(deployerAfterBalance.toString()).to.equal('90000000000000000000')


		})

		it('emits transfer events', async ()=> {
			expect(await token.connect(deployer).transfer(addr1.address, '1000000')).to.emit(token, "Transfer").withArgs(
				deployer.address,
				addr1.address,
				'1000000'
				)
		})

	})

	describe('handles approvals', () => {


		it('approves tokens for delegated transfer', async () => {
			expect(await token.connect(deployer).approve(addr1.address, '1000')).to.emit(token, "Approval").withArgs(
				deployer.address,
				addr1.address,
				'1000'
				)
			expect(await token.allowance(deployer.address, addr1.address)).to.equal('1000')
		})

		it('performs delegated transfers', async () => {
			await token.connect(deployer).approve(addr1.address, '1000')
			await token.connect(addr1).transferFrom(deployer.address, addr2.address, '500')
			let addr2AfterBalance = await token.balanceOf(addr2.address)
			expect(addr2AfterBalance.toString()).to.equal('500')

			// should fail
			// await token.connect(addr1).transferFrom(deployer.address, addr2.address, '501'))
		})

	})
})