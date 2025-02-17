import { web3 } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import {
    AccountInfo,
    LAMPORTS_PER_SOL,
    // Keypair,
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    // TransactionInstruction,
    // sendAndConfirmTransaction
} from '@solana/web3.js';
import {
    // Token, 
    TOKEN_PROGRAM_ID,
    // AccountLayout, 
    // MintLayout, 
    ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { GlobalPool, PlayerPool } from './types';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { IDL } from './dice_gaming';
import { programs } from '@metaplex/js';
import { errorAlert, successAlert } from '../components/toastGroup';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import { PLAYER_POOL_SIZE, GLOBAL_AUTHORITY_SEED, VAULT_AUTHORITY_SEED, PLAYER_SEED, PROGRAM_ID } from './config';
import { reject } from 'lodash';
import { SOLANA_NETWORK } from './config'

export const solConnection = new web3.Connection(web3.clusterApiUrl(SOLANA_NETWORK));

export const initProject = async (
    wallet: WalletContextState
) => {
    if (!wallet.publicKey) return;
    let cloneWindow: any = window;

    try {
        let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
        const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

        const [globalAuthority, bump] = await PublicKey.findProgramAddress(
            [Buffer.from(GLOBAL_AUTHORITY_SEED)],
            program.programId
        );
        const [rewardVault, vaultBump] = await PublicKey.findProgramAddress(
            [Buffer.from(VAULT_AUTHORITY_SEED)],
            program.programId
        );
        console.log(rewardVault);

        const tx = await program.rpc.initialize(
            bump, vaultBump, {
            accounts: {
                admin: wallet.publicKey,
                globalAuthority,
                rewardVault: rewardVault,
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY,
            },
            signers: [],
        });
        await solConnection.confirmTransaction(tx, "confirmed");
        await new Promise((resolve, reject) => {
            solConnection.onAccountChange(globalAuthority, (data: AccountInfo<Buffer> | null) => {
                if (!data) reject();
                resolve(true);
            });
        });

        successAlert("Success. txHash=" + tx);
        return false;
    } catch (error) {
        console.log(error)
    }
}

export const initUserPool = async (
    wallet: WalletContextState
) => {
    let userAddress = wallet.publicKey
    if (!userAddress) return
    let cloneWindow: any = window
    try {
        let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
        const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
        let playerPoolKey = await PublicKey.createWithSeed(
            userAddress,
            "player-pool",
            program.programId,
        );

        console.log(playerPoolKey.toBase58(), 'playerPoolKey--->');

        const [userPoolVault, poolVaultBump] = await PublicKey.findProgramAddress(
            [Buffer.from(PLAYER_SEED), userAddress.toBuffer()],
            program.programId
        );
        console.log('userPoolVault: ', userPoolVault.toBase58());

        let ix = SystemProgram.createAccountWithSeed({
            fromPubkey: userAddress,
            basePubkey: userAddress,
            seed: "player-pool",
            newAccountPubkey: playerPoolKey,
            lamports: await solConnection.getMinimumBalanceForRentExemption(PLAYER_POOL_SIZE),
            space: PLAYER_POOL_SIZE,
            programId: program.programId,
        });
        let ix2 = SystemProgram.transfer({
            fromPubkey: userAddress,
            toPubkey: userPoolVault,
            lamports: 1000000
        })

        const tx = await program.rpc.initializePlayerPool(
            poolVaultBump, {
            accounts: {
                owner: userAddress,
                playerPool: playerPoolKey,
                playerRewardVault: userPoolVault,
                systemProgram: SystemProgram.programId
            },
            instructions: [
                ix, ix2
            ],
            signers: []
        });
        await solConnection.confirmTransaction(tx, "confirmed");

        console.log("Your transaction signature", tx);
    } catch (error) {
        console.log(error)
    }
    // let poolAccount = await program.account.playerPool.fetch(playerPoolKey);
    // console.log('Owner of initialized pool = ', poolAccount.player.toBase58());
}
function toggleClasses(die: any) {
    die.classList.toggle("odd-roll");
    die.classList.toggle("even-roll");
}

export const playGame = async (wallet: WalletContextState, deposit: number, startLoading: Function, endLoading: Function, setGameBalance: Function) => {
    let userAddress = wallet.publicKey as PublicKey
    if (!userAddress) return
    startLoading();
    try {
        console.log(userAddress.toBase58(), 'userAddress')
        let cloneWindow: any = window
        let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
        const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

        const [globalAuthority, bump] = await PublicKey.findProgramAddress(
            [Buffer.from(GLOBAL_AUTHORITY_SEED)],
            program.programId
        );
        console.log('GlobalAuthority: ', globalAuthority.toBase58());

        const [rewardVault, vaultBump] = await PublicKey.findProgramAddress(
            [Buffer.from(VAULT_AUTHORITY_SEED)],
            program.programId
        );
        console.log('RewardVault: ', rewardVault.toBase58());

        const [userPoolVault, poolVaultBump] = await PublicKey.findProgramAddress(
            [Buffer.from(PLAYER_SEED), userAddress.toBuffer()],
            program.programId
        );
        console.log('userPoolVault: ', userPoolVault.toBase58(), deposit);

        let playerPoolKey = await PublicKey.createWithSeed(
            userAddress,
            "player-pool",
            program.programId,
        );
        // let poolAccount = await solConnection.getAccountInfo(playerPoolKey);
        // if (poolAccount === null || poolAccount.data === null) {
        //     console.log('init');
        //     await initUserPool(wallet);
        // }
        const tx = await program.rpc.playGame(
            bump, vaultBump, poolVaultBump, new anchor.BN(deposit * LAMPORTS_PER_SOL), {
            accounts: {
                owner: userAddress,
                playerPool: playerPoolKey,
                globalAuthority,
                playerRewardVault: userPoolVault,
                rewardVault: rewardVault,
                systemProgram: SystemProgram.programId,
            },
            signers: [],
        });

        setGameBalance();
        successAlert("Init processing...!")
        setTimeout(() => {
            successAlert("Funding balance...!")
        }, 5500);
        var setintervalDice = 0;

        setTimeout(() => {
            let eleList = document.querySelectorAll(".die-list") as unknown as any[];
            let dice = [...eleList];
            dice.forEach((die, index) => {

                die.classList.toggle("odd-roll" + (index % 2));
                die.classList.toggle("even-roll" + (index % 2));
            });
            eleList = document.querySelectorAll(".diceDivWrapper") as unknown as any[];
            dice = [...eleList];
            dice.forEach((die, index) => {

                die.classList.remove("transformX-dice");

            });
            setintervalDice = setInterval(function () {
                const eleList = document.querySelectorAll(".die-list") as unknown as any[];
                const dice = [...eleList];
                dice.forEach((die, index) => {
                    die.classList.toggle("odd-roll" + (index % 2));
                    die.classList.toggle("even-roll" + (index % 2));

                });
            }, 750) as unknown as number

        }, 11000);

        await solConnection.confirmTransaction(tx, "finalized");
        // await new Promise((resolve, reject) => {
        //     solConnection.onAccountChange(userAddress, (data: AccountInfo<Buffer> | null) => {
        //         console.log(userAddress.toBase58(), 'userAddress')
        //         if (!data) reject();
        //         console.log('success')
        //         resolve(true);
        //     });
        // })
        let userPoolData = await program.account.playerPool.fetch(playerPoolKey);
        endLoading();
        // successAlert("Successfully Comfirmed!")

        return {
            gameData: userPoolData.gameData,
            setintervalDice: setintervalDice,
        };
    } catch (error) {
        endLoading();
        errorAlert(error as string)
        console.log(error)
    }
}

export const claim = async (wallet: WalletContextState) => {
    let userAddress = wallet.publicKey as PublicKey;
    if (!userAddress) return;
    try {
        let cloneWindow: any = window;
        let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
        const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
        const [globalAuthority, bump] = await PublicKey.findProgramAddress(
            [Buffer.from(GLOBAL_AUTHORITY_SEED)],
            program.programId
        );
        console.log('GlobalAuthority: ', globalAuthority.toBase58());

        const [rewardVault, vaultBump] = await PublicKey.findProgramAddress(
            [Buffer.from(VAULT_AUTHORITY_SEED)],
            program.programId
        );
        console.log('RewardVault: ', rewardVault.toBase58());

        const [userPoolVault, poolVaultBump] = await PublicKey.findProgramAddress(
            [Buffer.from(PLAYER_SEED), userAddress.toBuffer()],
            program.programId
        );
        console.log('userPoolVault: ', userPoolVault.toBase58());

        let playerPoolKey = await PublicKey.createWithSeed(
            userAddress,
            "player-pool",
            program.programId,
        );
        // let userPoolData = await program.account.playerPool.fetch(playerPoolKey);
        // console.log(userPoolData.gameData.rewardAmount.toNumber());

        const tx = await program.rpc.claim(
            vaultBump, poolVaultBump, {
            accounts: {
                owner: userAddress,
                playerPool: playerPoolKey,
                playerRewardVault: userPoolVault,
                rewardVault: rewardVault,
                systemProgram: SystemProgram.programId,
            },
            signers: [],
        });

        await solConnection.confirmTransaction(tx, "singleGossip");
        await new Promise((resolve, reject) => {
            solConnection.onAccountChange(userAddress, (data: AccountInfo<Buffer> | null) => {
                if (!data) reject();
                resolve(true);
            });
        })
        successAlert('Successfully Claim!')
    } catch (error) {
        console.log(error);
        errorAlert(error as string)
    }
}

export const withDraw = async (wallet: WalletContextState, deposit: number) => {
    let userAddress = wallet.publicKey as PublicKey

    if (!userAddress) return
    try {
        let cloneWindow: any = window
        let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())

        const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

        const [userPoolVault, poolVaultBump] = await PublicKey.findProgramAddress(
            [Buffer.from(PLAYER_SEED), userAddress.toBuffer()],
            program.programId
        );

        const tx = await program.rpc.withdraw(
            poolVaultBump, new anchor.BN(deposit * LAMPORTS_PER_SOL), {
            accounts: {
                owner: userAddress,
                playerRewardVault: userPoolVault,
                systemProgram: SystemProgram.programId,
            }
        });

        await solConnection.confirmTransaction(tx, "singleGossip");
        // await new Promise((resolve, reject) => {
        //     solConnection.onAccountChange(userAddress, (data: AccountInfo<Buffer> | null) => {
        //         if (!data) reject();
        //         console.log('============================withdraw detail state6')
        //         resolve(true);
        //     });
        // })

        successAlert("Successfully Withdraw!")
        console.log('=============================withdraw state 7')
        return deposit;
    } catch (error) {
        errorAlert(error as string)
        console.log(error)
    }

}

