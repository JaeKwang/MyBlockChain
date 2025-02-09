const Block = require('./block.js');
const {Transaction, TXPool} = require('./transactions.js')

class Blockchain {
    constructor() {
        this.chain = [];
        this.difficulty = 2;
        this.createGenesisBlock();
        this.TXPool = new TXPool();
    }

    createGenesisBlock() {
        const tx = new Transaction(0x00, 0x00, 0x00);
        const genesisBlock = new Block('0', Date.now(), [tx]);
        genesisBlock.mineBlock(this.difficulty);
        this.chain.push(genesisBlock);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /* Add Manually
    addBlock(transactions) {
        const newBlock = new Block(this.getLatestBlock().hash, Date.now(), transactions);
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    */

    addTransaction (transaction) {
        this.TXPool.addTransaction(transaction);
    }

    mineBlock() {
        if(this.TXPool.getTransaction().length === 0) {
            console.log("nothing to mine");
            return;
        }
        
        // Create a new block containing transactions
        const newBlock = new Block(this.getLatestBlock().hash, Date.now(), this.TXPool.getTransaction())

        // Mine Pool synchronization is required for transactions that occurred during the mineBlock() function.
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        this.TXPool.clearTransactions();
    }

    isValid() {
        for(let i = 1; i<this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousHash = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash())
                return false;

            if(currentBlock.previousHash != previousHash.hash)
                return false;
        }

        return true;
    }
}

module.exports = Blockchain;