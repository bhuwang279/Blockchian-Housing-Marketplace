// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

var Test = require("../config/testConfig.js");
const truffleAssert = require("truffle-assertions");

contract("TestSquareVerifier", (accounts) => {
  let config;
  before("setup contract", async () => {
    config = await Test.Config(accounts);
  });

  // Test verification with correct proof

  it("test verification with correct proof", async function () {
    let verified = await config.verifier.verifyTx.call(
      config.proof.a,
      config.proof.b,
      config.proof.c,
      config.inputs
    );
    assert.equal(verified, true, "Err : proof is invalid");
  });

  // Test verification with incorrect proof

  it("test verification with incorrect proof", async function () {
    let verified = await config.verifier.verifyTx.call(
      config.proof.c,
      config.proof.b,
      config.proof.a,

      config.inputs
    );
    assert.equal(verified, false, "Err : proof is valid");
  });

  //   it("should not add duplicate solution", async function () {
  //     await truffleAssert.reverts(
  //       config.soluntionSquareVerifier.addSolution(
  //         config.proof.a,
  //         config.proof.b,
  //         config.proof.c,
  //         config.inputs,
  //         { from: config.owner }
  //       )
  //     );
  //   });

  //   it("mintNewNFT", async function () {
  //     let transaction;
  //     try {
  //       transaction = await config.soluntionSquareVerifier.mintNewNFT(
  //         config.inputs[0],
  //         config.inputs[1],
  //         config.account_one,
  //         { from: config.owner }
  //       );
  //     } catch (err) {
  //       console.log(err);
  //     }

  //     truffleAssert.eventEmitted(transaction, "Transfer", (ev) => {
  //       return (
  //         ev.from === "0x0000000000000000000000000000000000000000" &&
  //         ev.to === config.account_one
  //       );
  //     });
  //   });
});
