// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import './LIMEToken.sol';
import './WETH9.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LIMESwap is Ownable, ReentrancyGuard{

	uint public tokenPrice;
	uint public tokensSold;
	address payable Contract;
	address payable admin;
	LIMEToken public token;
	WETH9 public weth;
	

	event Sell(
		address _buyer,
		uint _amount,
		uint _price
		);

	event Purchase(
		address _seller,
		uint _amount,
		uint _price
		);

	constructor(uint256 _tokenPrice, LIMEToken _token, WETH9 _weth) {
		token = _token;
		weth = _weth;
		tokenPrice = _tokenPrice;
		Contract = payable(address(this));
		admin = payable(msg.sender);
		tokensSold = 0;
	}

	function buyTokens(uint256 _numberOfTokens) public payable nonReentrant{	
		require(token.balanceOf(address(this)) >= _numberOfTokens, "not enough tokens in contract");		
		require(weth.transferFrom(msg.sender, Contract, _numberOfTokens / tokenPrice),"weth not transferred to contract");
		require(token.transfer(msg.sender, _numberOfTokens), "token not transferred to user");
		tokensSold += _numberOfTokens;
		emit Sell(msg.sender, _numberOfTokens, tokenPrice);	
	}

	function sellTokens(uint _numberOfTokens) public payable nonReentrant{
		require(token.balanceOf(msg.sender) >= _numberOfTokens, "you dont have enough tokens!");
		uint wethAmount = _numberOfTokens / tokenPrice;
		require(weth.balanceOf(address(this)) >= wethAmount, "not enough WETH in smart contract!");
		require(token.transferFrom(msg.sender, address(this), _numberOfTokens), "tx failed, not enough tokens provided");
		require(weth.transfer(msg.sender, wethAmount), "weth tx failed");		
		emit Purchase(msg.sender, _numberOfTokens, tokenPrice);
	}


}

