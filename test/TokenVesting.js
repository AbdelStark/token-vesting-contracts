const { expect } = require("chai");

describe("TokenVesting", function () {
  let Token;
  let testToken;
  let TokenVesting;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  before(async function () {
    Token = await ethers.getContractFactory("Token");
    TokenVesting = await ethers.getContractFactory("MockTokenVesting");
  });
  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    testToken = await Token.deploy("Test Token", "TT", 1000000);
    await testToken.deployed();
  });

  describe("Vesting", function () {
    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await testToken.balanceOf(owner.address);
      expect(await testToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should vest tokens gradually", async function () {
      // deploy vesting contract
      const tokenVesting = await TokenVesting.deploy(testToken.address);
      await tokenVesting.deployed();
      expect((await tokenVesting.token()).toString()).to.equal(
        testToken.address
      );
      expect(await tokenVesting.getVestingSchedulesCount()).to.equal(0);
      expect(await tokenVesting.withdrawableAmount()).to.equal(0);
      // send tokens to vesting contract
      await expect(testToken.transfer(tokenVesting.address, 1000))
        .to.emit(testToken, "Transfer")
        .withArgs(owner.address, tokenVesting.address, 1000);
      const vestingContractBalance = await testToken.balanceOf(
        tokenVesting.address
      );
      expect(vestingContractBalance).to.equal(1000);
      expect(await tokenVesting.withdrawableAmount()).to.equal(1000);
      await expect(tokenVesting.getVestingIdAtIndex(1)).to.be.revertedWith(
        "TokenVesting: index out of bounds"
      );

      const baseTime = 1622551248;

      const beneficiary = addr1;
      const startTime = baseTime;
      const cliff = 0;
      const duration = 1000;
      const slicePeriodSeconds = 1;
      const revokable = false;
      const amount = 100;
      await tokenVesting.createVestingSchedule(
        beneficiary.address,
        startTime,
        cliff,
        duration,
        slicePeriodSeconds,
        revokable,
        amount
      );
      const vestingScheduleId =
        await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
          beneficiary.address,
          0
        );
      expect(
        await tokenVesting.computeVestedAmount(vestingScheduleId)
      ).to.be.equal(0);
      const halfTime = baseTime + duration / 2;
      await tokenVesting.setCurrentTime(halfTime);
      expect(
        await tokenVesting
          .connect(beneficiary)
          .computeVestedAmount(vestingScheduleId)
      ).to.be.equal(50);
      await expect(
        tokenVesting.connect(addr2).release(vestingScheduleId, 100)
      ).to.be.revertedWith(
        "TokenVesting: only beneficiary can release vested tokens"
      );
      await expect(
        tokenVesting.connect(beneficiary).release(vestingScheduleId, 100)
      ).to.be.revertedWith(
        "TokenVesting: cannot release tokens, not enough vested tokens"
      );
    });

    it("Should compute vesting schedule index", async function () {
      const tokenVesting = await TokenVesting.deploy(testToken.address);
      await tokenVesting.deployed();
      const expectedVestingScheduleId =
        "0xa279197a1d7a4b7398aa0248e95b8fcc6cdfb43220ade05d01add9c5468ea097";
      expect(
        (
          await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
            addr1.address,
            0
          )
        ).toString()
      ).to.equal(expectedVestingScheduleId);
      expect(
        (
          await tokenVesting.computeNextVestingScheduleIdForHolder(
            addr1.address
          )
        ).toString()
      ).to.equal(expectedVestingScheduleId);
    });
  });
});
