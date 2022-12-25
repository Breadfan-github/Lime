import { useState } from 'react';
import { create } from "ipfs-http-client"

const { Buffer } = require('buffer')
const projectId = '2EwXF5EKhKVGyiZPC7UkOQxi8e3';
const projectSecret = 'abba390662d3e7ddb36045310fd0aac0';
const auth =
'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({ 
  host: 'ipfs.infura.io',  
  port: 5001, 
  protocol: 'https',
  headers: { authorization: auth, },

});



const UploadImage = ({lime, account, LoadingWeb3}) => {

  const[loading, setLoading] = useState(false)
  const[buffer, setBuffer] = useState(null)
  const[imageDescription, setImageDescription] = useState('sample desc')
 

const captureFile = (event) => {
    
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {   	
    	setBuffer(Buffer(reader.result))
    }
  }

  const uploadimage = async (description) => {

    const result = await client.add(buffer)
    let hash = result.path

      setLoading(true)
      await lime.uploadImage(hash, description)
      setLoading(false)

      }

	
		 return (
      <div>
      {account ? 
      (<div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <h2>Share Image</h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                const desc = imageDescription.value
                uploadimage(desc)
              }} >
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={(event) => captureFile(event)} />
                  <div className="form-group mr-sm-2">
                    <br></br>
                      <input
                        id="imageDescription"
                        type="text"
                        ref={(input) => {setImageDescription(input)}}
                        className="form-control"
                        placeholder="Image description..."
                        required />
                  </div>
                <button type="submit" class="btn btn-primary btn-block btn-lg">Upload!</button>
              </form>
              <p>&nbsp;</p>
              
            </div>
          </main>
        </div>
      </div>) 

      : 

      (<LoadingWeb3/>)
    }
      </div>
      
    );
	}



export default UploadImage