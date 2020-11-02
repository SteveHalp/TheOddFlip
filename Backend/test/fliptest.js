const Flip = artifacts.require("Flip");
const truffleAssert = require("truffle-assertions");

contract("Flip", async function(accounts){

  let instance;

  before(async function() {
    instance = await Flip.deployed();
    // await instance.sendTransaction({ from: accounts[2], value: web3.utils.toWei("5","ether")})
    // await instance.send(web3.utils.toWei("3","ether"), {from: accounts[0]});
  });

  it("should return no ammount or double the ammount sent", async function(){

    let initialBalance = parseInt(web3.utils.fromWei(await instance.balance(),"milliether"));
    let betAmmount = web3.utils.toWei("10","milliether");

    await instance.flipCoin({value: betAmmount, from: accounts[1]});

    let finalBalance = parseInt(web3.utils.fromWei(await instance.balance(),"milliether"));

    // let initialBalance = await instance.balance();
    // let betAmmount = web3.utils.toWei("10","milliether");
    //
    // await instance.flipCoin({value: betAmmount, from: accounts[1]});
    //
    // let finalBalance =  await instance.balance();

    console.log("bet ammount: ", betAmmount);

    console.log("initial balance: ", initialBalance);
    console.log("final balance: ", finalBalance);

    assert(finalBalance === (initialBalance - betAmmount) || finalBalance === (initialBalance + betAmmount), "contract balance didn't change");
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
  });

  it("should allow withdrawal from contract balance only by contract owner", async function(){
    await truffleAssert.passes(instance.withdrawAll());
  });

  it("should fail withdrawal from contract balance by non-owner of contract", async function(){
    await truffleAssert.fails(instance.withdrawAll({from: accounts[1]}), truffleAssert.ErrorType.REVERT);
  });

  it("should return caller details", async function(){

      let result = await instance.getUserDetails();

      console.log("user balance:", parseInt(result.balance));
      console.log("user address:", result.userAddress);
  });
});
