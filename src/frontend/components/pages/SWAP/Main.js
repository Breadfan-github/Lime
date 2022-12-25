import { useState } from 'react';
import BuyForm from './BuyForm'
import SellForm from './SellForm'
import WrapPopup from '../../modal_popups/WrapPopup'

const Main = ({weth, wethBalance, tokenBalance, purchaseTokens, sellTokens, toWei, fromWei}) => {

  const [form, setForm] = useState('buy')
  const [openWrap, setOpenWrap] = useState(false);
 

     let content
    if(form === 'buy') {
      content = <BuyForm
          wethBalance = {wethBalance} 
          tokenBalance = {tokenBalance}
          purchaseTokens = {purchaseTokens} 
          toWei = {toWei}
          fromWei ={fromWei}/>
    } else {
      content = <SellForm
          wethBalance = {wethBalance} 
          tokenBalance = {tokenBalance}
          sellTokens = {sellTokens}
          toWei = {toWei}
          fromWei ={fromWei}/>
    }



  return (


    <div id="content" className = "mt-3">
    <div className="d-flex justify-content-between mb-3">
          <button
              className="btn btn-light"
              onClick ={(event) => {
                setForm('buy')
              }}>
            Buy
          </button>
          <span className="text-muted">&lt; &nbsp; &gt;</span>
          <button 
          className ="btn btn-light"
          onClick ={(event) => {
                setForm('sell')
              }}>              
            Sell
          </button>
        </div>

        <div className="card mb-4" > <div className="card-body">

          {content}
          <div>
          <button onClick = {() => {setOpenWrap(true)}} variant="outline-light" size="small"> Wrap / Unwrap ETH! </button>
          <WrapPopup toWei = {toWei} openWrap = {openWrap} weth = {weth}  onClose={() => setOpenWrap (false)}/>
          </div>

          </div>

        </div>

      </div>

     
          

       
     
)
        
  }
  



export default Main