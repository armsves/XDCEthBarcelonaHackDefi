// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0 <0.9.0;

import './factory.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@uniswap/lib/contracts/libraries/TransferHelper.sol';
import './interfaces/IPair.sol';

contract Router {
    Factory public factory;
    address public WETH;

    constructor(Factory _factory, address _WETH) public {
        factory = _factory;
        WETH = _WETH;
    }

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        address to
    ) external {
        require(factory.getPair(tokenA, tokenB) != address(0), "Pair does not exist");

        bool successA = IERC20(tokenA).transferFrom(msg.sender, factory.getPair(tokenA, tokenB), amountADesired);
        require(successA, "TransferFrom failed for TokenA");
        
        bool successB = IERC20(tokenB).transferFrom(msg.sender, factory.getPair(tokenA, tokenB), amountBDesired);
        require(successB, "TransferFrom failed for TokenB");

        IPair pair = IPair(factory.getPair(tokenA, tokenB));
        pair.mint(to);
    }

    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        address to
    ) external payable {
        require(factory.getPair(WETH, token) != address(0), "Pair does not exist");

        TransferHelper.safeTransferFrom(token, msg.sender, factory.getPair(WETH, token), amountTokenDesired);
        
        (bool success,) = WETH.call{value: msg.value}("");
        require(success, "Failed to send WETH");
        
        IPair pair = IPair(factory.getPair(WETH, token));
        pair.mint(to);
    }

    function approve(address token, uint amount) external {
        // Approve this Router contract to spend 'amount' of 'token' on behalf of the sender
        TransferHelper.safeApprove(token, address(this), amount);
    }

    function checkApproval(address token, uint amount) public view returns (bool) {
    return IERC20(token).allowance(address(this), address(this)) >= amount;
}


    function swapTokens(
        address tokenA,
        address tokenB,
        uint amountAIn,
        address to
    ) external {
        address pairAddress = factory.getPair(tokenA, tokenB);
        require(pairAddress != address(0), "Pair does not exist");
        
        // Transfer tokenA from sender to Pair
        TransferHelper.safeTransferFrom(tokenA, msg.sender, pairAddress, amountAIn);
        
        IPair pair = IPair(pairAddress);

        uint reserveA;
        uint reserveB;
        (tokenA == pair.token0()) ? (reserveA, reserveB) = pair.getReserves() : (reserveB, reserveA) = pair.getReserves();
        require(amountAIn <= reserveA, "Not enough liquidity");

        // Calculate the amount of tokenB out
        uint amountBOut = (amountAIn * reserveB) / reserveA;  // simplified; doesn't account for fees

        // Swap tokens
        (tokenA == pair.token0()) ? pair.swap(0, amountBOut, to) : pair.swap(amountBOut, 0, to);
    }
}
