import { useState } from 'react';
import './modal.css'


const WrapPopup = ({ openWrap, onClose, weth, toWei}) => {

  const[wrapAmount, setWrapAmount] = useState(0)
  const[unwrapAmount, setUnwrapAmount] = useState(0)
  const[Wrapinput, setWrapInput] = useState(0)
  const[Unwrapinput, setUnwrapInput] = useState(0)

    const unwrapEth = async (amount) => {
      await weth.withdraw(amount)
      onClose()
    }

	const wrapEth = async (amount) => {
      await weth.deposit({value: amount})
      onClose()
    }

    const addWETHToMetamask = async () => {
      let tokenAddress = weth.address;
      let tokenSymbol = "WETH";
      let tokenDecimals = 18;
      let tokenImage = 'https://icommunity.infura-ipfs.io/ipfs/QmbkT8cDkTVU7XNBebEY74cKdyiMnV7VPLUmi5iraLFCBN';
      
      try {
        const wasAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20', // Initially only supports ERC20, but eventually more!
      options: {
        address: tokenAddress, // The address that the token is at.
        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
        decimals: tokenDecimals, // The number of decimals in the token
        image: tokenImage, // A string url of the token logo
              },
            },
          });

          if (wasAdded) {
            console.log('Thanks for your interest!');
          } else {
            console.log('Your loss!');
          }
        } catch (error) {
            console.log(error);
        }
    }
    

  if (!openWrap) return null;
  return (
    <div onClick={onClose} className='overlay'>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
        <div className='modalRight'>
          <p className='closeBtn' onClick={onClose}>
            X
          </p>
          <div className='modalcontent'>
            <p>Wrap Amount</p>
            <p>ETH => WETH</p>
            <div className="form-group mr-sm-2">
                    

                    <input
                type="text"
                onChange={(event) => {
                  
                  let Amount = Wrapinput.value
                  setWrapAmount(toWei(Amount))}}

                ref={(input) => {setWrapInput(input)}}
                className="form-control"
                        placeholder="Input ETH amount to wrap..."
                        required />

                         <button onClick={() => wrapEth(wrapAmount)} variant="outline-light" size="small"> Wrap! </button>


                  </div>
                  <br></br>
                  <br></br>
                  <br></br>

                  <p>Unwrap Amount</p>
            <p>WETH => ETH</p>
            <div className="form-group mr-sm-2">
                    
                    <input
                type="text"
                onChange={(event) => {
                  
                  let Amount = Unwrapinput.value
                  setUnwrapAmount(toWei(Amount))}}

                ref={(input) => {setUnwrapInput(input)}}
                className="form-control"
                        placeholder="Input WETH amount to unwrap..."
                        required />

                         <button onClick={() => unwrapEth(unwrapAmount)} variant="outline-light" size="small"> Unwrap! </button>

                         
                  </div>
          </div>
          <button onClick={addWETHToMetamask} variant="outline-light" size="small"> Add WETH to Metamask </button>
         
        </div>
      </div>
    </div>
  );
};

export default WrapPopup;
