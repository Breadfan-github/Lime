import { useState, useEffect } from 'react';
import TippingPopup from '../modal_popups/TippingPopup'

const Home = ({ lime, nft, data, token, account, toWei, fromWei, LoadingWeb3}) => {

	const [images, setImages] = useState([])
  const [openModal, setOpenModal] = useState(false);
  const [id, setId]= useState(0)
  let limeImages = []


  const open = (id) => {
    setId(id)
    setOpenModal(true)
    
  }


  const loadImages = async () => {
    let imagesCount = await lime.imageCount()
//@dev errors if var starts at 0, fetches img(0) which returns empty metadata
  	for (var i = 1; i <= imagesCount; i++) {
        let img = await lime.images(i)
        limeImages.push(img)
        
      }
      setImages(limeImages)
           
  }

  useEffect(()=> {
  	checkBal()}, [data]
  )

  const checkBal = async () => {

    let balance = await nft.balanceOf(account)
      if (balance > 0) {
        loadImages() 
      } else {
        window.alert("Purchase NFT from Marketplace / Launchpad to access exclusive content!")
      } 

  }
    
    return( 
      <div>

      {account ? ( 
            <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
            
              {images.map((img, idx) => (
                  
      <div className="card mb-4" key={idx} >
          <div className="card-header">     
          <small className="text-muted">{img.creator}</small>
        </div>
        
       <ul id="imageList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p class="text-center"><img src={`https://icommunity.infura-ipfs.io/ipfs/${img.hash}`} style={{ maxWidth: '420px'}}/></p>
            <p>{img.description}</p>
          </li>
          <li key={idx} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
              TIPS: {fromWei((img.tipAmount).toString())} $LIME
            </small>
          
                          
            <button
              className="btn btn-link btn-sm float-right pt-0"
              name={img.id}
              onClick={(event) => {open(event.target.name)}}>
               TIP CREATOR
            </button>
            <TippingPopup toWei={toWei} open={openModal} lime = {lime} id = {id} onClose={() => setOpenModal(false)} />
          </li>
        </ul>
        
      </div>

       ))}
              
            
          
      

    </div>
    
    </main>
    </div>
    </div>)
     :
      (<LoadingWeb3/>)
    } 
</div>
    )

             
}



export default Home
