// contracts/TokenVestingAggregator.sol
// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title TokenVestingAggregator
 */
contract TokenVestingAggregator is Ownable, ReentrancyGuard{
    using SafeMath for uint256;

    receive() external payable {}

    fallback() external payable {}
}
