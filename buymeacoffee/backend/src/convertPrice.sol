//SPDX-License-Identifier:MIT
pragma solidity 0.8.19;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";


library ConvertPrice{
        function getEthPriceInUsd(AggregatorV3Interface priceFeed) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData(); //this will call the function the specified contract address uisng signature

        return uint256(price * 1e10);
    }

    function getConversionRate(
        uint256 ethAmount,AggregatorV3Interface priceFeed
    ) public view returns (uint256) {
        uint256 ethPrice = getEthPriceInUsd(priceFeed);
        return (ethAmount * ethPrice) / 1e18;
    }
}


