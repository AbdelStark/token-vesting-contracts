## Sūrya's Description Report

### Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| contracts/TokenVesting.sol | 964703cb4246c22da1bfb2f530785df33772635f |


### Contracts Description Table


|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **TokenVesting** | Implementation | Ownable, ReentrancyGuard |||
| └ | <Constructor> | Public ❗️ | 🛑  |NO❗️ |
| └ | <Receive Ether> | External ❗️ |  💵 |NO❗️ |
| └ | <Fallback> | External ❗️ |  💵 |NO❗️ |
| └ | getVestingSchedulesCountByBeneficiary | External ❗️ |   |NO❗️ |
| └ | getVestingIdAtIndex | External ❗️ |   |NO❗️ |
| └ | getVestingScheduleByAddressAndIndex | External ❗️ |   |NO❗️ |
| └ | getVestingSchedulesTotalAmount | External ❗️ |   |NO❗️ |
| └ | getToken | External ❗️ |   |NO❗️ |
| └ | createVestingSchedule | Public ❗️ | 🛑  | onlyOwner |
| └ | revoke | Public ❗️ | 🛑  | onlyOwner onlyIfVestingScheduleNotRevoked |
| └ | withdraw | Public ❗️ | 🛑  | nonReentrant onlyOwner |
| └ | release | Public ❗️ | 🛑  | nonReentrant onlyIfVestingScheduleNotRevoked |
| └ | getVestingSchedulesCount | Public ❗️ |   |NO❗️ |
| └ | computeReleasableAmount | Public ❗️ |   | onlyIfVestingScheduleNotRevoked |
| └ | getVestingSchedule | Public ❗️ |   |NO❗️ |
| └ | withdrawableAmount | Public ❗️ |   |NO❗️ |
| └ | computeNextVestingScheduleIdForHolder | Public ❗️ |   |NO❗️ |
| └ | computeVestingScheduleIdForAddressAndIndex | Public ❗️ |   |NO❗️ |
| └ | _computeReleasableAmount | Internal 🔒 |   | |
| └ | getCurrentTime | Internal 🔒 |   | |


### Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
