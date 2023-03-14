// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../../contracts/TokenVesting.sol";
import "../../contracts/Token.sol";

contract TokenVestingTest is Test {
    Token public token;
    TokenVesting public tokenVesting;

    function setUp() public {
        token = new Token("Test Token", "TT", 1000000);
        tokenVesting = new TokenVesting(address(token));
    }

    // TODO: add tests
    function testCreateVestingSchedule() public {}
}
