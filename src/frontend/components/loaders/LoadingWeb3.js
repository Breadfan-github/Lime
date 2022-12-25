import { Spinner } from 'react-bootstrap'

const LoadingWeb3 = () => {

    return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Awaiting Connection to Web3...</p>
            </div>
            )

}

export default LoadingWeb3


