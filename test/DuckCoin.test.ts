import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("DuckCoin Tests", function () {
  async function deployDuckcoinFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const DuckCoin = await hre.ethers.getContractFactory("DuckCoin");
    const duckCoin = await DuckCoin.deploy();

    return { duckCoin, owner, otherAccount };
  }

  it("Should have correct name", async function () {
    const { duckCoin, owner, otherAccount } = await loadFixture(deployDuckcoinFixture);
    const name = await duckCoin.name();

    expect(name).to.equal("DuckCoin");
  });

  it("Should have correct symbol", async function () {
    const { duckCoin, owner, otherAccount } = await loadFixture(deployDuckcoinFixture);
    const symbol = await duckCoin.symbol();

    expect(symbol).to.equal("DUC");
  });

  it("Should have correct decimal", async function () {
    const { duckCoin, owner, otherAccount } = await loadFixture(deployDuckcoinFixture);
    const decimals = await duckCoin.decimals();

    expect(decimals).to.equal(18);
  });

  it("Should have correct total supply", async function () {
    const { duckCoin, owner, otherAccount } = await loadFixture(deployDuckcoinFixture);
    const totalSupply = await duckCoin.totalSupply();

    expect(totalSupply).to.equal(1000n * 10n ** 18n);
  });

  it("Should get balance", async function () {
    const { duckCoin, owner, otherAccount } = await loadFixture(deployDuckcoinFixture);
    const balance = await duckCoin.balanceOf(owner.address);

    expect(balance).to.equal(1000n * 10n ** 18n);
  }); 

  it("Should transfer", async function () {
    const { duckCoin, owner, otherAccount } = await loadFixture(deployDuckcoinFixture);
    
    const balanceOwnerBefore = await duckCoin.balanceOf(owner.address);
    const balanceOtherBefore = await duckCoin.balanceOf(otherAccount.address);

    await duckCoin.transfer(otherAccount.address, 1n);

    const balanceOwnerAfter = await duckCoin.balanceOf(owner.address);
    const balanceOtherAfter = await duckCoin.balanceOf(otherAccount.address);

    expect(balanceOwnerBefore).to.equal(1000n * 10n ** 18n);
    expect(balanceOwnerAfter).to.equal((1000n * 10n ** 18n) -1n);

    expect(balanceOtherBefore).to.equal(0);
    expect(balanceOtherAfter).to.equal(1);
  }); 

  it("Should not transfer", async function () {
    const { duckCoin, owner, otherAccount } = await loadFixture(deployDuckcoinFixture);
    
    const instance = duckCoin.connect(otherAccount);
    
    await expect(instance.transfer(owner.address, 1n))
    .to.be.revertedWithCustomError(duckCoin, "ERC20InsufficientBalance");
  });

  it("Should approve", async function () {
    const { duckCoin, owner, otherAccount } = await loadFixture(deployDuckcoinFixture);
    
    await duckCoin.approve(otherAccount.address, 1n);

    const value = await duckCoin.allowance(owner.address, otherAccount.address);

    expect(value).to.equal(1);
  });

  it("Should transfer from", async function () {
    const { duckCoin, owner, otherAccount } = await loadFixture(deployDuckcoinFixture);
    
    const balanceOwnerBefore = await duckCoin.balanceOf(owner.address);
    const balanceOtherBefore = await duckCoin.balanceOf(otherAccount.address);

    await duckCoin.approve(otherAccount.address, 10n);
    
    const instance = duckCoin.connect(otherAccount);
    await instance.transferFrom(owner.address, otherAccount.address, 5n);

    const balanceOwnerAfter = await duckCoin.balanceOf(owner.address);
    const balanceOtherAfter = await duckCoin.balanceOf(otherAccount.address);

    const allowance = await duckCoin.allowance(owner.address, otherAccount.address);

    expect(balanceOwnerBefore).to.equal(1000n * 10n ** 18n);
    expect(balanceOwnerAfter).to.equal((1000n * 10n ** 18n) - 5n);
    expect(balanceOtherBefore).to.equal(0);
    expect(balanceOtherAfter).to.equal(5);
    expect(allowance).to.equal(5);
  });

  it("Should not transfer from (balance)", async function () {
    const { duckCoin, owner, otherAccount } = await loadFixture(deployDuckcoinFixture);
    
    const instance = duckCoin.connect(otherAccount);
    await instance.approve(owner.address, 1n);
    
    await expect(duckCoin.transferFrom(otherAccount.address, otherAccount.address, 1n))
    .to.be.revertedWithCustomError(duckCoin, "ERC20InsufficientBalance");
  });

  it("Should not transfer from (allowance)", async function () {
    const { duckCoin, owner, otherAccount } = await loadFixture(deployDuckcoinFixture);
    
    const instance = duckCoin.connect(otherAccount);
    
    await expect(instance.transferFrom(otherAccount.address, owner.address, 1n))
    .to.be.revertedWithCustomError(duckCoin, "ERC20InsufficientAllowance");
  });

});