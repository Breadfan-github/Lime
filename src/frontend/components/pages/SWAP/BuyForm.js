import { useState } from 'react'
import tokenLogo from '../../assets/logo.png'
import wethLogo from '../../assets/weth-logo.png'


const BuyForm = ({ wethBalance, tokenBalance, purchaseTokens, toWei, fromWei }) => {

  const [output, setOutput] = useState(0)
  const [input, setInput] = useState(0)

  let tokenAmount




  return (
    <form className="mb-3" onSubmit={(event) => {
            event.preventDefault()
            tokenAmount = toWei(output)
            purchaseTokens(tokenAmount)
          
          }}>
          
            <div>
              <label className="float-left"><b>Input</b></label>
              <span className="float-right text-muted">
              Balance: {fromWei(wethBalance)}
              </span>
            </div>
            <div className="input-group mb-4">

              <input
                type="text"
                onChange={(event) => {
                  
                  tokenAmount = input.value.toString() * 1000
                  setOutput(tokenAmount)

                }}
              
                ref={(input) => {setInput(input)}}
                className="form-control form-control-lg"
                placeholder="0"
                required />

              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={wethLogo} height='32' alt=""/>
                  &nbsp;&nbsp;&nbsp; WETH
                </div>
              </div>
            </div>
            <div>
              <label className="float-left"><b>Output</b></label>
              <span className="float-right text-muted">
                
                Balance: {fromWei(tokenBalance)}
                  
              </span>
            </div>
            <div className="input-group mb-2">

              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="0"
                value= {output}
                disabled
              />

              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={tokenLogo} height='32' alt=""/>
                  &nbsp; $LIME
                </div>
              </div>
            </div>
            <div className="mb-5">
              <span className="float-left text-muted">Exchange Rate: </span>
              <span className="float-right text-muted">1 ETH = 1000 $LIME</span>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
          </form>

     
)
        
  }
  



export default BuyForm