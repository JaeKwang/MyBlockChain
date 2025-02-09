const P2P = require('./BlockChain/network'); // P2P 네트워크 클래스
const { Transaction } = require('./BlockChain/transactions.js')
const Wallet = require('./BlockChain/wallet.js')

// 테스트용 노드 생성
const node1 = new P2P(5001);
const node2 = new P2P(5002);
const node3 = new P2P(5003);

// 노드 연결 테스트
console.log("\n Connecting nodes...");
node2.connectToPeer('ws://localhost:5001');
node3.connectToPeer('ws://localhost:5001');

// 거래 생성
const wallet1 = new Wallet();
const wallet2 = new Wallet();
const tx1 = new Transaction(wallet1.publicKey, wallet2.publicKey, 10)
wallet1.signTransaction(tx1);
node1.blockchain.addTransaction(tx1);

// 새로운 블록 생성 및 추가
node1.blockchain.mineBlock();

// 네트워크에 전파
console.log("\n Broadcasting new block...");
node1.broadcastBlock();

setTimeout(() => {
    console.log("\n Checking blockchain synchronization...");

    console.log("\n Node 1 Blockchain:", JSON.stringify(node1.blockchain.chain, null, 2));
    console.log("\n Node 2 Blockchain:", JSON.stringify(node2.blockchain.chain, null, 2));
    console.log("\n Node 3 Blockchain:", JSON.stringify(node3.blockchain.chain, null, 2));

    if (
        JSON.stringify(node1.blockchain.chain) === JSON.stringify(node2.blockchain.chain) &&
        JSON.stringify(node2.blockchain.chain) === JSON.stringify(node3.blockchain.chain)
    ) {
        console.log("\n Blockchain is synchronized across all nodes!");

        console.log("\n Node 1 Blockchain:", JSON.stringify(node1.blockchain.chain, null, 2));
        console.log("\n Node 2 Blockchain:", JSON.stringify(node2.blockchain.chain, null, 2));
        console.log("\n Node 3 Blockchain:", JSON.stringify(node3.blockchain.chain, null, 2));
    } else {
        console.log("\n Blockchain is NOT synchronized!");
    }
}, 1000);

