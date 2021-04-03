var Test = require("../config/testConfig.js");
const truffleAssert = require("truffle-assertions");

contract("TestERC721Mintable", (accounts) => {
  let config;
  before("setup contract", async () => {
    config = await Test.Config(accounts);
  });

  describe("match erc721 spec", function () {
    before(async function () {
      // TODO: mint multiple tokens
      for (let i = 0; i <= 10; i++) {
        await config.chimToken721.mint(config.account_one, i, {
          from: config.owner,
        });
      }
    });

    it("should return total supply", async function () {
      const totalSupply = await config.chimToken721.totalSupply();
      assert.equal(parseInt(totalSupply), 11, "Total supply is not matching");
    });

    it("should get token balance", async function () {
      const balance = await config.chimToken721.balanceOf(config.account_one);
      assert.equal(parseInt(balance), 11, "Incorrect token balance");
    });

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it("should return token uri", async function () {
      let expectedTokenUri = `${config.baseTokenURI}1`;

      let tokenUri = await config.chimToken721.tokenURI.call(1, {
        from: config.owner,
      });
      assert.equal(tokenUri, expectedTokenUri, "Token Uri doesn't match");
    });

    it("should transfer token from one owner to another", async function () {
      const transaction = await config.chimToken721.transferFrom(
        config.account_one,
        config.account_two,
        1,
        {
          from: config.account_one,
        }
      );
      truffleAssert.eventEmitted(transaction, "Transfer", (ev) => {
        return (
          ev.from === config.account_one &&
          ev.to === config.account_two &&
          ev.tokenId.toNumber() === 1
        );
      });
    });
  });

  describe("have ownership properties", function () {
    it("should fail when minting when address is not contract owner", async function () {
      await truffleAssert.reverts(
        config.chimToken721.mint(config.account_two, 12, {
          from: config.account_one,
        })
      );
    });

    it("should return contract owner", async function () {
      let contractOwner = await config.chimToken721._owner.call();
      assert.equal(
        contractOwner,
        config.owner,
        "Error: Contract owner doesn't match"
      );
    });
  });
});
