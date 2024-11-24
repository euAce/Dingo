// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Counter {
    mapping(address => uint256) public userCounters;

    function setUserCounter(uint256 newNumber) public {
        userCounters[msg.sender] = newNumber;
    }

    function incrementUserCounter() public {
        userCounters[msg.sender]++;
    }

    function getUserCounter(address user) public view returns (uint256) {
        return userCounters[user];
    }
}
