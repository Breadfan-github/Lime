import { ethers } from 'ethers'; 
import { useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import {toWei, fromWei} from './utils/WeiConverter'
import LoadingWeb3 from './loaders/LoadingWeb3'
import LoadingItems from './loaders/LoadingItems'

import LIMEFaucetAbi from '../GoerliContractData/LIMEFaucet.json'
import LIMEFaucetAddress from '../GoerliContractData/LIMEFaucet-address.json'
import LIMETokenAbi from '../GoerliContractData/LIMEToken.json'
import LIMETokenAddress from '../GoerliContractData/LIMEToken-address.json'
import LIMEnftAbi from '../GoerliContractData/LIMEnft.json'
import LIMEnftAddress from '../GoerliContractData/LIMEnft-address.json'
import LIMEAbi from '../GoerliContractData/LIME.json'
import LIMEAddress from '../GoerliContractData/LIME-address.json'
import LIMEMarketplaceAbi from '../GoerliContractData/LIMEMarketplace.json'
import LIMEMarketplaceAddress from '../GoerliContractData/LIMEmarketplace-address.json'
import LIMESwapAbi from '../GoerliContractData/LIMESwap.json'
import LIMESwapAddress from '../GoerliContractData/LIMESwap-address.json'
import WETH9Abi from '../GoerliContractData/WETH9.json'
import WETH9Address from '../GoerliContractData/WETH9-address.json'

import Home from "./pages/Home"
import Navigation from './nav'
import MyOwned from './pages/MyOwned'
import Faucet from './pages/Faucet'
import Marketplace from './pages/Marketplace'
import Launchpad from './pages/Launchpad'
import UploadImage from './pages/UploadImage'
import Swap from './pages/SWAP/Swap'


 
function App() {

  const [account, setAccount] = useState(null)
  const [token, setToken] = useState({})
  const [faucet, setFaucet] = useState({})
  const [nft, setNft] = useState({})
  const [swap, setSwap] = useState({})
  const [marketplace, setMarketplace] = useState({})
  const [lime, setLime] = useState({})
  const [weth, setWeth] = useState({})
  const [data, setData] = useState(false)



  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setAccount(accounts[0])
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    loadContracts(signer)

   }

 const loadContracts = async (signer) => {    
    const token = new ethers.Contract(LIMETokenAddress.address, LIMETokenAbi.abi, signer)
    setToken(token)
    const nft = new ethers.Contract(LIMEnftAddress.address, LIMEnftAbi.abi, signer)
    setNft(nft)
    const faucet = new ethers.Contract(LIMEFaucetAddress.address, LIMEFaucetAbi.abi, signer)
    setFaucet(faucet)
    const marketplace = new ethers.Contract(LIMEMarketplaceAddress.address, LIMEMarketplaceAbi.abi, signer)
    setMarketplace(marketplace)
    const lime = new ethers.Contract(LIMEAddress.address, LIMEAbi.abi, signer)
    setLime(lime)
    const swap = new ethers.Contract(LIMESwapAddress.address, LIMESwapAbi.abi, signer)
    setSwap(swap) 
    const weth = new ethers.Contract(WETH9Address.address, WETH9Abi.abi, signer)
    setWeth(weth)  
    setData(true)
  }

  useEffect(()=> {
    web3Handler()
  }, [])

  


  return (
    <BrowserRouter>
    <div className="App">
    <Navigation account = { account } web3Handler = { web3Handler } token = {token} marketplace = {marketplace} nft = {nft} lime = {lime} swap = {swap} /> 

    <div className="text-center">
    <h6 className="text-secondary">Welcome to the LIME dAPP. Please use on the Goerli Testnet.</h6>         
    </div>

    <Routes>

          <Route path = "/" element = { 
            <Home lime = {lime} nft = {nft} data = {data} token = {token} account = {account} toWei = {toWei} fromWei = {fromWei} LoadingWeb3 = {LoadingWeb3}/> 
          } />

          <Route path = "/Faucet" element = { 
            <Faucet faucet = {faucet} account = {account} LoadingWeb3 = {LoadingWeb3}/> 
          } />

          <Route path = "/Marketplace" element = { 
            <Marketplace marketplace = {marketplace} nft = {nft} token = {token} data = {data} account = {account} toWei = {toWei} fromWei = {fromWei} LoadingWeb3 = {LoadingWeb3} LoadingItems = {LoadingItems}/> 
          }/>
         
          <Route path = "/Launchpad" element = { 
            <Launchpad account = {account} marketplace = {marketplace} nft = {nft} token = {token} LoadingWeb3 = {LoadingWeb3}/>
          } />

          <Route path = "/Swap" element = {
            <Swap swap = {swap} token = {token} account = {account} data ={data} weth = {weth} toWei = {toWei} fromWei = {fromWei} LoadingWeb3 = {LoadingWeb3}/>
          } />

          <Route path = "/MyOwned" element = {
            <MyOwned nft = {nft} account = {account} data = {data} marketplace = {marketplace} toWei = {toWei} LoadingWeb3 = {LoadingWeb3} LoadingItems = {LoadingItems} />
          } />

          <Route path = "/UploadImage" element = {
            <UploadImage lime = {lime} account = {account} LoadingWeb3 = {LoadingWeb3}/>
          } />

        </Routes>
       

      
    </div>
    </BrowserRouter>

  );
}

export default App;