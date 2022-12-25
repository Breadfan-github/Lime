import { useState, useEffect } from 'react'
import { Row, Col, Card } from 'react-bootstrap'

const Marketplace = ({toWei, fromWei, marketplace, nft, token, data, account, LoadingWeb3, LoadingItems}) => {

	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)

	let marketplaceItems

  const loadMarketplaceItems = async() => {
    marketplaceItems = []
 
    let itemcount = await marketplace.itemCount()
   
    for(var i = 1; i <= itemcount.toNumber() ; i++) {
       await ITEM(i)                                              
    }
       setItems(marketplaceItems)   
       setLoading(false)             
  }

  const ITEM = async (i) => {

          const item = await marketplace.items(i)
          let tokenId = await item.tokenId
          let tokenOwner = await nft.ownerOf(tokenId)
          let tokenMetadataURI = await nft.tokenURI(tokenId.toNumber())
          const response = await fetch(tokenMetadataURI)
          const metadata = await response.json()
          let imageResult = metadata.image.slice(7);
          let imgLink = `https://icommunity.infura-ipfs.io/ipfs/${imageResult}`
          let itemPrice = await item.price
          let isForSale = await item.forSale

          
          let marketplaceItem = {

            id: tokenId,
            owner: tokenOwner,
            name: metadata.name,
            image: imgLink,
            price: itemPrice,
            forSale: isForSale
          }  
          marketplaceItems.push(marketplaceItem)                 
          }

  const buyItem = async(id) => {
    let balance = await token.allowance(account, marketplace.address)


    if(balance < 1) {
      window.alert("Please approve $LIME for use first!")
    } else {
       await marketplace.purchaseItem(id)
    } 
    
  }

  

  useEffect(() => {
        loadMarketplaceItems()  
  }, [data])



	return (
    <div>
    {account ? 

    (loading ? 
    (<LoadingItems/>) 
    :

    (<div className="flex justify-center">
      {items.length > 0 ?
      
        (<div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {items.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>{item.name}</Card.Footer>
                  <Card.Footer>Owned by: { item.owner.slice(0, 5) + '...' + item.owner.slice(38, 42)}</Card.Footer>
                  <button name={item.id} 
                  onClick={(event) => buyItem(event.target.name)} 
                  variant="outline-light" size="small"> 
                  {item.forSale ? (`Price: ${fromWei(item.price)} $LIME`) 
                  : 
                  ('Not for Sale')} 
                  </button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>)

        : 

        (<main style={{ padding: "1rem 0" }}>
            <h2>No items in marketplace yet.</h2>
          </main>
        )}
    </div>)) 

    :

    (<LoadingWeb3/>)
  }

    
    </div>
    )

}


export default Marketplace