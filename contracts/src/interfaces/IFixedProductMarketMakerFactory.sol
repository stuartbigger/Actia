// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ConditionalTokens } from "../gnosis/ConditionalTokens.sol";
import { FixedProductMarketMaker } from "../gnosis/FixedProductMarketMaker.sol";

interface IFixedProductMarketMakerFactory {

    function cloneConstructor(bytes calldata consData) external;

    function createFixedProductMarketMaker(
        ConditionalTokens conditionalTokens,
        IERC20 collateralToken,
        bytes32[] calldata conditionIds,
        uint fee
    ) external returns (FixedProductMarketMaker);
}