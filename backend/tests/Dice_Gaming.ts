import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, MintLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { DiceGaming } from '../target/types/dice_gaming';


const GLOBAL_AUTHORITY_SEED = "global-authority";
const VAULT_AUTHORITY_SEED = "vault-authority";

const PLAYER_POOL_SIZE = 120;
const GLOBAL_POOL_SIZE = 40;
const provider = anchor.Provider.env();
anchor.setProvider(provider);

describe('Gaming_Dice', () => {

  // Configure the client to use the local cluster.
  // const payer = provider.wallet;
  // console.log('Payer: ', payer.publicKey.toBase58());

  const program = anchor.workspace.DiceGaming as Program<DiceGaming>;
  console.log('ProgramId: ', program.programId.toBase58());

  const superOwner = anchor.web3.Keypair.fromSecretKey(new Uint8Array([68, 144, 227, 93, 108, 210, 244, 244, 106, 95, 251, 125, 193, 185, 188, 236, 201, 187, 183, 80, 224, 74, 8, 27, 75, 2, 108, 171, 73, 78, 205, 222, 220, 219, 10, 217, 133, 198, 76, 32, 120, 199, 53, 79, 201, 57, 8, 189, 98, 235, 234, 122, 65, 49, 224, 170, 161, 209, 80, 107, 99, 67, 72, 152]));
  const user = anchor.web3.Keypair.fromSecretKey(new Uint8Array([68, 144, 227, 93, 108, 210, 244, 244, 106, 95, 251, 125, 193, 185, 188, 236, 201, 187, 183, 80, 224, 74, 8, 27, 75, 2, 108, 171, 73, 78, 205, 222, 220, 219, 10, 217, 133, 198, 76, 32, 120, 199, 53, 79, 201, 57, 8, 189, 98, 235, 234, 122, 65, 49, 224, 170, 161, 209, 80, 107, 99, 67, 72, 152]));
  const pro = anchor.web3.Keypair.fromSecretKey(new Uint8Array([8, 87, 70, 137, 178, 158, 90, 30, 208, 248, 16, 226, 97, 27, 246, 228, 136, 91, 46, 172, 228, 13, 33, 200, 216, 104, 39, 91, 92, 44, 10, 201, 74, 48, 37, 226, 180, 114, 191, 201, 137, 153, 211, 182, 232, 24, 167, 10, 108, 90, 43, 74, 137, 68, 182, 157, 163, 133, 57, 12, 149, 160, 175, 74]));
  console.log('ProgramId: ', pro.publicKey.toBase58());


  it('Is initialized!', async () => {

    // Add your test here.
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(superOwner.publicKey, 1000000000),
      "confirmed"
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user.publicKey, 1000000000),
      "confirmed"
    );

    console.log("super owner =", superOwner.publicKey.toBase58());
    console.log("user =", user.publicKey.toBase58());

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
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(rewardVault, 2500000000),
      "confirmed"
    );

    const tx = await program.rpc.initialize(
      bump, vaultBump, {
      accounts: {
        admin: superOwner.publicKey,
        globalAuthority,
        rewardVault: rewardVault,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      },
      // instructions: [ix],
      signers: [superOwner],
    });
    console.log("Your transaction signature", tx);
    let globalPool = await program.account.globalPool.fetch(globalAuthority);
    console.log("globalPool =", globalPool);
  });

  it('Initialize Player pool', async () => {
    let playerPoolKey = await PublicKey.createWithSeed(
      user.publicKey,
      "player-pool",
      program.programId,
    );
    console.log(PLAYER_POOL_SIZE);
    let ix = SystemProgram.createAccountWithSeed({
      fromPubkey: user.publicKey,
      basePubkey: user.publicKey,
      seed: "player-pool",
      newAccountPubkey: playerPoolKey,
      lamports: await provider.connection.getMinimumBalanceForRentExemption(PLAYER_POOL_SIZE),
      space: PLAYER_POOL_SIZE,
      programId: program.programId,
    });

    const tx = await program.rpc.initializePlayerPool(
      {
        accounts: {
          playerPool: playerPoolKey,
          owner: user.publicKey
        },
        instructions: [
          ix
        ],
        signers: [user]
      }
    );

    console.log("Your transaction signature", tx);
    let poolAccount = await program.account.playerPool.fetch(playerPoolKey);
    console.log('Owner of initialized pool = ', poolAccount.player.toBase58());
  });

  it('Gaming Dice', async () => {
    // Mint one Shred NFT for user
    let playerPoolKey = await PublicKey.createWithSeed(
      user.publicKey,
      "player-pool",
      program.programId,
    );
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
    console.log('PlayerPool: ', playerPoolKey.toBase58());


    const tx = await program.rpc.playGame(
      bump, vaultBump, new anchor.BN(1000000000), {
      accounts: {
        owner: user.publicKey,
        playerPool: playerPoolKey,
        globalAuthority,
        rewardVault: rewardVault,
        systemProgram: SystemProgram.programId,
      },
      signers: [user],
    });
    await provider.connection.confirmTransaction(tx, "singleGossip");

    let poolAccount = await program.account.playerPool.fetch(playerPoolKey);
    console.log(poolAccount.round.toNumber());
    console.log({
      // ...userPool,
      playTime: poolAccount.gameData.playTime.toNumber(),
      amount: poolAccount.gameData.amount.toNumber(),
      rewardAmount: poolAccount.gameData.rewardAmount.toNumber(),
      rand1: poolAccount.gameData.rand1.toNumber(),
      rand2: poolAccount.gameData.rand2.toNumber(),
      rand3: poolAccount.gameData.rand3.toNumber(),
      rand4: poolAccount.gameData.rand4.toNumber(),
    });
  });

});

export const getATokenAccountsNeedCreate = async (
  connection: anchor.web3.Connection,
  walletAddress: anchor.web3.PublicKey,
  owner: anchor.web3.PublicKey,
  nfts: anchor.web3.PublicKey[],
) => {
  let instructions = [], destinationAccounts = [];
  for (const mint of nfts) {
    const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
    const response = await connection.getAccountInfo(destinationPubkey);
    if (!response) {
      const createATAIx = createAssociatedTokenAccountInstruction(
        destinationPubkey,
        walletAddress,
        owner,
        mint,
      );
      instructions.push(createATAIx);
    }
    destinationAccounts.push(destinationPubkey);
  }
  return {
    instructions,
    destinationAccounts,
  };
}

const getAssociatedTokenAccount = async (ownerPubkey: PublicKey, mintPk: PublicKey): Promise<PublicKey> => {
  let associatedTokenAccountPubkey = (await PublicKey.findProgramAddress(
    [
      ownerPubkey.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mintPk.toBuffer(), // mint address
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  ))[0];
  return associatedTokenAccountPubkey;
}

export const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: anchor.web3.PublicKey,
  payer: anchor.web3.PublicKey,
  walletAddress: anchor.web3.PublicKey,
  splTokenMintAddress: anchor.web3.PublicKey
) => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: walletAddress, isSigner: false, isWritable: false },
    { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new anchor.web3.TransactionInstruction({
    keys,
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.from([]),
  });
}