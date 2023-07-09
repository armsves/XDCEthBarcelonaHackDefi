// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

contract Oracle {
    uint public price;
    address public owner;
    string public name;
    
    constructor(string memory _name) public {
        owner = msg.sender;
        name = _name;
    }

    function fulfillRequest(uint _price) public {
        price = _price;
    }
}
