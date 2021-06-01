// contracts/TokenVesting.sol
// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title TokenVesting
 */
contract TokenVesting is Ownable, ReentrancyGuard{
    using SafeMath for uint256;

    struct VestingSchedule{
        bool initialized;
        // beneficiary of tokens after they are released
        address  beneficiary;
        // cliff period in seconds
        uint256  cliff;
        // start time of the vesting period
        uint256  start;
        // duration of the vesting period in seconds
        uint256  duration;
        // duration of a slice period for the vesting in seconds
        uint256 slicePeriodSeconds;
        // whether or not the vesting is revocable
        bool  revocable;
        // total amount of tokens to be released at the end of the vesting
        uint256 amountTotal;
        // amount of tokens released
        uint256  released;
        // whether or not the vesting has been revoked
        bool revoked;
    }

    // address of the ERC20 token
    IERC20 private _token;

    bytes32[] private vestingSchedulesIds;
    mapping(bytes32 => VestingSchedule) private vestingSchedules;
    uint256 private vestingSchedulesTotalAmount;

    event Released(uint256 amount);
    event Revoked();

    modifier onlyIfVestingScheduleExists(bytes32 vestingScheduleId) {
        require(vestingSchedules[vestingScheduleId].initialized == true);
        _;
    }

    modifier onlyIfVestingScheduleNotRevoked(bytes32 vestingScheduleId) {
        require(vestingSchedules[vestingScheduleId].initialized == true);
        require(vestingSchedules[vestingScheduleId].revoked == false);
        _;
    }

    /**
     * @dev Creates a vesting contract
     * @param token_ address of the ERC20 token contract
     */
    constructor(address token_) {
        require(token_ != address(0x0));
        _token = IERC20(token_);
    }

    receive() external payable {}

    fallback() external payable {}

    function revoke(bytes32 vestingScheduleId)
        public
        nonReentrant
        onlyIfVestingScheduleNotRevoked(vestingScheduleId){
        VestingSchedule storage vestingSchedule = vestingSchedules[vestingScheduleId];
        vestingSchedule.revoked = true;
        vestingSchedulesTotalAmount.sub(vestingSchedule.amountTotal);
    }

    function withdraw(uint256 amount)
        public
        onlyOwner{
        require(withdrawableAmount() >= amount, "TokenVesting: not enough withdrawable funds");
        _token.transfer(owner(), amount);
    }

    function getVestingSchedulesCount()
        public
        view
        returns(uint256){
        return vestingSchedulesIds.length;
    }

    function vestedAmount(bytes32 vestingScheduleId)
        public
        onlyIfVestingScheduleNotRevoked(vestingScheduleId)
        view
        returns(uint256){
        VestingSchedule storage vestingSchedule = vestingSchedules[vestingScheduleId];
        return _vestedAmount(vestingSchedule);
    }

    function getVestingSchedule(bytes32 vestingScheduleId)
        public
        view
        returns(VestingSchedule memory){
        return vestingSchedules[vestingScheduleId];
    }

    function withdrawableAmount()
        public
        view
        returns(uint256){
        return _token.balanceOf(address(this)).sub(vestingSchedulesTotalAmount);
    }

    function token()
        public
        view
        returns(address){
        return address(_token);
    }

    function _vestedAmount(VestingSchedule memory vestingSchedule)
    internal
    view
    returns(uint256){
        if (block.timestamp < vestingSchedule.cliff || vestingSchedule.revoked) {
            return 0;
        } else if (block.timestamp >= vestingSchedule.start + vestingSchedule.duration) {
            return vestingSchedule.amountTotal;
        } else {
            uint256 timeFromStart = block.timestamp.sub(vestingSchedule.start);
            uint secondsPerSlice = vestingSchedule.slicePeriodSeconds;
            uint256 vestedSlicePeriods = timeFromStart.div(secondsPerSlice);
            uint256 vestedSeconds = vestedSlicePeriods.mul(secondsPerSlice);
            return vestingSchedule.amountTotal.mul(vestedSeconds).div(vestingSchedule.duration);
        }
    }

}
