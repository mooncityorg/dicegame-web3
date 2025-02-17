use anchor_lang::prelude::*;

#[error]
pub enum GameError {
    // #[msg("Uninitialized account")]
    // Uninitialized,
    // #[msg("Invalid Super Owner")]
    // InvalidSuperOwner,
    #[msg("Invalid Player Pool Owner")]
    InvalidPlayerPool,
    // #[msg("Invalid NFT Address")]
    // InvalidNFTAddress,
    // #[msg("Invalid Withdraw Time")]
    // InvalidWithdrawTime,
    #[msg("Insufficient Reward SOL Balance")]
    InsufficientRewardVault,
    #[msg("Insufficient PlayerRewardPool SOL Balance")]
    InsufficientPlayerVault,
    
}
