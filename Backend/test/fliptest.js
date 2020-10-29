const Flip = artifacts.require("Flip");
const truffleAssert = require("truffle-assertions");

contract("Flip", async function(accounts){

  let instance;

  before(async function() {
    instance = await Flip.deployed();
  });

  it("should return no ammount or double the ammount sent", async function(){

    let initialBalance = parseInt(await instance.balance());
    let betAmmount = parseInt(web3.utils.toWei('0.1',"ether"));

    await instance.flipCoin({value: betAmmount, from: accounts[1]});

    let finalBalance = parseInt(await instance.balance());
    
    console.log("bet ammount: ", betAmmount);

    console.log("initial balance: ", initialBalance);
    console.log("final balance: ", finalBalance);

    console.log("positive balance: ", (initialBalance - betAmmount));
    console.log("negative balance: ", (initialBalance + betAmmount));

    assert(finalBalance === (initialBalance - betAmmount) || finalBalance === (initialBalance + betAmmount), "contract balance didn't change");
  });
});
