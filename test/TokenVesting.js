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
      const tokenVesting = await TokenVesting.deploy(
        addr1.address,
        0,
        0,
        0,
        false,
        testToken.address
      );
      await tokenVesting.deployed();
      expect((await tokenVesting.getBeneficiary()).toString()).to.equal(
        addr1.address
      );
      expect((await tokenVesting.getToken()).toString()).to.equal(
        testToken.address
      );
    });
  });
});
