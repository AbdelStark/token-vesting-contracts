[![Actions Status](https://github.com/abdelhamidbakhta/token-vesting-contracts/workflows/main/badge.svg)](https://github.com/abdelhamidbakhta/token-vesting-contracts/actions)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://badge.fury.io/js/token-vesting-contracts.svg)](https://badge.fury.io/js/token-vesting-contracts)
# Token Vesting Contracts

## Overview

On-Chain vesting scheme enabled by smart contracts.

`TokenVesting` contract can release its token balance gradually like a typical vesting scheme, with a cliff and vesting period.
Optionally revocable by the owner.

### 📦 Installation

```console
$ yarn
```

### ⛏️ Compile

```console
$ yarn compile
```

This task will compile all smart contracts in the `contracts` directory.
ABI files will be automatically exported in `build/abi` directory.

### 📚 Documentation

Documentation is auto-generated after each build in `docs` directory.

The generated output is a static website containing smart contract documentation.

### 🌡️ Testing

```console
$ yarn test
```

### 📊 Code coverage

```console
$ yarn coverage
```

The report will be printed in the console and a static website containing full report will be generated in `coverage` directory.

### ✨ Code style

```console
$ yarn prettier
```

### TODOS

- Investigate Hardhat Ledger support https://www.npmjs.com/package/@ethersproject/hardware-wallets

## 📄 License

**Token Vesting Contracts** is released under the [Apache-2.0](LICENSE).
