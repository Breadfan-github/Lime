import { useState, useEffect } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import ListingPopup from '../modal_popups/ListingPopup'

const MyOwned = ({nft, account, data, marketplace, toWei, LoadingWeb3, LoadingItems}) => {

  const [loading, setLoading] = useState(true)
  const [owned, setOwned] = useState([])
  const [openModal, setOpenModal] = useState(false);
  const [id, setId]= useState(0)
  let ownedNfts

  const loadOwnedItems = async () => {
    ownedNfts = []
 
    let accountBalance = await nft.balanceOf(account) 

      for(var i = 0; i < accountBalance.toNumber(); i++) {
       await Owned(i)                                        
    }
    setLoading(false) 
    setOwned(ownedNfts)  
     

 } 
    
   
 
  

  const Owned = async (i) => {

          let tokenId = await nft.tokenOfOwnerByIndex(account, i) 
          let tokenMetadataURI = await nft.tokenURI(tokenId)
          let tokenOwner = await nft.ownerOf(tokenId)
          const response = await fetch(tokenMetadataURI)
          const metadata = await response.json()
          let imageResult = metadata.image.slice(7);
          let imgLink = `https://icommunity.infura-ipfs.io/ipfs/${imageResult}`
          let ownedItem = {
            id: tokenId,
            name: metadata.name,
            image: imgLink,
            owner: tokenOwner
           
          }  
          ownedNfts.push(ownedItem) 


          }

  const open = async(id) => {
      setId(id)
      const item = await marketplace.items(id)
      let forSale = await item.forSale
      const approved = await nft.isApprovedForAll(account, marketplace.address)

      if (!approved) {
        window.alert("please approve nft first!")
      } else if (forSale) {
        window.alert("item already listed for sale!") 
      } else {
        setOpenModal(true)

      }  
  }

    

    
    useEffect(() => {   
    loadOwnedItems()   
  }, [data])


  
  return (
    <div> 
    {account ? 
    (loading ? (<LoadingItems/>) 
      : 
      (<div className="flex justify-center">
           {owned.length > 0 ?    
             (<div className="px-5 container">
               <Row xs={1} md={2} lg={4} className="g-4 py-5">
                 {owned.map((item, idx) => (
                   <Col key={idx} className="overflow-hidden">
                     <Card>
                       <Card.Img variant="top" src={item.image} />
                       <Card.Footer>{item.name}</Card.Footer>
                       <Card.Footer>Owned by: {item.owner.slice(0, 5) + '...' + item.owner.slice(38, 42)}</Card.Footer>
                       
                       <button name={item.id}
                              onClick={(event) => open(event.target.name)} variant="outline-light" size="small"> List! </button>
                       <ListingPopup  toWei={toWei} openModal={openModal} marketplace={marketplace} id = {id} onClose={() => setOpenModal(false)} />
                     </Card>
                   </Col>
                 ))}
               </Row>
             </div>)
             : (
               <main style={{ padding: "1rem 0" }}>
                 <h2>No owned NFTs</h2>
               </main>
             )}
         </div>))
    

       : (<LoadingWeb3/>)
    
     }
   </div>
   
    )
    
}


export default MyOwned
