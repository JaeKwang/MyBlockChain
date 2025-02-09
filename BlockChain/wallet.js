const crypto = require('crypto');
const {Transaction} = require('./transactions')

class Wallet {
    constructor() {
        const keyPair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: 'top secret',
            },
        });

        this.privateKey = keyPair.privateKey;
        this.publicKey = keyPair.publicKey;
    }

    signTransaction(tx) {
        const sign = crypto.createSign('SHA256');
        sign.update(JSON.stringify(tx));
        sign.end();
        tx.signature = sign.sign({ key: this.privateKey, passphrase: 'top secret' }, 'hex');
        tx.sender = this.publicKey;
    }

    verifyTransaction(tx) {
        const verify = crypto.createVerify('SHA256');
        verify.update(JSON.stringify({
            sender: tx.sender,
            receiver: tx.receiver,
            amount: tx.amount,
            timestamp: tx.timestamp,
            signature: ''
        })).end()

        return verify.verify(tx.sender, tx.signature, 'hex');
    }
}

module.exports = Wallet;