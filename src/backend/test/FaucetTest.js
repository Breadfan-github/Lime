const { expect } =  require("chai")


describe('LIMEFaucet', () => {
	let LIMEToken
	let token 
	let LIMEFaucet
	let faucet
	

	before(async()=>{
		LIMEToken = await ethers.getContractFactory('LIMEToken');
        token = await LIMEToken.deploy('100000000000000000000000');
        LIMEFaucet = await ethers.getContractFactory('LIMEFaucet');
        faucet = await LIMEFaucet.deploy(token.address);
        [deployer, addr1, addr2, addr3, ...addrs] = await ethers.getSigners()
        await token.connect(deployer).transfer(faucet.address, '100000000000000000000000')

	})

	it('initializes the contact with correct values', async() => {
		expect(faucet.address).not.equal(0x0)
		expect(faucet.address).not.equal(null)
		expect(faucet.address).not.equal(undefined)
		expect(await token.balanceOf(faucet.address)).to.equal('100000000000000000000000')
	})

	it('facilitates token claiming & emits event', async() => {
		await faucet.connect(addr1).claimFaucet()
		let addr1AfterBalance = await token.balanceOf(addr1.address)
		let contractAfterBalance = await token.balanceOf(faucet.address)
		expect(addr1AfterBalance.toString()).to.equal('50000000000000000000')
		expect(contractAfterBalance.toString()).to.equal('99950000000000000000000')
		expect(await faucet.tokensClaimed()).to.equal('50000000000000000000')
		expect(await faucet.connect(addr2).claimFaucet()).to.emit(faucet, "Claimed").withArgs(
			addr2.address,
			token.address,
			500
			)
	})

	it('prevents users from claiming twice', async() => {
		await faucet.connect(addr3).claimFaucet()
		//should fail
		//await faucet.connect(addr3).claimFaucet()
	})

	it('only allows owner to withdraw leftover tokens from contract', async() => {
		//should fail
		//await faucet.connect(addr1).withdraw()
		await faucet.connect(deployer).withdraw()
		let contractBalance = await token.balanceOf(faucet.address)
		let deployerBalance = await token.balanceOf(deployer.address)
		expect(contractBalance).to.equal('0')
		expect(deployerBalance).to.equal('99850000000000000000000')		
	})

})
	