const crypto = require('crypto')
const MerkleTree = require('./merkle.js');

class Block {
    constructor(previousHash, timestamp, transactions, nonce=0) {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.merkleroot = this.calculateMerkleRoot();
        this.nonce = nonce;
        this.hash = this.calculateHash();
    }

    calculateMerkleRoot() {
        // convert object to string
        const txData = this.transactions.map(tx => JSON.stringify(tx));

        // create merkle tree
        const merkleTree = new MerkleTree(txData);
        return merkleTree.merkleroot;
    }

    calculateHash() {
        // concat header data
        const data = this.previousHash+this.timestamp+this.merkleroot+this.nonce;
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    mineBlock(difficulty) {
        // Find a nonce with difficulty consecutive '0's.
        const zeros = '0'.repeat(difficulty);
        while(!this.hash.startsWith(zeros)) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log(`block mined: ${this.hash}`);
    }
}

module.exports = Block;