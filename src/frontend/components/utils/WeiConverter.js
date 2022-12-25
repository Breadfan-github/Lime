  import { ethers } from 'ethers'; 

  const toWei = (num) => ethers.utils.parseEther(num.toString())
  const fromWei = (num) => ethers.utils.formatEther(num.toString())

  export {toWei, fromWei}