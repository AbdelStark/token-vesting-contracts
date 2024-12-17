# Token Vesting Contracts
---

This project is a fork of the ERC20 token vesting contract from [AbdelStark's repository](https://github.com/AbdelStark/token-vesting-contracts/tree/main). The current implementation has been modified to make the cliff period inclusive of the vesting duration.

## Overview

In the modified implementation, tokens are not vested during the cliff period, making it inclusive of the vesting duration. For example, if 1000 tokens are allocated for a 10-month duration with a 3-month cliff period, the vested/claimable amount for the first 3 months will be 0. On the first day of the 4th month, the claimable amount should be 300 tokens.

## Deployed Contracts

- **Token Address:** [0x480222Fd55597BB7EFc414a9C6d4E103820520Eb](https://sepolia.etherscan.io/address/0x480222Fd55597BB7EFc414a9C6d4E103820520Eb)
- **TokenVesting Address:** [0xDFf34D3960804DA62734d095419fD19F65229b0C](https://sepolia.etherscan.io/address/0xDFf34D3960804DA62734d095419fD19F65229b0C)
- **Deployer Address:** [0x14E9511285a10950f3c968Fa371F3b87182C9ef5](https://sepolia.etherscan.io/address/0x14E9511285a10950f3c968Fa371F3b87182C9ef5)

## Modifications

1. **Cliff Period Inclusion:**
   - The logic has been modified to include the cliff period within the vesting duration.

2. **Example Scenario:**
   - For a 1000 tokens allocation over a 10-month duration with a 3-month cliff period:
     - The claimable amount is 0 for the first 3 months.
     - On the first day of the 4th month, the claimable amount is 300 tokens.

## Testing

A test case has been written to pass the scenario mentioned above.

