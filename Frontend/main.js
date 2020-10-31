var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts){
        contractInstance = new web3.eth.Contract(abi, "0x699029e05BB93f8CAA3F4DbF859532586f6b3F3a", {from: accounts[0]});
        console.log(contractInstance);
    });
    $("#bet_button").click(placeBet);
});

function placeBet() {
  // alert("bet palced");
  var betAmmount = $("#bet_input").val();

  var config = {
    value: web3.utils.toWei(betAmmount,"ether")
  };

  contractInstance.methods.flipCoin().send(config);
}
