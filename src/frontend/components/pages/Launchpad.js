import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap'



const Launchpad = ({ account, marketplace, nft, token, LoadingWeb3, data}) => {

	const [tokenCount, setTokenCount] = useState(0)
	const [tokenSupply, setTokenSupply] = useState(0)


	const mint = async () => {
		let balance = await token.allowance(account, marketplace.address)

		if(balance < 1) {
			window.alert("Please approve $LIME for use first!")
		} else {
			 await marketplace.marketplaceMint()
		} 
    } 

    const getTokenInfo = async () => {
    	let count = await nft.tokenCount()
    	let supply = await nft.tokenSupply()

      setTokenCount(count.toString())
    	setTokenSupply(supply.toString())
    }

    useEffect(()=> {
    	getTokenInfo()
    }, [data])

    
	return (
		<div>
		<div className="text-center">
	
    	<h6 className="text-secondary">Mint nft here to gain access to exclusive content!</h6>
    	<h6 className="text-secondary">Supply {tokenCount} / {tokenSupply} </h6>
    	</div>

    		<div className="text-center">
      {account ? 
      (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Button onClick={() => mint()} variant="secondary" size="lg">
          Mint 1 LIME nft for 10 $LIME
        </Button>
        </div>) 
      : 
      (<LoadingWeb3/>)
    } 
        
        </div>	
       
        </div>      
	)
}



export default Launchpad


