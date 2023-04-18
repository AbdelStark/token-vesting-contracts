[![Actions Status](https://github.com/abdelhamidbakhta/token-vesting-contracts/workflows/test/badge.svg)](https://github.com/abdelhamidbakhta/token-vesting-contracts/actions/workflows/test.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://badge.fury.io/js/erc20-token-vesting.svg)](https://badge.fury.io/js/erc20-token-vesting)

# Token Vesting Contracts

## Overview

On-Chain vesting scheme enabled by smart contracts.

`TokenVesting` contract can release its token balance gradually like a typical vesting scheme, with a cliff and vesting period.
The vesting schedules are optionally revocable by the owner.

## 🎭🧑‍💻 Security audits

- [Security audit](https://github.com/abdelhamidbakhta/token-vesting-contracts/blob/main/audits/hacken_audit_report.pdf) from [Hacken](https://hacken.io)

This repository is compatible with both Forge and Hardhat.
Forge needs to be ran (install and build) before Hardhat is used in order to load dependency contracts.
You can find the specific instructions for each tool below.

### Forge

#### 📦 Installation

```console
forge install
```

#### ⛏️ Compile

```console
forge build
```

#### 🌡️ Testing

```console
$ forge test
```

### Hardhat
#### 📦 Installation

```console
$ yarn
```

#### ⛏️ Compile

```console
$ yarn compile
```

This task will compile all smart contracts in the `contracts` directory.
ABI files will be automatically exported in `build/abi` directory.

#### 📚 Documentation

Documentation is auto-generated after each build in `docs` directory.

The generated output is a static website containing smart contract documentation.

#### 🌡️ Testing

Note: make sure to have ran forge build and compile before you run tests.

```console
$ yarn test
```

#### 📊 Code coverage

```console
$ yarn coverage
```

The report will be printed in the console and a static website containing full report will be generated in `coverage` directory.

#### ✨ Code style

```console
$ yarn prettier
```

#### 🐱‍💻 Verify & Publish contract source code

```console
$ npx hardhat  verify --network mainnet $CONTRACT_ADDRESS $CONSTRUCTOR_ARGUMENTS
```

## 📄 License

**Token Vesting Contracts** is released under the [Apache-2.0](LICENSE).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/abdelhamidbakhta"><img src="https://avatars.githubusercontent.com/u/45264458?v=4?s=100" width="100px;" alt="Abdel @ StarkWare "/><br /><sub><b>Abdel @ StarkWare </b></sub></a><br /><a href="https://github.com/abdelhamidbakhta/token-vesting-contracts/commits?author=abdelhamidbakhta" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/vpavlin"><img src="https://avatars.githubusercontent.com/u/4759808?v=4?s=100" width="100px;" alt="Vaclav Pavlin"/><br /><sub><b>Vaclav Pavlin</b></sub></a><br /><a href="https://github.com/abdelhamidbakhta/token-vesting-contracts/commits?author=vpavlin" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/TheMightyYak1"><img src="https://avatars.githubusercontent.com/u/78634345?v=4?s=100" width="100px;" alt="Brendan Baker"/><br /><sub><b>Brendan Baker</b></sub></a><br /><a href="https://github.com/abdelhamidbakhta/token-vesting-contracts/commits?author=TheMightyYak1" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
