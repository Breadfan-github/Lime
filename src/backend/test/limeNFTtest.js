const { expect } =  require("chai")

describe('LIMEnft', () => {
	let LIMEnft
	let nft

	beforeEach(async () => {
		LIMEnft = await ethers.getContractFactory('LIMEnft');
        nft = await LIMEnft.deploy();
	    [deployer, addr1, addr2, addr3, ...addrs] = await ethers.getSigners()
	    })


	describe('Deployment', () => {

		it('initializes the contract with the correct values', async () => {
			expect(await nft.name()).to.equal('LIMEnft')
			expect(await nft.symbol()).to.equal('LIME')			
			expect(await nft.totalSupply()).to.equal(100)
			expect(await nft.tokenCount()).to.equal(0)
		})
	})

	describe('Minting', () => {

		it('facilitates minting & sets nfts with correct values', async () => {
			await nft.connect(addr1)._mint(addr1.address)
			expect(await nft.tokenCount()).to.equal(1)			
			expect(await nft.ownerOf(1)).to.equal(addr1.address)
			expect(await nft.balanceOf(addr1.address)).to.equal(1)
		})
	})

	describe('handles transfers', () => {

		it('transfers ownership', async () => {
			await nft.connect(addr1)._mint(addr1.address)
			await nft.connect(addr1).transferFrom(addr1.address ,addr2.address, 1).to.emit(nft, "Transfer").withArgs(
				addr1.address,
				addr2.address,
				1
				)
			expect(await nft.balanceOf(addr1.address)).to.equal(0)
			expect(await nft.balanceOf(addr2.address)).to.equal(1)
			expect(await nft.ownerOf(1)).to.equal(addr2.address)
		})

	})

	describe('handles approvals', () => {

		it('approves tokens for delegated transfer', async () => {
			await nft.connect(addr1)._mint(addr1.address)

			expect(await nft.connect(addr1).approve(addr2.address, 1)).to.emit(nft, "Approval").withArgs(
				addr1.address,
				addr2.address,
				1
				)

			expect(await nft.getApproved(1)).to.equal(addr2.address)

		})

		it('performs delegated transfers', async () => {
			await nft.connect(addr1)._mint(addr1.address)
			await nft.connect(addr1).approve(addr2.address, 1)

			await nft.connect(addr2).transferFrom(addr1.address, addr3.address, 1)

			expect(await nft.balanceOf(addr1.address)).to.equal(0)
			expect(await nft.balanceOf(addr3.address)).to.equal(1)
			expect(await nft.ownerOf(1)).to.equal(addr3.address)
			//expect(await nft.getApproved(1)).to.equal(0x0)

			// should fail
			//await nft.connect(addr2).transferFrom(addr3.address, addr2.address, 1)
		})

	})
})