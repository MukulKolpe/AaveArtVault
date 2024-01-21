// loans.test.js

const { expect } = require("chai");
const { ethers, network } = require("hardhat");

const DAI_HOLDER = "0x4a52ed1e5ae4df93d7cb331f47dae52053ae986f";

async function getSigner() {
  const [signer] = await ethers.getSigners();
  return signer;
}

describe("LoanManager and Loans Contracts", function () {
  let owner, borrower, lender, nftContract;
  let loanManager, loans, loanAddress;

  before(async function () {
    [owner, borrower, lender] = await ethers.getSigners();

    const LoanManager = await ethers.getContractFactory("LoanManager");
    loanManager = await LoanManager.connect(owner).deploy();

    const Loans = await ethers.getContractFactory("Loans");
  });

  it("Should mint nft and create loan", async function () {
    const deployer = await getSigner();
    borrower = deployer.address;
    console.log("Deployer is + ", deployer.address);
    const NFT = await ethers.getContractFactory("NFT");
    nftContract = await NFT.deploy();
    await nftContract.deployed();
    const tx = await nftContract.mintProperty(
      "https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS"
    );
    tx.wait(1);
    const ownwer = await nftContract?.ownerOf(1);
    expect(ownwer).to.equal(deployer.address);
    nftContract.approve(loanManager.address, 1);
    const tx2 = await nftContract.transferFrom(
      deployer.address,
      loanManager.address,
      1
    );
    tx2.wait(1);

    const newOwner = await nftContract?.ownerOf(1);
    expect(newOwner).to.equal(loanManager.address);

    const tx3 = await loanManager.createLoan(
      ethers.utils.parseEther("0.00000000001", 18).toString(),
      10,
      nftContract.address,
      1,
      1705807966
    );
    await tx3.wait(1);

    expect(tx3).to.not.be.reverted;

    const borrowedloan = await loanManager.getBorrowerLoans();

    console.log("Borrowed loan is + ", borrowedloan[0]);

    loanAddress = borrowedloan[0];
  });

  it("Should lend loan", async function () {
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [DAI_HOLDER],
    });

    const signer = await ethers.provider.getSigner(DAI_HOLDER);
    const daiContract = await ethers.getContractAt(
      "IERC20",
      "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      signer
    );

    const loanContract = await ethers.getContractAt(
      "Loans",
      loanAddress,
      signer
    );

    const loanamount = await loanContract.loanAmount();

    const pool = await loanContract.POOL();
    console.log("pool is + ", pool);

    const tx1 = await daiContract.transfer(
      loanAddress,
      ethers.utils.parseEther("100", 18)
    );

    await tx1.wait(1);

    const tx2 = await loanContract.approvedai();
    tx2.wait(1);

    const approve = await daiContract.approve(
      pool,
      ethers.constants.MaxUint256
    );

    const allowance = await daiContract.allowance(DAI_HOLDER, pool);

    const variableDebtToken = await ethers.getContractAt(
      "IVariableDebtToken",
      "0x786dBff3f1292ae8F92ea68Cf93c30b34B1ed04B",
      signer
    );

    const approveDelegation = await variableDebtToken
      .connect(signer)
      .approveDelegation(
        loanContract.address,
        ethers.utils.parseEther("10", 18)
      );

    await approveDelegation.wait(1);
  });
});

async function deployMock(name) {
  const Mock = await ethers.getContractFactory(name);
  return await Mock.deploy();
}
