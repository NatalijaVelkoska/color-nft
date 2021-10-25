const { assert } = require("chai");

const Color = artifacts.require("./Color.sol");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("Color", (accounts) => {
  let contract;

  before(async () => {
    contract = await Color.deployed();
  });

  describe("deployment", async () => {
    it("deloys successfully", async () => {
      const address = contract.address;
      console.log(address);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = contract.name;
      console.log(name);
      assert.notEqual(name, "");
    });
  });

  describe("minting", async () => {
    it("creates a new token", async () => {
      const result = await contract.mint("#EC058E");
      const totalSupply = await contract.totalSupply();
      //SUCCESS
      assert.equal(totalSupply, 1);
      console.log(result);

      const event = result.logs[0].args;
      assert.equal(event.tokenId.toNumber(), 1, "id is correct");
      // assert.equal(event.from,'0x000000000000000','from is correct')
      assert.equal(event.to, accounts[0], "to is correct");

      //FAILURE
      await contract.mint("#EC058E").should.be.rejected;
    });
  });

  describe("indexing", async () => {
    it("lists colors", async () => {
      //Mint 3 more tokens
      await contract.mint("#5386E4");
      await contract.mint("#000000");
      await contract.mint("#111111");

      const totalSupply = await contract.totalSupply();

      let color;
      let result = [];

      for (var i = 1; i <= totalSupply; i++) {
        color = await contract.colors(i - 1);
        result.push(color);
        console.log(result);
      }
      console.log(result);
      let expected = ["#EC058E", "#5386E4", "#000000", "#111111"];
      assert.equal(result.join(","), expected.join(","));
    });
  });
});
