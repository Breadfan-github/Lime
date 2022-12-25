// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import './LIMEToken.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract LIMEFaucet is Ownable {
	string public name;
	LIMEToken public token;
	uint public amount;
	uint public tokensClaimed;
	address payable admin;

	event Claimed(
		address user,
		address token,
		uint amount
		);

	constructor(LIMEToken _token) {
		name = 'Faucet';
		token = _token;
		admin = payable(msg.sender);
		amount = 50000000000000000000;
		tokensClaimed = 0;
		
	}
	
	mapping (address => bool) public claimed;

	function claimFaucet() public payable {
		require(!claimed[msg.sender], "cannot claim twice");
		require(token.balanceOf(address(this)) >= amount, "not enough tokens in contract");
		claimed[msg.sender] = true;
		token.transfer(msg.sender, amount);
		tokensClaimed += amount;
		emit Claimed(msg.sender, address(token), amount);
	}

	function withdraw() public payable onlyOwner {
		token.transfer(admin, token.balanceOf(address(this)));
	}

}