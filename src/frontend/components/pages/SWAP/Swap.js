import { useState , useEffect} from 'react';

import Main from './Main.js'

const Swap = ({swap, account, token, data, weth, toWei, fromWei, LoadingWeb3 }) => {
	 const [tokenBalance, setTokenBalance] = useState(0)
	 const [wethBalance, setWethBalance] = useState(0)
	


	 const getWethBalance = async () => {
	 	let wethBal = await weth.balanceOf(account)
	 	setWethBalance(wethBal.toString())
	 }

	 const getTokenBalance = async () => {
	 	let tokenBal = await token.balanceOf(account)
	 	setTokenBalance(tokenBal.toString())
	 }

	
	 useEffect(()=> {
	 	getTokenBalance()}, [data]
	 )

	 useEffect(()=> {
	 	getWethBalance()}, [data]
	 )


    const purchaseTokens = async (amount) => {      
      await weth.approve(swap.address, amount)
      await swap.buyTokens(amount)                                      
      }
   

   const sellTokens = async (amount) => {
			 await swap.sellTokens(amount)
		}

	   

    

	return (
		<div>
			
		{account ? (<div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">

				 <Main 
			      tokenBalance = {tokenBalance} 
			      wethBalance = {wethBalance}
			      purchaseTokens = {purchaseTokens}
			      sellTokens = {sellTokens} 
			      weth = {weth}
			      toWei = {toWei}
			      fromWei ={fromWei}
			      />
			      

              </div>
            </main>
          </div>
        </div>) : (<LoadingWeb3/>)}
        </div>


		 
	
	)

	}



export default Swap


