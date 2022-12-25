import { useState } from 'react';
import './modal.css'


const TippingPopup = ({ open, onClose, lime, id, toWei}) => {
  
	const [tipAmount, setTipAmount] = useState(0)
	const [input, setInput] = useState(0)


	const tipImage = async (id) => {   
        await lime.tipImage(id, tipAmount)
        onClose()
      }
    

  if (!open) return null;
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
            <p>Tip Amount</p>
            <div className="form-group mr-sm-2">
                    <br></br>

                    <input
                type="text"
                onChange={(event) => {
                  
                  let Amount = input.value
                  setTipAmount(toWei(Amount))}}


                ref={(input) => {setInput(input)}}
                className="form-control"
                        placeholder="input tip amount here ($LIME)"
                        required />

                         <button onClick={() => tipImage(id)} variant="outline-light" size="small"> Tip! </button>
                  </div>

          </div>
         
        </div>
      </div>
    </div>
  );
};

export default TippingPopup;
