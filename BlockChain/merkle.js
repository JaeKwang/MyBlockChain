const crypto = require('crypto');

class MerkleTree {

    // transactions: stringified array
    constructor(transactions) {
        this.transactions = transactions;
        this.merkleroot = this.calculateRoot(transactions);
    }

    calculateRoot(transactions) {
        if(transactions.length === 0) return '';
        if(transactions.length === 1) return this.hash(transactions[0]);
        
        let layer = transactions.map(tx => this.hash(tx));
        
        // tx 9개 일 경우
        // 1 2 3 4 5 6 7 8 9
        //  12  34  56  78 9
        //    1234   5678  9
        //      12345678   9
        //         123456789
        while(layer.length > 1) {
            let newOne = [];

            for(let i = 0; i < layer.length; i+=2) {
                if(i+1 < layer.length) {
                    newOne.push(this.hash(layer[i] + layer[i+1]));
                } else {
                    newOne.push(layer[i]);
                }
            }

            layer = newOne;
        }

        return layer[0];
    }

    hash(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }
}

module.exports = MerkleTree;