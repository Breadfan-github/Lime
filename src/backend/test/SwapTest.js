const { expect } =  require("chai")

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num.toString())


describe('LIMESwap', ()=> {

    let WETH9
    let weth
	let LIMEToken
	let token 
	let LIMESwap
	let swap
	let provider = waffle.provider;

	before(async()=>{
	WETH9 = await ethers.getContractFactory('WETH9');
    weth = await WETH9.deploy();
	LIMEToken = await ethers.getContractFactory('LIMEToken');
    token = await LIMEToken.deploy(toWei(100000));
    LIMESwap = await ethers.getContractFactory('LIMESwap');
    swap = await LIMESwap.deploy(1000, token.address, weth.address);
    [deployer, addr1, addr2, addr3, ...addrs] = await ethers.getSigners()
    await token.connect(deployer).transfer(swap.address, toWei(50000))
    await weth.connect(addr1).deposit({value: toWei(100)})
	})

	it('initializes the contact with correct values', async() => {
		expect(swap.address).not.equal(0x0)
		expect(swap.address).not.equal(null)
		expect(swap.address).not.equal(undefined)
		expect(await token.balanceOf(swap.address)).to.equal(toWei(50000))
	})

	it('facilitates token buying & emits event', async() => {
		await(weth.connect(addr1).approve(swap.address, toWei(500)))
		expect(await swap.connect(addr1).buyTokens(toWei(500), {value: toWei(500)})).to.emit(swap, "Sell").withArgs(
				addr1.address,
				toWei(500),
				1000
				)

		let addr1AfterBalance = await token.balanceOf(addr1.address)
		let contractAfterBalance = await token.balanceOf(swap.address)
		let contractWethBalance = await weth.balanceOf(swap.address)

		expect(addr1AfterBalance).to.equal(toWei(500))
		expect(contractAfterBalance).to.equal(toWei(49500))
		expect(contractWethBalance).to.equal(toWei(0.5))
		
	})

	it('facilitates token selling & emits event', async() => {

		await token.connect(addr1).approve(swap.address, toWei(300))
		expect(await swap.connect(addr1).sellTokens(toWei(300))).to.emit(swap, "Purchase").withArgs(
				addr1.address,
				toWei(300),
				1000
				)
		let addr1AfterBalance = await token.balanceOf(addr1.address)
		let contractAfterBalance = await token.balanceOf(swap.address)
		let contractWethBalance = await weth.balanceOf(swap.address)

		expect(addr1AfterBalance).to.equal(toWei(200))
		expect(contractAfterBalance).to.equal(toWei(49800))
		expect(contractWethBalance).to.equal(toWei(0.2))
		
	})

 })