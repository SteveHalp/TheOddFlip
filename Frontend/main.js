var web3 = new Web3(Web3.givenProvider);
var contractInstance, acc;

$(document).ready( async function() {
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi, "0xC9aF25ACb8CBb8a0061a04883311C5412152ca03", {from: accounts[0]})

      console.log(contractInstance);
    })
    .then(function(accounts){
      getUserBalance();
    });

    acc = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    $("#bet_button").click(placeBet);

});

function placeBet() {
  var betAmmount = $("#bet_input").val();

  //This sort of validation I would usually do in the backend. As some cheeky user might just remove this bit of code using the browser inspector.
  //In the same time, I saw some solutions in Solidity for converting strings to int or checking if strings can be converted to int. But to me personally it would seem as a waste of gas to perfrom such operations in a smart contracts.
  //Ideally I would have a middle layer in the backed that would actually be called by the front-end, which would execute all necessary validation on the input data and only afterwards, if data is valid, I would call the smart contract.
  if (isNaN(betAmmount)){
    alert("Please provide the input as a number");
    return false;
  }

  var config = {
    value: web3.utils.toWei(betAmmount,"ether")
  };

  contractInstance.methods.flipCoin().send(config)
    .then(function() {;
      contractInstance.methods.getUserDetails().call()
        .then(function(res){
            $("#eth_ammount").text(res.balance);
          });
      });
}

function getUserBalance(){
  // let balance = web3.fromWei(web3.eth.getBalance(accounts[0]));
  // $("#eth_ammount").text(balance);
  contractInstance.methods.getUserDetails().call().then(function(res){
    // let balance = new web3.utils.BN(res.balance);
    // let balance = web3.utils.fromWei(res.balance, "ether");
    // let balance = res.balance;
    let balance;
    web3.eth.getBalance(acc[0]).then((bal) => {
        balance = web3.utils.fromWei(bal);
        $("#eth_ammount").text(balance);
      });
    let address = acc[0];

    $("#eth_address").text(address);
  });
}
