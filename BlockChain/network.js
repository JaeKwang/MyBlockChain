const WebSocket = require('ws');
const Blockchain = require('./blockchain');

class P2P {
    constructor(port) {
        this.sockets = [];
        this.blockchain = new Blockchain();
        this.server = new WebSocket.Server({port});
        this.server.on('connection', (socket) => this.connectSocket(socket));
        console.log(`connected to ${port}`);
    }

    connectToPeer(peer) {
        const socket = new WebSocket(peer);
        socket.on('open', ()=>this.connectSocket(socket));
        socket.on('error', (err)=>console.error(`failed: ${err}`));
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('new peer!!');
        this.messageHandler(socket);
        this.syncBlockchain(socket);
    }

    messageHandler(socket) {
        socket.on('message', (msg) => {
            const data = JSON.parse(msg);
            switch(data.type) {
                case "CHAIN" :
                    this.handleChainSync(data.chain);
                    break;
                case "NEW_BLOCK" :
                    this.handleNewBlock(data.block);
                    break;
            }
        })
    }

    syncBlockchain(socket) {
        socket.send(JSON.stringify({ type: "CHAIN", chain: this.blockchain.chain }));
    }

    handleChainSync(recvChain) {
        if(recvChain.length > this.blockchain.chain.length) {
            console.log("I got a longer one. Replaing mine");
            this.blockchain.chain = recvChain;
        }
    }
    
    handleNewBlock(recvBlock) {
        // this.blockchain.addTransaction(recvBlock.transactions)
        this.blockchain.addBlock(recvBlock);
        this.broadcastBlock();
    }

    broadcastBlock() {
        this.sockets.forEach((socket) => this.syncBlockchain(socket));
    }
}

module.exports = P2P;