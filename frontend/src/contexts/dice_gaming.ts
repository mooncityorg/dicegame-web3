export type DiceGaming = {
  "version": "0.1.0",
  "name": "dice_gaming",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        },
        {
          "name": "vaultBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializePlayerPool",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerRewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "playerBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "playGame",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerRewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        },
        {
          "name": "vaultBump",
          "type": "u8"
        },
        {
          "name": "playerBump",
          "type": "u8"
        },
        {
          "name": "deposit",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerRewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "playerBump",
          "type": "u8"
        },
        {
          "name": "withdraw",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerRewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "playerBump",
          "type": "u8"
        },
        {
          "name": "deposit",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "superAdmin",
            "type": "publicKey"
          },
          {
            "name": "totalRound",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "playerPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "player",
            "type": "publicKey"
          },
          {
            "name": "round",
            "type": "u64"
          },
          {
            "name": "gameData",
            "type": {
              "defined": "GameData"
            }
          },
          {
            "name": "winTimes",
            "type": "u64"
          },
          {
            "name": "reveivedReward",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "GameData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "playTime",
            "type": "i64"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          },
          {
            "name": "rand1",
            "type": "u64"
          },
          {
            "name": "rand2",
            "type": "u64"
          },
          {
            "name": "rand3",
            "type": "u64"
          },
          {
            "name": "rand4",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidPlayerPool",
      "msg": "Invalid Player Pool Owner"
    },
    {
      "code": 6001,
      "name": "InsufficientRewardVault",
      "msg": "Insufficient Reward SOL Balance"
    },
    {
      "code": 6002,
      "name": "InsufficientPlayerVault",
      "msg": "Insufficient PlayerRewardPool SOL Balance"
    }
  ]
};

export const IDL: DiceGaming = {
  "version": "0.1.0",
  "name": "dice_gaming",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        },
        {
          "name": "vaultBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializePlayerPool",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerRewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "playerBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "playGame",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerRewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        },
        {
          "name": "vaultBump",
          "type": "u8"
        },
        {
          "name": "playerBump",
          "type": "u8"
        },
        {
          "name": "deposit",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerRewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "playerBump",
          "type": "u8"
        },
        {
          "name": "withdraw",
          "type": "u64"
        }
      ]
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerRewardVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "playerBump",
          "type": "u8"
        },
        {
          "name": "deposit",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "superAdmin",
            "type": "publicKey"
          },
          {
            "name": "totalRound",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "playerPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "player",
            "type": "publicKey"
          },
          {
            "name": "round",
            "type": "u64"
          },
          {
            "name": "gameData",
            "type": {
              "defined": "GameData"
            }
          },
          {
            "name": "winTimes",
            "type": "u64"
          },
          {
            "name": "reveivedReward",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "GameData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "playTime",
            "type": "i64"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "rewardAmount",
            "type": "u64"
          },
          {
            "name": "rand1",
            "type": "u64"
          },
          {
            "name": "rand2",
            "type": "u64"
          },
          {
            "name": "rand3",
            "type": "u64"
          },
          {
            "name": "rand4",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidPlayerPool",
      "msg": "Invalid Player Pool Owner"
    },
    {
      "code": 6001,
      "name": "InsufficientRewardVault",
      "msg": "Insufficient Reward SOL Balance"
    },
    {
      "code": 6002,
      "name": "InsufficientPlayerVault",
      "msg": "Insufficient PlayerRewardPool SOL Balance"
    }
  ]
};
