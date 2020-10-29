const Flip = artifacts.require("Flip");

module.exports = function(deployer) {
  deployer.deploy(Flip, {value: web3.utils.toWei('3',"ether")});
};
