// migrating the appropriate contracts
var Verifier = artifacts.require("./Verifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Verifier).then((instance) => {
    let verifierInstance = instance;
    return deployer.deploy(
      SolnSquareVerifier,
      verifierInstance.address,
      "DrukHousing",
      "DRK271"
    );
  });
};
