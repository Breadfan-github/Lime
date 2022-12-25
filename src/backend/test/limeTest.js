const { expect } =  require("chai")

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num.toString())

describe('LIME Main', () => {
	 let LIMEToken
     let token
     let LIME
     let lime
     let imgHash = "sample img hash"
     let desc = "sample description"

	beforeEach(async()=>{
		  [deployer, addr1, addr2, addr3, ...addrs] = await ethers.getSigners()
		  LIMEToken = await ethers.getContractFactory('LIMEToken')
		  token = await LIMEToken.deploy(toWei(100000))
	    _totalSupply = await token.totalSupply()
	    LIME = await ethers.getContractFactory('LIME');
	    lime = await LIME.deploy(token.address, addr1.address);
	    token.connect(deployer).transfer(addr2.address, toWei(100))
	    token.connect(deployer).transfer(addr3.address, toWei(100))
	    token.connect(addr2).approve(lime.address, _totalSupply)
	    token.connect(addr3).approve(lime.address, _totalSupply)
	})

	describe("deployment", () => {
		it('initializes contract with correct values', async ()=> {
			expect(await lime.name()).to.equal("LIME main contract")
			expect(await lime.imageCount()).to.equal(0)
			expect(await lime.Creator()).to.equal(addr1.address)
		})
	})

	describe("bidding system", () => {

		it('accepts bids from users & stores values in struct mapping', async () => {			
			expect(await lime.connect(addr2).bidForMessage(toWei(20))).to.emit(lime, "UserBidForMessage").withArgs(
				addr2.address, toWei(20), true, false)

			let user1 = await lime.users(addr2.address)

			expect(await user1.bidded).to.equal(true)
			expect(await user1.bidAmount).to.equal(toWei(20))
			expect(await user1.accepted).to.equal(false)

			expect(await lime.connect(addr3).bidForMessage(toWei(15))).to.emit(lime, "UserBidForMessage").withArgs(
				addr3.address, toWei(15), true, false)

			let user2 = await lime.users(addr3.address)

			expect(await user2.bidded).to.equal(true)
			expect(await user2.bidAmount).to.equal(toWei(15))
			expect(await user2.accepted).to.equal(false)
		})

		it('lets Creator accept bids and gets bid amount transfered to Creator', async() => {

			let creatorInitialBalance = await token.balanceOf(addr1.address)
			let bidderInitialBalance = await token.balanceOf(addr2.address)

			await lime.connect(addr2).bidForMessage(toWei(20))
			//should fail
			//await lime.connect(addr2).bidForMessage(toWei(20))
			//await lime.connect(addr1).acceptBid(addr2.address)
			//await lime.connect(addr2).acceptBid(addr2.address)
			//await token.connect(addr2).transfer(addr3.address, toWei(100))
			//await lime.connect(addr1).acceptBid(addr2.address)
			//await lime.connect(addr1).acceptBid(addr3.address)

			expect(await lime.connect(addr1).acceptBid(addr2.address)).to.emit(lime, "AcceptedBidForMessage").withArgs(
				addr2.address, toWei(20), true)

			let creatorAfterBalance = await token.balanceOf(addr1.address)
			let bidderAfterBalance = await token.balanceOf(addr2.address)

			expect(+fromWei(bidderAfterBalance)).to.equal(+fromWei(bidderInitialBalance) - 20)
			expect(+fromWei(creatorAfterBalance)).to.equal(+fromWei(creatorInitialBalance) + 20)

			let user1 = await lime.users(addr2.address)

			expect(await user1.bidded).to.equal(true)
			expect(await user1.bidAmount).to.equal(toWei(20))
			expect(await user1.accepted).to.equal(true)
		})

		

	})
  describe("uploading + tipping images", () => {

  	it("facilitates uploading images and storing it in the blockchain", async() => {

  		expect(await lime.connect(addr1).uploadImage(imgHash, desc)).to.emit(lime,"ImageCreated").withArgs(
    1,
    0,
    imgHash,
    desc,
    addr1.address
    )
  		let img1 = await lime.images(1)
  
  		expect(await img1.id).to.equal(1)
  		expect(await img1.tipAmount).to.equal(0)
  		expect(await img1.hash).to.equal(imgHash)
  		expect(await img1.description).to.equal(desc)
  		expect(await img1.creator).to.equal(addr1.address)

  		await lime.connect(addr1).uploadImage(imgHash, desc)

  		let img2 = await lime.images(2)
  
  		expect(await img2.id).to.equal(2)
  		expect(await img2.tipAmount).to.equal(0)
  		expect(await img2.hash).to.equal(imgHash)
  		expect(await img2.description).to.equal(desc)
  		expect(await img2.creator).to.equal(addr1.address)

  	})

  	it("facilitates tipping of images, stores info and transfer tips to Creator", async () => {
  		await lime.connect(addr1).uploadImage(imgHash, desc)
  		await lime.connect(addr1).uploadImage(imgHash, desc)

  	let creatorInitialBalance = await token.balanceOf(addr1.address)
		let tipperInitialBalance = await token.balanceOf(addr2.address)

  		
  	expect(await lime.connect(addr2).tipImage(1, toWei(25))).to.emit(lime, "ImageTipped").withArgs(
    1,
    toWei(25),
    imgHash,
    desc,
    addr2.address,
    addr1.address
    )



  	let creatorAfterBalance = await token.balanceOf(addr1.address)
		let tipperAfterBalance = await token.balanceOf(addr2.address)

		expect(+fromWei(tipperAfterBalance)).to.equal(+fromWei(tipperInitialBalance) - 25)
		expect(+fromWei(creatorAfterBalance)).to.equal(+fromWei(creatorInitialBalance) + 25)



    creatorInitialBalance = await token.balanceOf(addr1.address)
		tipperInitialBalance = await token.balanceOf(addr3.address)

		expect(await lime.connect(addr3).tipImage(2, toWei(15))).to.emit(lime, "ImageTipped").withArgs(
    2,
    toWei(15),
    imgHash,
    desc,
    addr3.address,
    addr1.address
    )

  	creatorAfterBalance = await token.balanceOf(addr1.address)
		tipperAfterBalance = await token.balanceOf(addr3.address)

		expect(+fromWei(tipperAfterBalance)).to.equal(+fromWei(tipperInitialBalance) - 15)
		expect(+fromWei(creatorAfterBalance)).to.equal(+fromWei(creatorInitialBalance) + 15)

		let img1 = await lime.images(1)
  	let img2 = await lime.images(2)

  		expect(await img1.id).to.equal(1)
  		expect(await img1.tipAmount).to.equal(toWei(25))
  		expect(await img1.hash).to.equal(imgHash)
  		expect(await img1.description).to.equal(desc)
  		expect(await img1.creator).to.equal(addr1.address)

  		expect(await img2.id).to.equal(2)
  		expect(await img2.tipAmount).to.equal(toWei(15))
  		expect(await img2.hash).to.equal(imgHash)
  		expect(await img2.description).to.equal(desc)
  		expect(await img2.creator).to.equal(addr1.address)

  		//should fail
  		//await lime.connect(addr3).tipImage(2, {value: toWei(0)})
  		//await lime.connect(addr1).tipImage(1, {value: toWei(15)})
  		//wait lime.connect(addr3).tipImage(10, {value: toWei(15)})
  	})

  }) 

})