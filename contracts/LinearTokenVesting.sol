// contracts/LinearTokenVesting.sol
// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title LinearTokenVesting
 * @dev A token holder contract that can release its token balance gradually like a
 * typical vesting scheme, with a cliff and vesting period. Optionally revocable by the
 * owner.
 * Adapted from:
 * https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v1.12.0/contracts/token/ERC20/TokenVesting.sol
 * contract by OpenZeppelin
 */
contract LinearTokenVesting is Ownable, ReentrancyGuard{
    using SafeMath for uint256;
    uint256 public constant ZERO = 0;

    // beneficiary of tokens after they are released
    address public beneficiary;
    // cliff period in seconds
    uint256 public cliff;
    // start time of the vesting period
    uint256 public start;
    // duration of the vesting period in seconds
    uint256 public duration;
    // whether or not the vesting is revocable
    bool public revocable;
    // amount of tokens released
    uint256 public released;
    // address of the ERC20 token
    IERC20 public token;

    event Released(uint256 amount);
    event Revoked();

    /**
    * @notice Only allow calls from the beneficiary of the vesting contract
    */
    modifier onlyBeneficiary() {
        require(msg.sender == beneficiary);
        _;
    }

    /**
     * @dev Creates a vesting contract that vests its balance of any ERC20 token to the
     * _beneficiary, gradually in a linear fashion until _start + _duration. By then all
     * of the balance will have vested.
     * @param _beneficiary address of the beneficiary to whom vested tokens are transferred
     * @param _cliff duration in seconds of the cliff in which tokens will begin to vest
     * @param _duration duration in seconds of the period in which the tokens will vest
     * @param _revocable whether the vesting is revocable or not
     * @param _token address of the ERC20 token contract
     */
    constructor(
        address _beneficiary,
        uint256 _start,
        uint256 _cliff,
        uint256 _duration,
        bool _revocable,
        address _token
    ) {
        require(_beneficiary != address(0x0));
        require(_cliff <= _duration);

        beneficiary = _beneficiary;
        start = _start;
        cliff = _start + _cliff;
        duration = _duration;
        revocable = _revocable;
        token = IERC20(_token);
    }

    receive() external payable {}

    fallback() external payable {}
    /**
     * @notice Transfers vested tokens to beneficiary.
     */
    function release() onlyBeneficiary nonReentrant public {
        uint256 vested = vestedAmount();

        require(vested > ZERO);

        released = released.add(vested);

        token.transfer(beneficiary, vested);

        emit Released(vested);
    }

    /**
     * @notice Allow the beneficiary to change its address
     * @param target the address to transfer the right to
     */
    function changeBeneficiary(address target) onlyBeneficiary public {
        require(target != address(0x0));
        beneficiary = target;
    }

    /**
     * @notice Allows the owner to revoke the vesting. Tokens already vested remain in the contract.
     */
    function revoke() onlyOwner public {
        require(revocable, "TokenVesting: vesting is not revocable");
        uint256 balance = token.balanceOf(address(this));
        uint256 vested = vestedAmount();
        uint256 revokedAmount = balance.sub(vested);
        token.transfer(owner(), revokedAmount);
        emit Revoked();
    }

    /**
     * @dev Calculates the amount that has already vested but hasn't been released yet.
     */
    function vestedAmount() public view returns (uint256) {
        if (block.timestamp < cliff) {
            return 0;
        } else if (block.timestamp >= start + duration) {
            return token.balanceOf(address(this));
        } else {
            uint256 currentBalance = token.balanceOf(address(this));
            uint256 totalBalance = currentBalance.add(released);
            uint256 vested = totalBalance.mul(block.timestamp - start).div(duration);
            uint256 unreleased = vested.sub(released);
            // currentBalance can be 0 in case of vesting being revoked earlier.
            return Math.min(currentBalance, unreleased);
        }
    }


    function getBeneficiary() public view returns(address){
        return beneficiary;
    }

    function getToken() public view returns(address){
        return address(token);
    }

    function getReleased() public view returns(uint256){
        return released;
    }
}
