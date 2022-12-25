import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'
import logo from './assets/logo.png';

const Navigation = ({ marketplace, lime, swap, nft, token, web3Handler, account }) => {

    const addLIMEToMetamask = async () => {
      let tokenAddress = token.address;
      let tokenSymbol = "$LIME";
      let tokenDecimals = 18;
      let tokenImage = 'https://icommunity.infura-ipfs.io/ipfs/QmQ4cs7qbGFhLUQKYtehm9jLFCAx9G3ao5NYmygQpq6gAm';
      
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

    const approve = async () => { 
          let _totalSupply = await token.totalSupply()    
          await token.approve(marketplace.address, _totalSupply)
          await token.approve(lime.address, _totalSupply)
          await token.approve(swap.address, _totalSupply)
          await nft.setApprovalForAll(marketplace.address, true)
        } 


    return (
        <Navbar expand="lg" bg="secondary" variant="dark">
            <Container>
                <Navbar.Brand href="/">
                    <img src={logo} width="40" height="40" className="" alt="" />
                    &nbsp; LIME dApp
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto"> 
                       
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/Faucet">Faucet</Nav.Link>
                        <Nav.Link as={Link} to="/Swap">Swap</Nav.Link>
                        <Nav.Link as={Link} to="/Launchpad">Launchpad</Nav.Link>
                        <Nav.Link as={Link} to="/Marketplace">Marketplace</Nav.Link>
                        <Nav.Link as={Link} to="/MyOwned">My Owned</Nav.Link>
                        <Nav.Link as={Link} to="/UploadImage">Upload Content</Nav.Link>
                     
                    </Nav>
                    <Nav>
                        {account ? 
                        (<Nav.Link
                               
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-light">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>
                        <Button onClick={addLIMEToMetamask} variant="outline-light"> Add $LIME to Metamask </Button>
                        <Button onClick={approve} variant="outline-light"> Approve all (4)</Button>

                            </Nav.Link>) 
                        : 

                        (<Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>

                        )}
                        
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;
