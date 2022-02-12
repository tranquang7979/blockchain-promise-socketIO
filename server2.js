var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use("/scripts", express.static(__dirname + "/node_modules/web3.js-browser/build/"));
app.listen(3000);

app.get("/", function (req, res) {
    res.render("master");
});

// Web3
var Web3 = require("web3");
let http_bsc_testnet = "https://data-seed-prebsc-1-s1.binance.org:8545/";
let web3 = new Web3(http_bsc_testnet);

/*
var SM_ABI = [{ "inputs": [], "name": "check", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "dongTien", "outputs": [], "stateMutability": "payable", "type": "function" }];
var SM_Address = "0xC2F2766186D7e6e474Ab41B147973E1b18BcAa00";
*/

// tx: 
var checkTrans = (idTran) => {
    return new Promise((resolve, reject) => {
        web3.eth.getTransactionReceipt(idTran)
            .then((data) => {
                if (data == null) {
                    reject("pending");
                } else {
                    resolve(data);
                    // xử lý Frontend (io.sockets.emit) & Backend
                }
            })
            .catch((err) => { reject(err); });
    });
};

function cycleCheckTrans(idTran) {
    checkTrans(idTran)
        .then((data) => {
            console.log(data);
            res.end();
        })
        .catch((err) => {
            setTimeout(() => { }, 100);
        });
}

app.get("/newTransaction/:idTran", function (req, res) {
    var idTran = req.params.idTran;
    cycleCheckTrans(idTran);
});
