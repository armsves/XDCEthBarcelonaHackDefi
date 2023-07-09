// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "./oracle.sol";

contract OracleFactory {
    mapping(address => address) public getOracle;
    address[] public allOracles;

    event OracleCreated(address oracleAddress);

    
    function createOracle(string memory _name) public {
        Oracle oracle = new Oracle(_name);
        getOracle[msg.sender] = address(oracle);
        allOracles.push(address(oracle));
        emit OracleCreated(address(oracle));

    }

     function fulfillOracleRequest(address oracleAddress, int256 data) public {
        Oracle oracle = Oracle(getOracle[oracleAddress]);
        oracle.fulfillRequest(data);
    }

     function getAllOracles() public view returns (address[] memory) {
        return allOracles;
    }
}
