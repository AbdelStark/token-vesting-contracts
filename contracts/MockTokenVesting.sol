// contracts/TokenVesting.sol
// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.4;

import "./TokenVesting.sol";

/**
 * @title MockTokenVesting
 * WARNING: use only for testing and debugging purpose
 */
contract MockTokenVesting is TokenVesting{

    uint256 mockTime = 0;

    constructor(address token_) TokenVesting(token_){
    }

    function setCurrentTime(uint256 _time)
        public{
        mockTime = _time;
    }

    function getCurrentTime()
        internal
        virtual
        override
        view
        returns(uint256){
        return mockTime;
    }
}
