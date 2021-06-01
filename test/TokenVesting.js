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
    TokenVesting = await ethers.getContractFactory("TokenVesting");
  });
  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    testToken = await Token.deploy("Test Token", "TT", 1000);
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
      await expect(testToken.transfer(tokenVesting.address, 100))
        .to.emit(testToken, "Transfer")
        .withArgs(owner.address, tokenVesting.address, 100);
      const vestingContractBalance = await testToken.balanceOf(
        tokenVesting.address
      );
      expect(vestingContractBalance).to.equal(100);
      expect(await tokenVesting.withdrawableAmount()).to.equal(100);
      await expect(tokenVesting.getVestingIdAtIndex(1)).to.be.revertedWith(
        "TokenVesting: index out of bounds"
      );
    });
  });
});
