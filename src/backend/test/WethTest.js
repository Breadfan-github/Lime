const { expect } =  require("chai")

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num.toString())





describe('WETH9', () => {
	let WETH9
	let weth

    beforeEach(async () => {
		WETH9 = await ethers.getContractFactory('WETH9');
	    weth = await WETH9.deploy();
	    [deployer, addr1, addr2, addr3, ...addrs] = await ethers.getSigners() 
	})

	describe('Deployment', () => {

			

		it('initializes the contract with the correct values', async () => {
			expect(await weth.name()).to.equal('Wrapped Ether')
			expect(await weth.symbol()).to.equal('WETH')
			expect(await weth.decimals()).to.equal(18)
			expect(await weth.totalSupply()).to.equal(0)

		})
	})

	describe('handles deposits & withdrawals', () => {

		it('handles deposits, store balances in mapping & sends back weth to user', async () => {
			expect(await weth.connect(addr1).deposit({value: toWei(10)})).to.emit(weth, "Deposit").withArgs(
            	addr1.address,
            	toWei(10)
            	)

			let addr1AfterBalance = await weth.balanceOf(addr1.address)
            expect(addr1AfterBalance).to.equal(toWei(10))
            expect(await weth.totalSupply()).to.equal(toWei(10))
       

		})
		it('handles withdrawals', async () => {
			await weth.connect(addr1).deposit({value: toWei(10)})	
			expect(await weth.connect(addr1).withdraw(toWei(10))).to.emit(weth, "Withdrawal").withArgs(
            	addr1.address,
            	toWei(10)
            	)
			// should fail
			// await weth.connect(addr1).withdraw(toWei(1))
		})

	})

	describe('handles transfers', () => {

		it('handles transfers & emits Transfer events', async () => {
			await weth.connect(addr1).deposit({value: toWei(10)})
			expect(await weth.connect(addr1).transfer(addr2.address, toWei(5))).to.emit(weth, "Transfer").withArgs(
            	addr1.address,
            	addr2.address,
            	toWei(5)
            	)

			let addr1AfterBalance = await weth.balanceOf(addr1.address)
            expect(addr1AfterBalance).to.equal(toWei(5))

            let addr2AfterBalance = await weth.balanceOf(addr2.address)
            expect(addr2AfterBalance).to.equal(toWei(5))

		})

		it('handles approvals & performs delegated transfers', async () => {
			await weth.connect(addr1).deposit({value: toWei(5)})

			expect(await weth.connect(addr1).approve(addr2.address, toWei(3))).to.emit(weth, "Approval").withArgs(
				addr1.address,
				addr2.address,
				toWei(3)
				)

			expect(await weth.allowance(addr1.address, addr2.address)).to.equal(toWei(3))
			
			await weth.connect(addr2).transferFrom(addr1.address, addr3.address, toWei(2))

			let addr1AfterBalance = await weth.balanceOf(addr1.address)
			expect(addr1AfterBalance).to.equal(toWei(3))

			let addr3AfterBalance = await weth.balanceOf(addr3.address)
			expect(addr3AfterBalance).to.equal(toWei(2))

			expect(await weth.allowance(addr1.address, addr2.address)).to.equal(toWei(1))

			// should fail
			// await weth.connect(addr2).transferFrom(addr1.address, addr2.address, toWei(3))		
			
		})

	})

})