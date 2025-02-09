const crypto = require('crypto');

class Transaction {
    constructor(sender, receiver, amount, signature = '') {
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.timestamp = Date.now();
        this.signature = signature;
    }

    signTransaction(privateKey) {
        const sign = crypto.createSign('SHA256');
        sign.update(this.sender + this.receiver + this.amount + this.timestamp);
        this.signature = sign.sign(privateKey, 'hex');
    }
}

class TXPool {
    constructor() {
        this.transactions = [];
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

    getTransaction() {
        return this.transactions;
    }

    clearTransactions() {
        this.transactions = [];
    }
}

module.exports = {Transaction, TXPool}