// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC1155Receiver } from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import { IERC165 } from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import { ERC20 } from "./ERC20.sol";
import { ConditionalTokens } from "./ConditionalTokens.sol";
import { CTHelpers } from "./CTHelpers.sol";


library CeilDiv {
    // calculates ceil(x/y)
    function ceildiv(uint x, uint y) internal pure returns (uint) {
        if (x > 0) return ((x - 1) / y) + 1;
        return x / y;
    }
}


contract FixedProductMarketMaker is ERC20, IERC1155Receiver {
    event FPMMFundingAdded(
        address indexed funder,
        uint[] amountsAdded,
        uint sharesMinted
    );
    event FPMMFundingRemoved(
        address indexed funder,
        uint[] amountsRemoved,
        uint collateralRemovedFromFeePool,
        uint sharesBurnt
    );
    event FPMMBuy(
        address indexed buyer,
        uint investmentAmount,
        uint feeAmount,
        uint indexed outcomeIndex,
        uint outcomeTokensBought
    );
    event FPMMSell(
        address indexed seller,
        uint returnAmount,
        uint feeAmount,
        uint indexed outcomeIndex,
        uint outcomeTokensSold
    );

    using CeilDiv for uint;

    uint constant ONE = 10**18;

    ConditionalTokens public conditionalTokens;
    IERC20 public collateralToken;
    bytes32[] public conditionIds;
    uint public fee;
    uint internal feePoolWeight;

    uint[] outcomeSlotCounts;
    bytes32[][] collectionIds;
    uint[] positionIds;
    mapping (address => uint256) withdrawnFees;
    uint internal totalWithdrawnFees;
    

    function getPoolBalances() private view returns (uint[] memory) {
        address[] memory thises = new address[](positionIds.length);
        for (uint i = 0; i < positionIds.length; i++) {
            thises[i] = address(this);
        }
        return conditionalTokens.balanceOfBatch(thises, positionIds);
    }

    function generateBasicPartition(uint outcomeSlotCount)
        private
        pure
        returns (uint[] memory partition)
    {
        partition = new uint[](outcomeSlotCount);
        for (uint i = 0; i < outcomeSlotCount; i++) {
            partition[i] = 1 << i;
        }
    }

    function splitPositionThroughAllConditions(uint amount)
        private
    {
        for (uint i = conditionIds.length - 1; int(i) >= 0; i--) {
            uint[] memory partition = generateBasicPartition(outcomeSlotCounts[i]);
            for (uint j = 0; j < collectionIds[i].length; j++) {
                conditionalTokens.splitPosition(collateralToken, collectionIds[i][j], conditionIds[i], partition, amount);
            }
        }
    }

    function mergePositionsThroughAllConditions(uint amount)
        private
    {
        for (uint i = 0; i < conditionIds.length; i++) {
            uint[] memory partition = generateBasicPartition(outcomeSlotCounts[i]);
            for (uint j = 0; j < collectionIds[i].length; j++) {
                conditionalTokens.mergePositions(collateralToken, collectionIds[i][j], conditionIds[i], partition, amount);
            }
        }
    }

    function collectedFees() external view returns (uint) {
        return feePoolWeight - totalWithdrawnFees;
    }

    function feesWithdrawableBy(address account) public view returns (uint) {
        uint rawAmount = (feePoolWeight * balanceOf(account)) / totalSupply();
        return rawAmount - withdrawnFees[account];
    }

    function withdrawFees(address account) public {
        uint rawAmount = (feePoolWeight * balanceOf(account)) / totalSupply();
        uint withdrawableAmount = rawAmount - withdrawnFees[account];
        if (withdrawableAmount > 0) {
            withdrawnFees[account] = rawAmount;
            totalWithdrawnFees = totalWithdrawnFees + withdrawableAmount;
            require(collateralToken.transfer(account, withdrawableAmount), "withdrawal transfer failed");
        }
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        if (from != address(0)) {
            withdrawFees(from);
        }

        uint totalSupply = totalSupply();
        uint withdrawnFeesTransfer = totalSupply == 0 
            ? amount 
            : (feePoolWeight * amount) / totalSupply;

        if (from != address(0)) {
            withdrawnFees[from] = withdrawnFees[from] - withdrawnFeesTransfer;
            totalWithdrawnFees = totalWithdrawnFees - withdrawnFeesTransfer;
        } else {
            feePoolWeight = feePoolWeight + withdrawnFeesTransfer;
        }
        if (to != address(0)) {
            withdrawnFees[to] = withdrawnFees[to] + withdrawnFeesTransfer;
            totalWithdrawnFees = totalWithdrawnFees + withdrawnFeesTransfer;
        } else {
            feePoolWeight = feePoolWeight - withdrawnFeesTransfer;
        }
    }

    function addFunding(uint addedFunds, uint[] calldata distributionHint)
        external
    {
        require(addedFunds > 0, "funding must be non-zero");

        uint[] memory sendBackAmounts = new uint[](positionIds.length);
        uint poolShareSupply = totalSupply();
        uint mintAmount;
        if (poolShareSupply > 0) {
            require(distributionHint.length == 0, "cannot use distribution hint after initial funding");
            uint[] memory poolBalances = getPoolBalances();
            uint poolWeight = 0;
            for (uint i = 0; i < poolBalances.length; i++) {
                uint balance = poolBalances[i];
                if (poolWeight < balance)
                    poolWeight = balance;
            }

            for (uint i = 0; i < poolBalances.length; i++) {
                uint remaining = (addedFunds * poolBalances[i]) / poolWeight;
                sendBackAmounts[i] = addedFunds - remaining;
            }

            mintAmount = (addedFunds * poolShareSupply) / poolWeight;
        } else {
            if (distributionHint.length > 0) {
                require(distributionHint.length == positionIds.length, "hint length off");
                uint maxHint = 0;
                for(uint i = 0; i < distributionHint.length; i++) {
                    uint hint = distributionHint[i];
                    if (maxHint < hint)
                        maxHint = hint;
                }

                for (uint i = 0; i < distributionHint.length; i++) {
                    uint remaining = (addedFunds * distributionHint[i]) / maxHint;
                    require(remaining > 0, "must hint a valid distribution");
                    sendBackAmounts[i] = addedFunds - remaining;
                }
            }

            mintAmount = addedFunds;
        }

        require(collateralToken.transferFrom(msg.sender, address(this), addedFunds), "funding transfer failed");
        require(collateralToken.approve(address(conditionalTokens), addedFunds), "approval for splits failed");
        splitPositionThroughAllConditions(addedFunds);

        _mint(msg.sender, mintAmount);

        conditionalTokens.safeBatchTransferFrom(address(this), msg.sender, positionIds, sendBackAmounts, "");

        // transform sendBackAmounts to array of amounts added
        for (uint i = 0; i < sendBackAmounts.length; i++) {
            sendBackAmounts[i] = addedFunds - sendBackAmounts[i];
        }

        emit FPMMFundingAdded(msg.sender, sendBackAmounts, mintAmount);
    }

    function removeFunding(uint sharesToBurn)
        external
    {
        uint[] memory poolBalances = getPoolBalances();

        uint[] memory sendAmounts = new uint[](poolBalances.length);

        uint poolShareSupply = totalSupply();
        for (uint i = 0; i < poolBalances.length; i++) {
            sendAmounts[i] = (poolBalances[i] * sharesToBurn) / poolShareSupply;
        }

        uint collateralRemovedFromFeePool = collateralToken.balanceOf(address(this));

        _burn(msg.sender, sharesToBurn);
        collateralRemovedFromFeePool = collateralRemovedFromFeePool - (
            collateralToken.balanceOf(address(this))
        );

        conditionalTokens.safeBatchTransferFrom(address(this), msg.sender, positionIds, sendAmounts, "");

        emit FPMMFundingRemoved(msg.sender, sendAmounts, collateralRemovedFromFeePool, sharesToBurn);
    }

    function onERC1155Received(
        address operator,
        address,
        uint256,
        uint256,
        bytes calldata
    )
        external
        returns (bytes4)
    {
        if (operator == address(this)) {
            return this.onERC1155Received.selector;
        }
        return 0x0;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    )
        external
        returns (bytes4)
    {
        if (operator == address(this) && from == address(0)) {
            return this.onERC1155BatchReceived.selector;
        }
        return 0x0;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165) returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId ||
                interfaceId == type(IERC165).interfaceId;
    }

    function calcBuyAmount(uint investmentAmount, uint outcomeIndex) public view returns (uint) {
        require(outcomeIndex < positionIds.length, "invalid outcome index");

        uint[] memory poolBalances = getPoolBalances();
        uint investmentAmountMinusFees = investmentAmount - ((investmentAmount * fee) / ONE);
        uint buyTokenPoolBalance = poolBalances[outcomeIndex];
        uint endingOutcomeBalance = buyTokenPoolBalance * ONE;
        for (uint i = 0; i < poolBalances.length; i++) {
            if (i != outcomeIndex) {
                uint poolBalance = poolBalances[i];
                endingOutcomeBalance = (endingOutcomeBalance * poolBalance).ceildiv(
                    poolBalance + investmentAmountMinusFees
                );
            }
        }
        require(endingOutcomeBalance > 0, "must have non-zero balances");

        return (buyTokenPoolBalance + investmentAmountMinusFees) - (endingOutcomeBalance.ceildiv(ONE));
    }

    function calcSellAmount(uint returnAmount, uint outcomeIndex) public view returns (uint outcomeTokenSellAmount) {
        require(outcomeIndex < positionIds.length, "invalid outcome index");

        uint[] memory poolBalances = getPoolBalances();
        uint returnAmountPlusFees = (returnAmount * ONE) / (ONE - fee);
        uint sellTokenPoolBalance = poolBalances[outcomeIndex];
        uint endingOutcomeBalance = sellTokenPoolBalance * ONE;
        for (uint i = 0; i < poolBalances.length; i++) {
            if (i != outcomeIndex) {
                uint poolBalance = poolBalances[i];
                endingOutcomeBalance = (endingOutcomeBalance * poolBalance).ceildiv(
                    poolBalance - returnAmountPlusFees
                );
            }
        }
        require(endingOutcomeBalance > 0, "must have non-zero balances");

        return (returnAmountPlusFees + endingOutcomeBalance.ceildiv(ONE)) - sellTokenPoolBalance;
    }

    function buy(uint investmentAmount, uint outcomeIndex, uint minOutcomeTokensToBuy) external {
        uint outcomeTokensToBuy = calcBuyAmount(investmentAmount, outcomeIndex);
        require(outcomeTokensToBuy >= minOutcomeTokensToBuy, "minimum buy amount not reached");

        require(collateralToken.transferFrom(msg.sender, address(this), investmentAmount), "cost transfer failed");

        uint feeAmount = (investmentAmount * fee) / ONE;
        feePoolWeight = feePoolWeight + feeAmount;
        uint investmentAmountMinusFees = investmentAmount - feeAmount;
        require(collateralToken.approve(address(conditionalTokens), investmentAmountMinusFees), "approval for splits failed");
        splitPositionThroughAllConditions(investmentAmountMinusFees);

        conditionalTokens.safeTransferFrom(address(this), msg.sender, positionIds[outcomeIndex], outcomeTokensToBuy, "");

        emit FPMMBuy(msg.sender, investmentAmount, feeAmount, outcomeIndex, outcomeTokensToBuy);
    }

    function sell(uint returnAmount, uint outcomeIndex, uint maxOutcomeTokensToSell) external {
        uint outcomeTokensToSell = calcSellAmount(returnAmount, outcomeIndex);
        require(outcomeTokensToSell <= maxOutcomeTokensToSell, "maximum sell amount exceeded");

        conditionalTokens.safeTransferFrom(msg.sender, address(this), positionIds[outcomeIndex], outcomeTokensToSell, "");

        uint feeAmount = (returnAmount * fee) / (ONE - fee);
        feePoolWeight = feePoolWeight + feeAmount;
        uint returnAmountPlusFees = returnAmount + feeAmount;
        mergePositionsThroughAllConditions(returnAmountPlusFees);

        require(collateralToken.transfer(msg.sender, returnAmount), "return transfer failed");

        emit FPMMSell(msg.sender, returnAmount, feeAmount, outcomeIndex, outcomeTokensToSell);
    }
}
