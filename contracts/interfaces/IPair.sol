// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0 <0.9.0;


interface IPair {
    function getReserves() external view returns (uint reserve0, uint reserve1);
    function token0() external view returns (address);
    function token1() external view returns (address);
    event Mint(address indexed sender, uint amount0, uint amount1);
    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint amount0In,
        uint amount1In,
        uint amount0Out,
        uint amount1Out,
        address indexed to
    );
    event Sync(uint reserve0, uint reserve1);

    function mint(address to) external returns (uint liquidity);
    function burn(address to) external returns (uint amount0, uint amount1);
    function swap(uint amount0Out, uint amount1Out, address to) external;
    function skim(address to) external;
    function sync() external;
    function initialize(address, address) external;
}