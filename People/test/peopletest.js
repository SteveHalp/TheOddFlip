const People = artifacts.require("People");
const truffleAssert = require("truffle-assertions");

contract("People", async function(accounts){

  let instance;

  before(async function() {
    instance = await People.deployed();
  });

  it("shouldn't create a person with age over 150 years", async function(){
    await truffleAssert.fails(instance.createPerson("Bob", 200, 190, {value: web3.utils.toWei('1',"ether")}), truffleAssert.ErrorType.REVERT);
  });

  it("shouldn't create a person without payment", async function(){
    await truffleAssert.fails(instance.createPerson("Bob", 50, 190), truffleAssert.ErrorType.REVERT);
  });

  it("should set senior status correctly", async function(){
    await instance.createPerson("Bob", 65, 190, {value: web3.utils.toWei('1',"ether")});

    let result = await instance.getPerson();
    assert(result.senior === true, "Senior level not set");
  });

  it("should set age correctly", async function(){
    let result = await instance.getPerson();
    assert(result.age.toNumber() === 65, "Age not set correctly");
  });

  it("shouldn't allow non-owner to detele person", async function(){
    await truffleAssert.fails(instance.deletePerson(accounts[0], {from: accounts[1]}), truffleAssert.ErrorType.REVERT);

    let result = await instance.getPerson();

    console.log("result:", result);
    console.log("age of queried person:", result.age.toNumber());

    assert(result.age.toNumber() !== 0, "Person deleted by non-owner");
  });

  it("should allow only owner to detele person", async function(){
    await instance.deletePerson(accounts[0]);

    let result = await instance.getPerson();

    console.log("age of queried person:", result.age.toNumber());

    assert(result.age.toNumber() === 0, "Person not deleted by owner");
  });

  it("balance of contract reflected by public field must be equal to balance reported by the blockchain", async function(){
    await instance.createPerson("Jhon", 31, 180, {value: web3.utils.toWei('1',"ether")});

    let blockchainBalance = parseInt(await web3.eth.getBalance(People.address));
    let contractBalance = parseInt(await instance.balance());

    console.log("balance in contract:", contractBalance);
    console.log("balance on blockchain:", blockchainBalance);

    assert(contractBalance === blockchainBalance, "balances are not equal");
  });

  it("should increase balance of contract when person is created", async function(){
    let initialBalance = parseInt(await instance.balance());

    await instance.createPerson("Jhon", 31, 180, {value: web3.utils.toWei('1',"ether")});

    let finalBalance = parseInt(await instance.balance());

    console.log("initial balance:", initialBalance);
    console.log("final balance:", finalBalance);

    assert(initialBalance === finalBalance - web3.utils.toWei('1',"ether"), "balances are not equal");
  });

  it("withdrawal from contract balance leaves no funds in the contract, while the owner contract blance increases accordingly", async function(){
    let initialContractBalance = parseInt(await instance.balance());
    let initialAccountBalance = parseInt(await web3.eth.getBalance(accounts[0]));

    console.log("initial contract balance:", initialContractBalance);
    console.log("initial account balance:", initialAccountBalance);

    instance.withdrawAll();

    let finalContractBalance = parseInt(await instance.balance());
    let finalAccountBalance = parseInt(await web3.eth.getBalance(accounts[0]));

    console.log("final contract balance:", finalContractBalance);
    console.log("final account balance:", finalAccountBalance);
  });

  it("should allow withdrawal from contract balance only by contract owner", async function(){
    instance = await People.new();

    await truffleAssert.passes(instance.withdrawAll());
  });

  it("should fail withdrawal from contract balance by non-owner of contract", async function(){
      instance = await People.new();

      await truffleAssert.fails(instance.withdrawAll({from: accounts[1]}), truffleAssert.ErrorType.REVERT);
  });
});
