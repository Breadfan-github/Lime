// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import './LIMEToken.sol';

contract LIME {
  string public name;
  uint public imageCount;
  address payable public Creator;
  LIMEToken public token;
   

	struct Image {
    uint id;
    uint tipAmount;
    string hash;
    string description;
    address payable creator;
	  }

  struct User {
    bool bidded;
    uint bidAmount;
    bool accepted;
  }

  event ImageCreated(
    uint id,
    uint tipAmount,
    string hash,
    string description,
    address payable creator
    );

  event ImageTipped(
    uint id,
    uint tipAmount,
    string hash,
    string description,
    address indexed tipper,
    address payable creator
    );

  event UserBidForMessage(
    address user,
    uint bidAmount,
    bool bidded,
    bool accepted 
    );

  event AcceptedBidForMessage(
    address user,
    uint bidAmount,
    bool accepted 
    );

  constructor(LIMEToken _token, address _creator) {
    name = "LIME main contract";
    token = _token;
    Creator = payable(_creator);
    imageCount = 0;
    }

    
  mapping (address => User) public users;
  mapping (uint => Image) public images;

  function uploadImage(string memory _imgHash, string memory _description) public {
    require(msg.sender == Creator, "you are not the creator!");
    require(bytes(_imgHash).length > 0, "no img hash provided!");
    require(bytes(_description).length > 0, "please provide description!");
    imageCount ++;
    images[imageCount] = Image(imageCount, 0, _imgHash, _description, Creator);
    emit ImageCreated(imageCount, 0, _imgHash, _description, Creator);
  }

  function tipImage(uint _imgId, uint _amount) public payable {
    require(_imgId > 0 && _imgId <= imageCount, "content does not exist!");
    require(_amount > 0, "no amount tipped!");
    require(msg.sender != Creator, "cannot tip own image!");
    Image memory _image = images[_imgId];
    token.transferFrom(msg.sender, Creator, _amount);
    _image.tipAmount = _image.tipAmount + _amount;
    images[_imgId] = _image;
    emit ImageTipped(_imgId, _amount, _image.hash, _image.description, msg.sender, Creator);
  }

//users not required to lock(transfer) their tokens to contract for bidding
  function bidForMessage(uint _amount) public {
    require(_amount > 0, "no amount bidded!");
    User storage _user = users[msg.sender];
    require(!_user.bidded, "you've already placed your bid!");
    //requires the caller to have bidded in their account
    require(token.balanceOf(msg.sender) >= _amount, "you do not have enough for your bid!");   
    _user.bidded = true;
    _user.bidAmount = _amount;
    users[msg.sender] = _user;
    emit UserBidForMessage(msg.sender, _amount, true, false);
  }

  function acceptBid(address _bidAddress) public {
    require(msg.sender == Creator, "only Creator can accept bids!");
    User storage _user = users[_bidAddress];
    require(_user.bidded, "user did not bid");
    require(!_user.accepted, "already accepted the bid from this user!");
    //reverts if user spends their tokens somewhere else before creator accepts their bid;
    require(token.balanceOf(_bidAddress) >= _user.bidAmount, "user does not have enough tokens!");
    token.transferFrom(_bidAddress, Creator, _user.bidAmount);
    _user.accepted = true;
    users[_bidAddress] = _user;
    emit AcceptedBidForMessage(_bidAddress, _user.bidAmount, _user.accepted);
  }

}

  





