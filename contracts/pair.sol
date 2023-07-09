// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

import '@uniswap/lib/contracts/libraries/TransferHelper.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import './interfaces/IPair.sol';
import './libraries/SafeMath.sol';
import './libraries/Math.sol';

interface IOracle {
    function price() external view returns (uint);
}



contract Pair is ERC20, IPair {
    using SafeMath for uint;

    address public factory;
    address public token0;
    address public token1;

    uint private reserve0;
    uint private reserve1;

    uint private lock;

    constructor() public ERC20("PAIR", "PR") {
        factory = msg.sender;
    }

    function sync() external override {
    reserve0 = IERC20(token0).balanceOf(address(this));
    reserve1 = IERC20(token1).balanceOf(address(this));
}


    function initialize(address _token0, address _token1) external override {
        require(msg.sender == factory, 'Pair: FORBIDDEN');
        token0 = _token0;
        token1 = _token1;
    }

    function getReserves() public view returns (uint _reserve0, uint _reserve1) {
        return (reserve0, reserve1);
    }

    function _safeTransfer(address token, address to, uint value) private {
        (bool success,) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success, 'Pair: TRANSFER_FAILED');
    }

    function mint(address to) external override returns (uint liquidity) {
        uint balance0 = IERC20(token0).balanceOf(address(this));
        uint balance1 = IERC20(token1).balanceOf(address(this));
        uint amount0 = balance0.sub(reserve0);
        uint amount1 = balance1.sub(reserve1);

        liquidity = Math.sqrt(amount0.mul(amount1));
        _mint(to, liquidity);

        reserve0 = balance0;
        reserve1 = balance1;

        return liquidity;
    }

    function burn(address to) external override returns (uint amount0, uint amount1) {
        amount0 = IERC20(token0).balanceOf(address(this));
        amount1 = IERC20(token1).balanceOf(address(this));

        _burn(msg.sender, balanceOf(msg.sender));

        _safeTransfer(token0, to, amount0);
        _safeTransfer(token1, to, amount1);

        return (amount0, amount1);
    }

    function swap(uint amount0Out, uint amount1Out, address to) external override {
        require(msg.sender == factory, 'Pair: FORBIDDEN');
        require(amount0Out > 0 || amount1Out > 0, 'Pair: INSUFFICIENT_OUTPUT_AMOUNT');
        require(amount0Out < reserve0 && amount1Out < reserve1, 'Pair: INSUFFICIENT_LIQUIDITY');

        if (amount0Out > 0) _safeTransfer(token0, to, amount0Out);
        if (amount1Out > 0) _safeTransfer(token1, to, amount1Out);

        reserve0 = reserve0.sub(amount0Out);
        reserve1 = reserve1.sub(amount1Out);
    }

    function skim(address to) external override {
        _safeTransfer(token0, to, IERC20(token0).balanceOf(address(this)).sub(reserve0));
        _safeTransfer(token1, to, IERC20(token1).balanceOf(address(this)).sub(reserve1));
    }


    function getPricesInUSD(address oracleAddressToken0, address oracleAddressToken1) public view returns (uint priceToken0InUSD, uint priceToken1InUSD) {
    uint reserveToken0;
    uint reserveToken1;
    (reserveToken0, reserveToken1) = getReserves();

    IOracle oracleToken0 = IOracle(oracleAddressToken0);
    IOracle oracleToken1 = IOracle(oracleAddressToken1);

    uint oraclePriceToken0 = oracleToken0.price(); // Get price of token0 in USD from oracle
    uint oraclePriceToken1 = oracleToken1.price(); // Get price of token1 in USD from oracle

    require(oraclePriceToken0 > 0 && oraclePriceToken1 > 0, "Oracle price must be positive");

            priceToken0InUSD = (reserve0 * oraclePriceToken0) / (10**18); // Convert to USD
            priceToken0InUSD = (reserve1 * oraclePriceToken0) / (10**18); // Convert to USD

        //priceToken1InUSD = reserveToken1.mul(uint(oraclePriceToken1)).div(10**18); // Convert to USD


    return (priceToken0InUSD, priceToken1InUSD);
}
}
