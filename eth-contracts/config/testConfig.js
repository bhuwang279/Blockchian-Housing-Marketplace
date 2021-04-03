var ChimToken721 = artifacts.require("ChimToken721");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
var Verifier = artifacts.require("Verifier");
var proofJSON = require("./proof.json"); //with path

var Config = async function (accounts) {
  const owner = accounts[0];
  const account_one = accounts[1];
  const account_two = accounts[1];

  const proof = proofJSON["proof"];
  const inputs = proofJSON["inputs"];
  const symbol = "DRUK";
  const name = "ChimToken";
  const baseTokenURI =
    "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
  const firstTokenId = 1;
  const lastTokenId = 10;

  let chimToken721 = await ChimToken721.new(name, symbol, { from: owner });
  let verifier = await Verifier.new({ from: owner });
  let soluntionSquareVerifier = await SolnSquareVerifier.new(
    verifier.address,
    name,
    symbol,
    { from: owner }
  );

  return {
    owner,
    account_one,
    account_two,
    proof,
    inputs,
    name,
    symbol,
    baseTokenURI,
    firstTokenId,
    lastTokenId,
    chimToken721,
    verifier,
    soluntionSquareVerifier,
  };
};

module.exports = {
  Config: Config,
};
