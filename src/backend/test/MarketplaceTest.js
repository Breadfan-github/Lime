const {expect} = require("chai");

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num.toString())

describe ("LIME Marketplace", () => {

 let nft
 let LIMEnft
 let LIMEToken
 let token
 let marketplace
 let LIMEMarketplace
 let deployer
 let addr1
 let addr2
 let addrs
 let feePercent = 2
 let royaltyPercent = 10
 let priceToMint = toWei(10)


  beforeEach(async() => {
    [deployer, addr1, addr2, addr3, ...addrs] = await ethers.getSigners()   
    LIMEToken = await ethers.getContractFactory('LIMEToken')
    token = await LIMEToken.deploy(toWei(100000))
    _totalSupply = await token.totalSupply()
    LIMEnft = await ethers.getContractFactory('LIMEnft')
    nft = await LIMEnft.deploy()     
    LIMEMarketplace = await ethers.getContractFactory('LIMEMarketplace')
    marketplace = await LIMEMarketplace.deploy(feePercent, royaltyPercent, addr3.address, nft.address, token.address, priceToMint)
    token.connect(deployer).transfer(addr1.address, toWei(100))
    token.connect(deployer).transfer(addr2.address, toWei(100))
    token.connect(addr1).approve(marketplace.address, _totalSupply)
    token.connect(addr2).approve(marketplace.address, _totalSupply)


    })



  describe ("deployment", () => {

    it("should track info of nft collection", async () =>{
      expect(await nft.name()).to.equal("LIMEnft")
      expect(await nft.symbol()).to.equal("LIME")
    })

    it("should track feeAccount & feePercent of the Marketplace", async () => {
      expect(await marketplace.feeAccount()).to.equal(marketplace.address)
      expect(await marketplace.royaltyAccount()).to.equal(addr3.address)
      expect(await marketplace.feePercent()).to.equal(2)
      expect(await marketplace.royaltyPercent()).to.equal(10)
    })

    it('should track info of token', async () => {
      expect(await token.name()).to.equal('LIMEToken')
      expect(await token.symbol()).to.equal('$LIME')
      expect(await token.decimals()).to.equal(18)
      expect(await token.totalSupply()).to.equal(toWei(100000))
})



  })


  describe("minting nfts", () => {

    it("should track each minted NFT", async () => {

      await marketplace.connect(addr1).marketplaceMint({value: priceToMint})
      let uri1 = await nft.tokenURI(1)
      console.log(uri1)
      expect(await nft.tokenCount()).to.equal(1)
      expect(await nft.balanceOf(addr1.address)).to.equal(1)
      expect(await nft.tokenURI(1)).to.equal("https://gateway.pinata.cloud/ipfs/QmcF6phv67pvGKxcNKhzbRe3DzG2Ddff3qFvmHsUUTzxhu/1.json")


      await marketplace.connect(addr2).marketplaceMint({value: priceToMint})
      let uri2 = await nft.tokenURI(2)
      console.log(uri2)
      expect(await nft.tokenCount()).to.equal(2)
      expect(await nft.balanceOf(addr2.address)).to.equal(1)
      expect(await nft.tokenURI(2)).to.equal("https://gateway.pinata.cloud/ipfs/QmcF6phv67pvGKxcNKhzbRe3DzG2Ddff3qFvmHsUUTzxhu/2.json")
      //change token count in nft contract to 99 to try minting over supply fail.

    })
  })

  

  describe("making marketplace items", () => {

    it("Item Made functions + event , listing functions + events", async () => {
      expect(await marketplace.connect(addr1).marketplaceMint({value: priceToMint}))
      .to.emit(marketplace, "ItemMade")
      .withArgs(
        1, 1, 0, addr1.address, nft.address, false)

      expect(await nft.ownerOf(1)).to.equal(addr1.address)
      expect(await marketplace.itemCount()).to.equal(1)
      let item1 = await marketplace.items(1)
      expect(await item1.id).to.equal(1)
      expect(await item1.tokenId).to.equal(1)
      expect(await item1.price).to.equal(0)
      expect(await item1.owner).to.equal(addr1.address)
      expect(await item1.nft).to.equal(nft.address)
      expect(await item1.forSale).to.equal(false)

      expect(await marketplace.connect(addr2).marketplaceMint({value: priceToMint}))
      .to.emit(marketplace, "ItemMade")
      .withArgs(
        2, 2, 0, addr2.address, nft.address, false)
      expect(await nft.ownerOf(2)).to.equal(addr2.address)
      expect(await marketplace.itemCount()).to.equal(2)
      let item2 = await marketplace.items(2)
      expect(await item2.id).to.equal(2)
      expect(await item2.tokenId).to.equal(2)
      expect(await item2.price).to.equal(0)
      expect(await item2.owner).to.equal(addr2.address)
      expect(await item2.nft).to.equal(nft.address)
      expect(await item2.forSale).to.equal(false)


      await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
      expect(await marketplace.connect(addr1).listItem(1, toWei(15)))
      .to.emit(marketplace, "ItemListed")
      .withArgs(
        1, 1, 15, addr1.address, nft.address, true)

      item1 = await marketplace.items(1)

      expect(await nft.ownerOf(1)).to.equal(addr1.address)
      expect(await item1.id).to.equal(1)
      expect(await item1.tokenId).to.equal(1)
      expect(await item1.price).to.equal(toWei(15))
      expect(await item1.owner).to.equal(addr1.address)
      expect(await item1.nft).to.equal(nft.address)
      expect(await item1.forSale).to.equal(true)

      await nft.connect(addr2).setApprovalForAll(marketplace.address, true)
      expect(await marketplace.connect(addr2).listItem(2, toWei(20)))
      .to.emit(marketplace, "ItemListed")
      .withArgs(
        2, 2, 20, addr1.address, nft.address, true)

      item2 = await marketplace.items(2)

      expect(await nft.ownerOf(2)).to.equal(addr2.address)
      expect(await item2.id).to.equal(2)
      expect(await item2.tokenId).to.equal(2)
      expect(await item2.price).to.equal(toWei(20))
      expect(await item2.owner).to.equal(addr2.address)
      expect(await item2.nft).to.equal(nft.address)
      expect(await item2.forSale).to.equal(true)

      //should fail
      //await marketplace.connect(addr2).listItem(2, toWei(20))
      //await marketplace.connect(addr1).listItem(2, toWei(20))
      })   
    })


    describe("purchasing marketplace items", () => {

      it("should update item, pay seller, fees, royalties, transfer nft to buyer, emit bought event", async () => {
      
        await marketplace.connect(addr1).marketplaceMint({value: priceToMint})

        //to try enumerable extension
        await marketplace.connect(addr2).marketplaceMint({value: priceToMint})
        await marketplace.connect(addr1).marketplaceMint({value: priceToMint})
        await marketplace.connect(addr1).marketplaceMint({value: priceToMint})
        await marketplace.connect(addr2).marketplaceMint({value: priceToMint})

        await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
        await marketplace.connect(addr1).listItem(1, toWei(15))
      
        const sellerInitalBal = await token.balanceOf(addr1.address)
        const buyerInitialBal = await token.balanceOf(addr2.address)
        const feeAccountInitialBal = await token.balanceOf(marketplace.address)
        const royaltyAccountInitialBal = await token.balanceOf(addr3.address)

        let item1 = await marketplace.items(1)
        expect(await marketplace.connect(addr2).purchaseItem(1, {value: item1.price}))
        .to.emit(marketplace, "ItemBought").withArgs(
          1, 
          1, 
          toWei(15), 
          addr1.address,
          addr2.address, 
          nft.address, 
          false);

        const sellerFinalBal = await token.balanceOf(addr1.address)
        const buyerFinalBal = await token.balanceOf(addr2.address)
        const feeAccountFinalBal = await token.balanceOf(marketplace.address)
        const royaltyAccountFinalBal = await token.balanceOf(addr3.address)
        const fee = (item1.price * 2)/100
        const royalty = (item1.price * 10)/100

        expect(+fromWei(sellerFinalBal)).to.equal(+fromWei(sellerInitalBal) + +fromWei(item1.price) - +fromWei(fee) - +fromWei(royalty))
        expect(+fromWei(buyerFinalBal)).to.equal(+fromWei(buyerInitialBal) - +fromWei(item1.price))
        expect(+fromWei(feeAccountFinalBal)).to.equal(+fromWei(feeAccountInitialBal) + +fromWei(fee))
        expect(+fromWei(royaltyAccountFinalBal)).to.equal(+fromWei(royaltyAccountInitialBal) + +fromWei(royalty))

        item1 = await marketplace.items(1)
        expect(await nft.ownerOf(1)).to.equal(addr2.address)
        expect(await item1.id).to.equal(1)
        expect(await item1.tokenId).to.equal(1)
        expect(await item1.price).to.equal(0)
        expect(await item1.owner).to.equal(addr2.address)
        expect(await item1.nft).to.equal(nft.address)
        expect(await item1.forSale).to.equal(false)




        let addr2nfts = []
        let addr2Balance = await nft.balanceOf(addr2.address)

        for(var i = 0; i < addr2Balance.toNumber(); i++) {
            let returned = await nft.tokenOfOwnerByIndex(addr2.address, i) 
            addr2nfts.push(returned.toNumber())    
          }  
          console.log(addr2nfts)         

        //should fail
        //await marketplace.connect(addr2).purchaseItem(1, {value: item1.price})
     })
    })

    describe("withdraw", () => {

      it('only allows owner to withdraw tokens from contract', async() => {
    //should fail
    //await marketplace.connect(addr1).withdraw()
    await marketplace.connect(addr1).marketplaceMint({value: priceToMint})

    let contractBeforeBalance = await token.balanceOf(marketplace.address)
    let deployerBeforeBalance = await token.balanceOf(deployer.address)

    await marketplace.connect(deployer).withdraw()

    let contractAfterBalance = await token.balanceOf(marketplace.address)
    let deployerAfterBalance = await token.balanceOf(deployer.address)
    
    expect(contractAfterBalance).to.equal(0)
    expect(+deployerAfterBalance).to.equal(+deployerBeforeBalance + +priceToMint)
    })

    })
  })





