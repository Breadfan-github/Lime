import { useState } from 'react';
import './modal.css'


const ListingPopup = ({ openModal, onClose, marketplace, id, toWei}) => {
  
	const [price, setPrice] = useState(0)
	const [input, setInput] = useState(0)


	const listItem = async (id) => {
        await marketplace.listItem(id, price)
        onClose()
      }
 


  if (!openModal) return null;
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
            <p>Listing Price:</p>
            <div className="form-group mr-sm-2">
                    <br></br>

                    <input
                type="text"
                onChange={(event) => {
                  
                  let Price = input.value
                  setPrice(toWei(Price))}}


                ref={(input) => {setInput(input)}}
                className="form-control"
                        placeholder="input listing price here ($LIME)"
                        required />


                         <button onClick={() => listItem(id)} variant="outline-light" size="small"> List! </button>
                  </div>

          </div>
         
        </div>
      </div>
    </div>
  );
};

export default ListingPopup;
