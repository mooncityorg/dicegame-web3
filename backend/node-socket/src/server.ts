import express from 'express';
import http from 'http';
import url from 'url';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import { Server } from 'socket.io';
import { ADMIN_PUBKEY } from './config'
import path from 'path';

import {
  AccountInfo,
  Connection,
  LAMPORTS_PER_SOL,
  PartiallyDecodedInstruction,
  ParsedInstruction,
  PublicKey,
  ParsedConfirmedTransaction,
  ConfirmedSignatureInfo,
  TokenBalance
} from "@solana/web3.js";

import { saveDump, loadDump } from './util'

const DUMP_PATH = __dirname + '/../dumps';
const app = express();
const port = process.env.PORT || 3002;
const SOLANA_DEVNET = 'https://api.devnet.solana.com';
const SOLANA_MAINNET = "https://api.mainnet-beta.solana.com";
const SOLANA_MAINNET_DATAHUBRPC = "https://solana--mainnet.datahub.figment.io/apikey/ba11960d832a6415baeb2ae7e5f6acd3";
// const index = fs.readFileSync('/home/solana-wallet-nft-track/public/test.html');
const PROGRAM_ID = "HeA7Q5iBz3rkdjhyTHApyVFuks7uTM7brGidxVfwgqJM";
const ADMIN_WALLET = 'SeUpqkDqRYD4jf3Mi2TQ2bceE77cvvLZDLtqyURkcJ6';
const VAULT_AUTHORITY_SEED = "vault-authority";
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.post('/getStatDetailInfo', async (req, res) => {
  try {
    var address = req.body.address;
    console.log('recevied address : ', address)
    if (ADMIN_PUBKEY.indexOf(address) === -1) {
      res.send(JSON.stringify(-1));
      return;
    }

    var statGame = loadDump(`/statGame.json`);
    if (!statGame) statGame = {
      totalBetted: 0,
      playerWonSol: 0,
      PlayerLostSol: 0,
      players: 0,
      playerWonNumbers: 0,
      playerLostNumbers: 0,
    };

    res.send(JSON.stringify(statGame));



  } catch (err) {
    console.log(`send stat detail info sending error occured: ${err}`);
    res.send(-100);

  }

});

app.post('/getStatData', async (req, res) => {
  try {
    console.log('get stat data request accepted')
    var txsData = loadDump(`/txDump.json`);
    if (!txsData) txsData = {};
    var statGame = loadDump(`/statGame.json`);
    if (!statGame) statGame = {
      players: 0,
      totalBetted: 0
    };

    var playTxs: any[] = [];
    for (let item in txsData) {

      let temp = txsData[item];
      temp['transaction'] = item;
      playTxs.push(temp);


    }
    var tmp = playTxs.slice(-12).sort((item1, item2) => {
      return item1.timestamp > item2.timestamp ? -1 : 1
    });

    var result = {
      playTxs: tmp,
      statGame: statGame
    }

    io.emit('update_stat_data', result);

    res.send(JSON.stringify(result));
  } catch (err) {
    console.log(`send stat data processing error occured: ${err}`);
    res.send(-1);

  }
});

io.on('connection', async (socket) => {
  console.log("New Connection Established");

  socket.on('disconnect', () => {
    console.log("One socket is disonnected");
  });
})

server.listen(port, () => {
  console.log(`server is listening on ${port}`);
  attachRewardTransactionListener(io);
  return;
});

const attachRewardTransactionListener = async (io: Server) => {
  const connection = new Connection(SOLANA_MAINNET_DATAHUBRPC, "confirmed");


  const [rewardVault, vaultBump] = await PublicKey.findProgramAddress(
    [Buffer.from(VAULT_AUTHORITY_SEED)],
    new PublicKey(PROGRAM_ID)
  );
  console.log(rewardVault.toBase58())

  // var sigs: any = [];

  connection.onLogs(rewardVault, async (logs, ctx) => {
    // sigs.push(logs.signature)  
    // if (sigs.length > 0) {
    // console.log( sigs[0]);
    var sign = logs.signature;
    if (sign === '1111111111111111111111111111111111111111111111111111111111111111') return;

    var testtxs = await connection.getParsedTransaction(sign, 'finalized');
    do {
      if (testtxs === null) {
        await sleep(10000);
        console.log('when set recent activities from signs null transaction occoured. retry... for sig: ', sign, '>>>>>>>>>', testtxs);
        testtxs = await connection.getParsedTransaction(sign, 'finalized');
      } else {
        break;
      }

    } while (true);
    console.log(testtxs.transaction.signatures[0])
    var txsData = loadDump(`/txDump.json`);
    if (!txsData) txsData = {};
    var player = testtxs?.transaction.message.accountKeys[0].pubkey.toBase58();
    var timestamp = testtxs?.blockTime;
    var rewardVaultIdx = -1;
    var balance = 0;
    for (let i = 0; i < testtxs?.transaction.message.accountKeys.length; i++) {
      if (testtxs?.transaction.message.accountKeys[i].pubkey.toBase58() === rewardVault.toBase58()) {
        rewardVaultIdx = i;
        break;
      }
    }
    if (rewardVaultIdx === -1) {
      balance = 0;
    } else {
      let postBalance = (testtxs.meta?.postBalances[rewardVaultIdx]) as number;//(testtxs?.meta.postBalances[rewardVaultIdx] - testtxs?.meta.preBalances[rewardVaultIdx]) / LAMPORTS_PER_SOL;
      let preBalance = (testtxs.meta?.preBalances[rewardVaultIdx]) as number;
      balance = (postBalance - preBalance) / LAMPORTS_PER_SOL;
    }
    txsData[sign] = {
      player: player,
      timestamp: timestamp,
      balance: -balance,
    }
    saveDump(`/txDump.json`, txsData);
    var statGame = loadDump(`/statGame.json`);
    if (!statGame) statGame = {
      totalBetted: 0,
      playerWonSol: 0,
      PlayerLostSol: 0,
      players: 0,
      playerWonNumbers: 0,
      playerLostNumbers: 0,

    };
    statGame.players += 1;
    statGame.totalBetted += Math.abs(balance);
    if (balance > 0) {
      statGame.playerWonSol = statGame.playerWonSol;
      statGame.PlayerLostSol += Math.abs(balance);
      statGame.playerWonNumbers = statGame.playerWonNumbers;
      statGame.playerLostNumbers += 1;
    } else {
      statGame.playerWonSol += Math.abs(balance);
      statGame.PlayerLostSol = statGame.PlayerLostSol;
      statGame.playerWonNumbers += 1;
      statGame.playerLostNumbers = statGame.playerLostNumbers;
    }
    saveDump(`/statGame.json`, statGame);

    var playTxs: any[] = [];
    for (let item in txsData) {

      let temp = txsData[item];
      temp['transaction'] = item;
      playTxs.push(temp);


    }
    var tmp = playTxs.slice(-12).sort((item1, item2) => {
      return item1.timestamp > item2.timestamp ? -1 : 1
    });
    console.log('last item  :', tmp[0])

    var result = {
      playTxs: tmp,
      statGame: statGame
    }
    io.emit('update_stat_data', result);

    // sigs = [];

    // }
  });

}

export const sleep = (time: number) => {
  return new Promise(resolve => setTimeout(resolve, time))
}
