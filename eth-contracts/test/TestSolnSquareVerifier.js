var Test = require("../config/testConfig.js");
const truffleAssert = require("truffle-assertions");

contract("TestSolnSquareVerifier", (accounts) => {
  let config;
  before("setup contract", async () => {
    config = await Test.Config(accounts);
  });

  // Test if a new solution can be added for contract - SolnSquareVerifier

  it("should add new solution", async function () {
    let transaction = await config.soluntionSquareVerifier.addSolution(
      config.proof.a,
      config.proof.b,
      config.proof.c,
      config.inputs,
      { from: config.owner }
    );
    truffleAssert.eventEmitted(transaction, "SolutionAdded", (ev) => {
      return (
        ev.solutionIndex.toNumber() === 1 && ev.solutionAddress === config.owner
      );
    });
  });

  it("should not add duplicate solution", async function () {
    await truffleAssert.reverts(
      config.soluntionSquareVerifier.addSolution(
        config.proof.a,
        config.proof.b,
        config.proof.c,
        config.inputs,
        { from: config.owner }
      )
    );
  });

  // Test if an ERC721 token can be minted for contract - SolnSquareVerifier

  it("mintNewNFT", async function () {
    let transaction;
    try {
      transaction = await config.soluntionSquareVerifier.mintNewNFT(
        config.inputs[0],
        config.inputs[1],
        config.account_one,
        { from: config.owner }
      );
    } catch (err) {
      console.log(err);
    }

    truffleAssert.eventEmitted(transaction, "Transfer", (ev) => {
      return (
        ev.from === "0x0000000000000000000000000000000000000000" &&
        ev.to === config.account_one
      );
    });
  });
});
