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
      expect((await tokenVesting.getToken()).toString()).to.equal(
        testToken.address
      );
      // send tokens to vesting contract
      await expect(testToken.transfer(tokenVesting.address, 1000))
        .to.emit(testToken, "Transfer")
        .withArgs(owner.address, tokenVesting.address, 1000);
      const vestingContractBalance = await testToken.balanceOf(
        tokenVesting.address
      );
      expect(vestingContractBalance).to.equal(1000);
      expect(await tokenVesting.getWithdrawableAmount()).to.equal(1000);

      const baseTime = 1622551248;
      const beneficiary = addr1;
      const startTime = baseTime;
      const cliff = 0;
      const duration = 1000;
      const slicePeriodSeconds = 1;
      const revokable = true;
      const amount = 100;

      // create new vesting schedule
      await tokenVesting.createVestingSchedule(
        beneficiary.address,
        startTime,
        cliff,
        duration,
        slicePeriodSeconds,
        revokable,
        amount
      );
      expect(await tokenVesting.getVestingSchedulesCount()).to.be.equal(1);
      expect(
        await tokenVesting.getVestingSchedulesCountByBeneficiary(
          beneficiary.address
        )
      ).to.be.equal(1);

      // compute vesting schedule id
      const vestingScheduleId =
        await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
          beneficiary.address,
          0
        );

      // check that vested amount is 0
      expect(
        await tokenVesting.computeReleasableAmount(vestingScheduleId)
      ).to.be.equal(0);

      // set time to half the vesting period
      const halfTime = baseTime + duration / 2;
      await tokenVesting.setCurrentTime(halfTime);

      // check that vested amount is half the total amount to vest
      expect(
        await tokenVesting
          .connect(beneficiary)
          .computeReleasableAmount(vestingScheduleId)
      ).to.be.equal(50);

      // check that only beneficiary can try to release vested tokens
      await expect(
        tokenVesting.connect(addr2).release(vestingScheduleId, 100)
      ).to.be.revertedWith(
        "TokenVesting: only beneficiary and owner can release vested tokens"
      );

      // check that beneficiary cannot release more than the vested amount
      await expect(
        tokenVesting.connect(beneficiary).release(vestingScheduleId, 100)
      ).to.be.revertedWith(
        "TokenVesting: cannot release tokens, not enough vested tokens"
      );

      // release 10 tokens and check that a Transfer event is emitted with a value of 10
      await expect(
        tokenVesting.connect(beneficiary).release(vestingScheduleId, 10)
      )
        .to.emit(testToken, "Transfer")
        .withArgs(tokenVesting.address, beneficiary.address, 10);

      // check that the vested amount is now 40
      expect(
        await tokenVesting
          .connect(beneficiary)
          .computeReleasableAmount(vestingScheduleId)
      ).to.be.equal(40);
      let vestingSchedule = await tokenVesting.getVestingSchedule(
        vestingScheduleId
      );

      // check that the released amount is 10
      expect(vestingSchedule.released).to.be.equal(10);

      // set current time after the end of the vesting period
      await tokenVesting.setCurrentTime(baseTime + duration + 1);

      // check that the vested amount is 90
      expect(
        await tokenVesting
          .connect(beneficiary)
          .computeReleasableAmount(vestingScheduleId)
      ).to.be.equal(90);

      // beneficiary release vested tokens (45)
      await expect(
        tokenVesting.connect(beneficiary).release(vestingScheduleId, 45)
      )
        .to.emit(testToken, "Transfer")
        .withArgs(tokenVesting.address, beneficiary.address, 45);

      // owner release vested tokens (45)
      await expect(tokenVesting.connect(owner).release(vestingScheduleId, 45))
        .to.emit(testToken, "Transfer")
        .withArgs(tokenVesting.address, beneficiary.address, 45);
      vestingSchedule = await tokenVesting.getVestingSchedule(
        vestingScheduleId
      );

      // check that the number of released tokens is 100
      expect(vestingSchedule.released).to.be.equal(100);

      // check that the vested amount is 0
      expect(
        await tokenVesting
          .connect(beneficiary)
          .computeReleasableAmount(vestingScheduleId)
      ).to.be.equal(0);

      // check that anyone cannot revoke a vesting
      await expect(
        tokenVesting.connect(addr2).revoke(vestingScheduleId)
      ).to.be.revertedWith("UNAUTHORIZED");
      await tokenVesting.revoke(vestingScheduleId);

      /*
       * TEST SUMMARY
       * deploy vesting contract
       * send tokens to vesting contract
       * create new vesting schedule (100 tokens)
       * check that vested amount is 0
       * set time to half the vesting period
       * check that vested amount is half the total amount to vest (50 tokens)
       * check that only beneficiary can try to release vested tokens
       * check that beneficiary cannot release more than the vested amount
       * release 10 tokens and check that a Transfer event is emitted with a value of 10
       * check that the released amount is 10
       * check that the vested amount is now 40
       * set current time after the end of the vesting period
       * check that the vested amount is 90 (100 - 10 released tokens)
       * release all vested tokens (90)
       * check that the number of released tokens is 100
       * check that the vested amount is 0
       * check that anyone cannot revoke a vesting
       */
    });

    it("Should release vested tokens if revoked", async function () {
      // deploy vesting contract
      const tokenVesting = await TokenVesting.deploy(testToken.address);
      await tokenVesting.deployed();
      expect((await tokenVesting.getToken()).toString()).to.equal(
        testToken.address
      );
      // send tokens to vesting contract
      await expect(testToken.transfer(tokenVesting.address, 1000))
        .to.emit(testToken, "Transfer")
        .withArgs(owner.address, tokenVesting.address, 1000);

      const baseTime = 1622551248;
      const beneficiary = addr1;
      const startTime = baseTime;
      const cliff = 0;
      const duration = 1000;
      const slicePeriodSeconds = 1;
      const revokable = true;
      const amount = 100;

      // create new vesting schedule
      await tokenVesting.createVestingSchedule(
        beneficiary.address,
        startTime,
        cliff,
        duration,
        slicePeriodSeconds,
        revokable,
        amount
      );

      // compute vesting schedule id
      const vestingScheduleId =
        await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
          beneficiary.address,
          0
        );

      // set time to half the vesting period
      const halfTime = baseTime + duration / 2;
      await tokenVesting.setCurrentTime(halfTime);

      await expect(tokenVesting.revoke(vestingScheduleId))
        .to.emit(testToken, "Transfer")
        .withArgs(tokenVesting.address, beneficiary.address, 50);
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

    it("Should check input parameters for createVestingSchedule method", async function () {
      const tokenVesting = await TokenVesting.deploy(testToken.address);
      await tokenVesting.deployed();
      await testToken.transfer(tokenVesting.address, 1000);
      const time = Date.now();
      await expect(
        tokenVesting.createVestingSchedule(
          addr1.address,
          time,
          0,
          0,
          1,
          false,
          1
        )
      ).to.be.revertedWith("TokenVesting: duration must be > 0");
      await expect(
        tokenVesting.createVestingSchedule(
          addr1.address,
          time,
          0,
          1,
          0,
          false,
          1
        )
      ).to.be.revertedWith("TokenVesting: slicePeriodSeconds must be >= 1");
      await expect(
        tokenVesting.createVestingSchedule(
          addr1.address,
          time,
          0,
          1,
          1,
          false,
          0
        )
      ).to.be.revertedWith("TokenVesting: amount must be > 0");
    });

    it("Should not release tokens before cliff", async function () {
      // deploy vesting contract
      const tokenVesting = await TokenVesting.deploy(testToken.address);
      await tokenVesting.deployed();

      // send tokens to vesting contract
      await expect(testToken.transfer(tokenVesting.address, 1000))
        .to.emit(testToken, "Transfer")
        .withArgs(owner.address, tokenVesting.address, 1000);

      const baseTime = 1622551248;
      const beneficiary = addr1;
      const startTime = baseTime;
      const cliff = 100; // Set a non-zero cliff duration
      const duration = 1000;
      const slicePeriodSeconds = 1;
      const revokable = true;
      const amount = 100;

      // create new vesting schedule
      await tokenVesting.createVestingSchedule(
        beneficiary.address,
        startTime,
        cliff,
        duration,
        slicePeriodSeconds,
        revokable,
        amount
      );

      // compute vesting schedule id
      const vestingScheduleId =
        await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
          beneficiary.address,
          0
        );

      // check that vested amount is 0 before cliff
      expect(
        await tokenVesting.computeReleasableAmount(vestingScheduleId)
      ).to.be.equal(0);

      // set time to just before the cliff
      const justBeforeCliff = baseTime + cliff - 1;
      await tokenVesting.setCurrentTime(justBeforeCliff);

      // check that vested amount is still 0 just before the cliff
      expect(
        await tokenVesting.computeReleasableAmount(vestingScheduleId)
      ).to.be.equal(0);

      // set time to the cliff
      await tokenVesting.setCurrentTime(baseTime + cliff + 200);

      // check that vested amount is greater than 0 at the cliff
      expect(
        await tokenVesting.computeReleasableAmount(vestingScheduleId)
      ).to.be.equal(20);
    });

    it("Should vest tokens correctly with a 6-months cliff and 12-months duration", async function () {
      // deploy vesting contract
      const tokenVesting = await TokenVesting.deploy(testToken.address);
      await tokenVesting.deployed();

      // send tokens to vesting contract
      await expect(testToken.transfer(tokenVesting.address, 1000))
        .to.emit(testToken, "Transfer")
        .withArgs(owner.address, tokenVesting.address, 1000);

      const baseTime = 1622551248; // June 1, 2021
      const beneficiary = addr1;
      const startTime = baseTime;
      const cliff = 15552000; // 6 months in seconds
      const duration = 31536000; // 12 months in seconds
      const slicePeriodSeconds = 2592000; // 1 month in seconds
      const revokable = true;
      const amount = 1000;

      // create new vesting schedule
      await tokenVesting.createVestingSchedule(
        beneficiary.address,
        startTime,
        cliff,
        duration,
        slicePeriodSeconds,
        revokable,
        amount
      );

      // compute vesting schedule id
      const vestingScheduleId =
        await tokenVesting.computeVestingScheduleIdForAddressAndIndex(
          beneficiary.address,
          0
        );

      // check that vested amount is 0 before cliff
      expect(
        await tokenVesting.computeReleasableAmount(vestingScheduleId)
      ).to.be.equal(0);

      // set time to just before the cliff (5 months)
      const justBeforeCliff = baseTime + cliff - 2592000;
      await tokenVesting.setCurrentTime(justBeforeCliff);

      // check that vested amount is still 0 just before the cliff
      expect(
        await tokenVesting.computeReleasableAmount(vestingScheduleId)
      ).to.be.equal(0);

      // set time to the cliff (6 months)
      await tokenVesting.setCurrentTime(baseTime + cliff);

      // check that vested amount is equal to the total amount at the cliff
      expect(
        await tokenVesting.computeReleasableAmount(vestingScheduleId)
      ).to.be.equal(0);

      // set time to halfway through the vesting period (12 months)
      const halfwayThrough = baseTime + cliff + duration / 2;
      await tokenVesting.setCurrentTime(halfwayThrough);

      // check that vested amount is greater than 0
      expect(
        await tokenVesting.computeReleasableAmount(vestingScheduleId)
      ).to.be.gt(400);

      // set time to the end of the vesting period (18 months)
      const endOfVesting = baseTime + cliff + duration;
      await tokenVesting.setCurrentTime(endOfVesting);

      // check that vested amount is equal to the total amount
      expect(
        await tokenVesting.computeReleasableAmount(vestingScheduleId)
      ).to.be.equal(amount);
    });

  });

  describe("Withdraw", function () {
    it("Should not allow non-owners to withdraw tokens", async function () {
      const tokenVesting = await TokenVesting.deploy(testToken.address);
      await tokenVesting.deployed();
      await testToken.transfer(tokenVesting.address, 1000);

      // Owner should be able to withdraw tokens
      await expect(tokenVesting.withdraw(500))
        .to.emit(testToken, "Transfer")
        .withArgs(tokenVesting.address, owner.address, 500);

      // Non-owner should not be able to withdraw tokens
      await expect(
        tokenVesting.connect(addr1).withdraw(100)
      ).to.be.revertedWith("UNAUTHORIZED");

      await expect(
        tokenVesting.connect(addr2).withdraw(200)
      ).to.be.revertedWith("UNAUTHORIZED");
    });

    it("Should not allow withdrawing more than the available withdrawable amount", async function () {
      const tokenVesting = await TokenVesting.deploy(testToken.address);
      await tokenVesting.deployed();
      await testToken.transfer(tokenVesting.address, 1000);

      await expect(
        tokenVesting.withdraw(1500)
      ).to.be.revertedWith("TokenVesting: not enough withdrawable funds");
    });

    it("Should emit a Transfer event when withdrawing tokens", async function () {
      const tokenVesting = await TokenVesting.deploy(testToken.address);
      await tokenVesting.deployed();
      await testToken.transfer(tokenVesting.address, 1000);

      await expect(tokenVesting.withdraw(500))
        .to.emit(testToken, "Transfer")
        .withArgs(tokenVesting.address, owner.address, 500);
    });

    it("Should update the withdrawable amount after withdrawing tokens", async function () {
      const tokenVesting = await TokenVesting.deploy(testToken.address);
      await tokenVesting.deployed();
      await testToken.transfer(tokenVesting.address, 1000);

      await tokenVesting.withdraw(300);
      expect(await tokenVesting.getWithdrawableAmount()).to.equal(700);
    });

  });
});
