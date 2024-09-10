import express from "express";
import cors from "cors";
import Web3 from "web3";
import { depositABI } from "./abi.js";
import depositRoutes from "./routes/deposit.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import Deposit from './models/Deposits.js';
dotenv.config();

const app = express();
app.use(cors());

const alchemyWsUrl = process.env.ALCHEMY_LINK;
const beaconDepositContract = process.env.BEACON_CONTRACT;

const web3 = new Web3(new Web3.providers.WebsocketProvider(alchemyWsUrl));

const wsProvider = web3.eth.currentProvider;

wsProvider.on('connect', () => {
    console.log('WebSocket connected!');
    web3.eth.subscribe('pendingTransactions', (error, txHash) => {
        if (error) {
            console.error('Error subscribing to pending transactions:', error);
        } else {
            console.log('Pending transaction hash:', txHash);
            web3.eth.getTransaction(txHash, (err, tx) => {
                if (err) {
                    console.error('Error fetching transaction details:', err);
                } else {
                    console.log('Transaction details:', tx);
                    if (tx && tx.to && tx.to.toLowerCase() === beaconDepositContract.toLowerCase()) {
                        console.log('Transaction to Beacon Deposit Contract:', tx);
                    }
                }
            });
        }
    });
});

wsProvider.on('error', (error) => {
    console.error('WebSocket error:', error);
});

wsProvider.on('disconnect', (event) => {
    console.log('WebSocket disconnected:', event);
});

web3.eth.subscribe('pendingTransactions', (error, txHash) => {
    if (error) {
        console.error('Error subscribing to pending transactions:', error);
    } else {
        console.log('Pending transaction hash:', txHash);
        web3.eth.getTransaction(txHash, (err, tx) => {
            if (err) {
                console.error('Error fetching transaction details:', err);
            } else {
                console.log('Transaction details:', tx);
                if (tx && tx.to && tx.to.toLowerCase() === beaconDepositContract.toLowerCase()) {
                    console.log('Transaction to Beacon Deposit Contract:', tx);
                }
            }
        });
    }
});

web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
    if (error) {
        console.error('Error subscribing to new block headers:', error);
    } else {
        console.log('New block detected:', blockHeader.number);

        // Fetch full block with transactions
        web3.eth.getBlock(blockHeader.number, true, (err, block) => {
            if (err) {
                console.error('Error fetching block details:', err);
            } else {
                console.log(`Block #${block.number} has ${block.transactions.length} transactions.`);

                // Iterate over transactions to find deposits to Beacon Deposit Contract
                block.transactions.forEach(tx => {
                    if (tx.to && tx.to.toLowerCase() === beaconDepositContract.toLowerCase()) {
                        console.log('Transaction to Beacon Deposit Contract detected:', tx);
                        handleDeposit(tx);
                    }
                });
            }
        });
    }
});


const contract = new web3.eth.Contract(depositABI, beaconDepositContract);

contract.events.DepositEvent({}, (error, event) => {
    if (error) {
        console.error('Error subscribing to DepositEvent:', error);
    } else {
        console.log('DepositEvent:', event);
        web3.eth.getTransaction(event.transactionHash, (err, tx) => {
            if (err) {
                console.error('Error fetching transaction details:', err);
            } else {
                console.log('Transaction depositing Ether to Beacon Deposit Contract:', tx);
                if (tx && tx.to && tx.to.toLowerCase() === beaconDepositContract.toLowerCase() && tx.value && tx.value > 0) {
                    console.log('Transaction depositing Ether to Beacon Deposit Contract:', tx);
                }
            }
        });
    }
});

web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
    if (error) {
        console.error('Error subscribing to new blocks:', error);
    } else {
        console.log('New block detected:', blockHeader.number);
        web3.eth.getBlock(blockHeader.number, true, (err, block) => {
            if (err) {
                console.error('Error fetching block details:', err);
            } else {
                console.log(`Block #${block.number} has ${block.transactions.length} transactions.`);
                block.transactions.forEach(tx => {
                    if (tx.to && tx.to.toLowerCase() === beaconDepositContract.toLowerCase()) {
                        console.log('Transaction to Beacon Deposit Contract detected:', tx);
                        handleDeposit(tx);
                    }
                });
            }
        });
    }
});

const handleDeposit = async (tx) => {
    try {
        // Extract relevant fields from the transaction
        const depositData = {
            blockNumber: tx.blockNumber,
            blockTimestamp: new Date(), // You might need to fetch the timestamp from the block if it's not available in the tx object
            fee: tx.gasPrice ? tx.gasPrice * tx.gas : 0, // We know the gas fee is gas * gasprice
            hash: tx.hash,
            pubkey: tx.from // Assuming the sender's address is used as pubkey
        };

        const deposit = new Deposit(depositData);
        await deposit.save();

        console.log('Deposit saved successfully:', deposit.hash);
    } catch (error) {
        console.error('Error handling deposit:', error);
    }
};


app.get("/", (req, res) => {
    res.status(200).send("hii");
});

app.use("/track", depositRoutes);

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`Server running at ${process.env.PORT}.`))
    }).catch((error) => console.log(`${error} did not connect`))
