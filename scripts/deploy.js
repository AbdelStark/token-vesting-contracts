async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy("Test Token", "TT", 1000);

  console.log("Token address:", token.address);

  const TokenVesting = await ethers.getContractFactory("TokenVesting");
  const tokenVesting = await TokenVesting.deploy(
    "0xC3298C6341f82468309302611e24D3003Bc79B46",
    0,
    0,
    0,
    false,
    token.address
  );
  console.log("TokenVesting address:", tokenVesting.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
