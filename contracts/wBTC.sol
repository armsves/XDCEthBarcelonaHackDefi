
// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import './oracle/oracle.sol';


contract WrappedBitcoin is ERC20 {
    Oracle public oracle;

    constructor(Oracle _oracle) public ERC20("Wrapped Bitcoin", "wBTC") {
        oracle = _oracle;
    }

    function getLatestPrice() public view returns (uint) {
        return oracle.price();
    }
}