export const getDepositBalance = async (wallet: WalletContextState) => {
    let userAddress = wallet.publicKey as PublicKey

    if (!userAddress) return
    try {

        let cloneWindow: any = window
        let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())

        const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
        const [userPoolVault, poolVaultBump] = await PublicKey.findProgramAddress(
            [Buffer.from(PLAYER_SEED), userAddress.toBuffer()],
            program.programId
        );

        const balance = await solConnection.getParsedAccountInfo(userPoolVault);
        if (balance) return balance
    } catch (error) {
        console.log(error)
    }
}

export const deposit = async (wallet: WalletContextState, deposit: number) => {
    let userAddress = wallet.publicKey as PublicKey
    if (!userAddress) return
    try {
        let cloneWindow: any = window
        let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
        const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
        const [userPoolVault, poolVaultBump] = await PublicKey.findProgramAddress(
            [Buffer.from(PLAYER_SEED), userAddress.toBuffer()],
            program.programId
        );
        let playerPoolKey = await PublicKey.createWithSeed(
            userAddress,
            "player-pool",
            program.programId,
        );
        let poolAccount = await solConnection.getAccountInfo(playerPoolKey);
        if (poolAccount === null || poolAccount.data === null) {
            console.log('init');
            await initUserPool(wallet);
        }
        const tx = await program.rpc.deposit(
            poolVaultBump, new anchor.BN(deposit * LAMPORTS_PER_SOL), {
            accounts: {
                owner: userAddress,
                playerRewardVault: userPoolVault,
                systemProgram: SystemProgram.programId,
            }
        });
        await solConnection.confirmTransaction(tx, "singleGossip");
        // await wallet.sendTransaction(tx,solConnection)
        // await new Promise((resolve, reject) => {
        //     solConnection.onAccountChange(userPoolVault, (data: AccountInfo<Buffer> | null) => {
        //         console.log('++++++++++++++++++++++++++++++++deposit state7(user address):', userPoolVault.toBase58())
        //         console.log('::::::::::::', data);
        //         // if (!data) reject();
        //         resolve(true);
        //         console.log('++++++++++++++++++++++++++++++++deposit state9:')
        //         return;
        //     }, 'confirmed');
        // })
        // solConnection.onAccountChange(userAddress, (accountinfo, _) => {
        //     console.log('sol connection ----------deposit state8');
        //     successAlert("Successfully Deposit!")
        //     return deposit;
        // }, 'confirmed')
        successAlert("Successfully Deposit!")
        return deposit
    } catch (error) {
        errorAlert(error as string)
        console.log(error)
    }

}


export const getGlobalState = async (
): Promise<GlobalPool | null> => {
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    try {
        let globalState = await program.account.globalPool.fetch(globalAuthority);
        return globalState as GlobalPool;
    } catch {
        return null;
    }
}

export const getUserPoolState = async (
    userAddress: PublicKey
): Promise<PlayerPool | null> => {
    if (!userAddress) return null;
    let cloneWindow: any = window;
    let provider = new anchor.Provider(solConnection, cloneWindow['solana'], anchor.Provider.defaultOptions())
    const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

    let playerPoolKey = await PublicKey.createWithSeed(
        userAddress,
        "player-pool",
        program.programId,
    );
    console.log('Player Pool: ', playerPoolKey.toBase58());
    try {
        let poolState = await program.account.playerPool.fetch(playerPoolKey);
        return poolState as PlayerPool;
    } catch {
        return null;
    }
}
