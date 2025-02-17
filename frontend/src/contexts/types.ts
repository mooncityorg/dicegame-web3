import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

export interface GlobalPool {
    superAdmin: PublicKey,      // 32
    totalRound: anchor.BN,      // 8
}

export interface GameData {
    playTime: anchor.BN,         // 8
    amout: anchor.BN,           // 8
    rewardAmount: anchor.BN,    // 8
    rand1: anchor.BN,
    rand2: anchor.BN,
    rand3: anchor.BN,
    rand4: anchor.BN,

}

export interface PlayerPool {
    // 8 + 84
    player: PublicKey,               // 32
    round: anchor.BN,                // 8
    gameData: GameData,              // 28
    winTimes: anchor.BN,              // 8
    receivedReward: anchor.BN,        // 8
}
