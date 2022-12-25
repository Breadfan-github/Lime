import { Spinner } from 'react-bootstrap'

const LoadingItems = () => {

    return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Loading Items...</p>
            </div>
            )

}

export default LoadingItems


