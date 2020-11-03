const Flip = artifacts.require("Flip");
const truffleAssert = require("truffle-assertions");

contract("Flip", async function(accounts){

  let instance;

  before(async function() {
    instance = await Flip.deployed();
  });

  it("should return no ammount or double the ammount sent", async function(){

    var initialBalance = web3.utils.fromWei(await instance.balance(),"milliether");
    var betAmmount = web3.utils.toWei("10","milliether");

    await instance.flipCoin(1, {value: betAmmount, from: accounts[1]});

    var finalBalance = web3.utils.fromWei(await instance.balance(),"milliether");

    console.log("bet ammount: ", web3.utils.fromWei(betAmmount,"milliether")," milliether");

    console.log("initial balance: ", initialBalance, " milliether");
    console.log("final balance: ", finalBalance, " milliether");

    var difference = Math.abs(initialBalance - finalBalance);

    console.log("difference: ", difference, " milliether");

    assert(
      difference == new Number(web3.utils.fromWei(betAmmount,"milliether")),
      "contract balance didn't change according to a win or loss"
    );
  });

  it("withdrawal from contract balance leaves no funds in the contract, while the owner contract blance increases accordingly", async function(){

    let initialContractBalance = parseInt(web3.utils.fromWei(await instance.balance(),"milliether"));
    let initialAccountBalance = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]),"milliether");

    console.log("initial contract balance:", initialContractBalance);
    console.log("initial account balance:", initialAccountBalance);

    await instance.withdrawAll();

    let finalContractBalance = web3.utils.fromWei(await instance.balance(),"milliether");
    let finalAccountBalance = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]),"milliether");

    console.log("final contract balance:", finalContractBalance);
    console.log("final account balance:", finalAccountBalance);

    assert(finalContractBalance == 0, "contract balance is not zero");
  });

  it("should allow withdrawal from contract balance only by contract owner", async function(){
    await truffleAssert.passes(instance.withdrawAll());
  });

  it("should fail withdrawal from contract balance by non-owner of contract", async function(){
    await truffleAssert.fails(instance.withdrawAll({from: accounts[1]}), truffleAssert.ErrorType.REVERT);
  });
});
