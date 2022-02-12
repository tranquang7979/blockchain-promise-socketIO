const web3 = new Web3(window.ethereum);

$(document).ready(function () {
    check_MetaMask();

    var SM_ABI = [{ "inputs": [], "name": "check", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "dongTien", "outputs": [], "stateMutability": "payable", "type": "function" }];
    var SM_Address = "0xC2F2766186D7e6e474Ab41B147973E1b18BcAa00";
    var SM = web3.eth.Contract(SM_ABI, SM_Address);
    console.log(SM);
    var currentAccount = null;

    $("#btn_ConnectMM").click(function () {
        connect_MetaMask()
            .then((data) => {
                currentAccount = data[0];
                $("#currentAddress").html(currentAccount);
                console.log("Current acccount is: " + currentAccount);
            })
            .catch((err) => { console.log(err); });
    });

    window.ethereum.on("accountsChanged", function (accounts) {
        currentAccount = accounts[0];
        $("#currentAddress").html(currentAccount);
        console.log("Current acccount is: " + currentAccount);
    });

    $("#btnSend").click(function () {
        if (currentAccount != null) {
            SM.methods.dongTien().send({
                from: currentAccount,
                value: 10 ** 16
            }, function (err, transactionHash) {
                if (!err) {
                    console.log(transactionHash);
                    $.get("./newTransaction/" + transactionHash, function () {
                        $("body").append("<h2>" + data + "</h2>");
                    });
                }
            });
        } else {
            alert("Please login MM");
        }
    });

});

async function connect_MetaMask() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    return accounts;
}

function check_MetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        $("#install").hide(0);
        $("#info").show(1000);
    } else {
        console.log('MetaMask is not installed!');
        $("#info").hide(0);
        $("#install").show(1000);
    }
}