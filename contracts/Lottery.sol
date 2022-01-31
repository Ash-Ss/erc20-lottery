// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './AshToken.sol';

contract Lottery {

    string public name = 'Lottery Contract';
    AshToken public ashToken;
    address public manager;
    address[] public players;
    uint256 totalMoney = 0;
    uint256 amount = 10000000000000000000;

    constructor(AshToken _ashToken) {
        ashToken = _ashToken;
        manager = msg.sender;
    }

    modifier restriction(){
        require(msg.sender == manager);
        _;
    }

    function enterLottery() public {
        //require(_amount == 100000000000000000000);
        //ashToken.approve(address(this), amount);
        ashToken.transferFrom(msg.sender, address(this), amount);
        players.push(msg.sender);
        totalMoney = totalMoney + amount;
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }
    
    function pickWinner() public restriction {
        require(players.length > 0);
        uint index = random() % players.length;
        ashToken.transfer(players[index], totalMoney);
        delete players;
    }

    function getPlayers() public view returns(address[] memory) {
        return players;
    }
}