// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0 <0.9.0;

import './pair.sol';



contract Factory {
    address public feeTo;
    address public feeToSetter;
    address[] public pairs;

        event ContractCreated(address pair);

    

    mapping(address => mapping(address => address)) public getPair;

     function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, 'Factory: IDENTICAL_ADDRESSES');
        require(getPair[tokenA][tokenB] == address(0), 'Factory: PAIR_EXISTS'); // single check is sufficient
        bytes memory bytecode = type(Pair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(tokenB, tokenA));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IPair(pair).initialize(tokenA, tokenB);
        getPair[tokenA][tokenB] = pair;
        getPair[tokenB][tokenA] = pair; // populate mapping in the reverse direction
            pairs.push(pair);
        emit ContractCreated(pair);

    }
}