const Blockchain = require('./BlockChain/blockchain.js')
const { Transaction } = require('./BlockChain/transactions.js')
const Wallet = require('./BlockChain/wallet.js')

// 거래를 블록에 추가하여 채굴
const localChain = new Blockchain()
localChain.addTransaction(new Transaction(0x01, 0x02, 100))
localChain.addTransaction(new Transaction(0x02, 0x01, 50))
localChain.mineBlock();

localChain.addTransaction(new Transaction(0x03, 0x04, 10))
localChain.addTransaction(new Transaction(0x03, 0x01, 500))
localChain.mineBlock();

console.log(localChain);
console.log(localChain.getLatestBlock());

// 거래를 지갑으로 sign & verify
console.log('\n=========================================\n');
const wallet1 = new Wallet();
const wallet2 = new Wallet();
const tx = new Transaction(wallet1.publicKey, wallet2.publicKey, 10)
wallet1.signTransaction(tx);
console.log("Transaction verification: ", wallet1.verifyTransaction(tx));

