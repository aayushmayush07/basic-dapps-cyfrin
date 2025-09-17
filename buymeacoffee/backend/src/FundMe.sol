// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
error FundMe__NotOwner();
import {ConvertPrice} from "./convertPrice.sol";

contract FundMe {
    using ConvertPrice for uint256;
    address private immutable i_owner;
    address[] private s_funders;
    mapping(address => uint) public addressToAmount;
    uint256 public MINIMUM_USD = 5e18;
    AggregatorV3Interface internal priceFeed;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) > MINIMUM_USD,
            "Send more eth"
        );
        addressToAmount[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    function withdraw() public onlyOwner {
        uint256 fundersLength = s_funders.length;
        for (
            uint256 funderIndex = 0;
            funderIndex < fundersLength;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            addressToAmount[funder] = 0;
        }

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    modifier onlyOwner() {
        // require(msg.sender == owner);
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    function getVersion() external view returns (uint256) {
        uint256 version = priceFeed.version();
        return version;
    }

    function getDescription() external view returns (string memory) {
        return priceFeed.description();
    }

    fallback() external payable {
        fund();
    }

    receive() external payable {
        fund();
    }

    function addressToAmountFunded(
        address fundingAddress
    ) external view returns (uint256) {
        return addressToAmount[fundingAddress];
    }

    function getFunder(uint256 index) external view returns (address) {
        return s_funders[index];
    }

    function getOwner() external view returns (address) {
        return i_owner;
    }

}
// 0x694AA1769357215DE4FAC081bf1f309aDC325306
