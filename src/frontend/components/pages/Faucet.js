import { useState } from 'react';
import { Button } from 'react-bootstrap'

const Faucet = ({ faucet, account, LoadingWeb3}) => {
  const[loading, setLoading] = useState(false)

	const claimFaucet = async () => {  
      setLoading(true)  
      await (await faucet.claimFaucet()).wait()   
      setLoading(false)
    } 

    
	return (
		<div>
		<div className="text-center">
		
    	<h5 className="text-secondary">Each wallet can only claim from faucet once.</h5>
    	</div>

    		<div className="text-center">
      {account ? ( 
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Button onClick={() => claimFaucet()} variant="secondary" size="lg">
          Claim Faucet
        </Button>
        </div>
        
        ) : (

        <LoadingWeb3/>


        )} 
        <h6 className="text-secondary">Try resetting your Metamask account if claim fails</h6>              
        </div>	

        </div>
       
	)}


export default Faucet
