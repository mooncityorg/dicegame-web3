/* eslint-disable react/no-unescaped-entities */
import * as React from 'react';
import axios from "axios";

import { playGame, claim } from '../../contexts/helper';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';
import {
  useWallet,
} from '@solana/wallet-adapter-react';
import style from './index.module.css'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import LoadingPage from "../LoadingPage";

import web3, {
  AccountInfo,
  Connection,
  LAMPORTS_PER_SOL,
  PartiallyDecodedInstruction,
  ParsedInstruction,
  PublicKey,
  ParsedConfirmedTransaction,
  ConfirmedSignatureInfo,
  TokenBalance,
  Transaction,
  SystemProgram
} from "@solana/web3.js";
import { errorAlert, infoAlert, warningAlert, successAlert } from '../toastGroup';
import { getDepositBalance } from '../../contexts/helper';

import socketIOClient from "socket.io-client";
import Dice1 from './Dice1'
import Dice2 from './Dice2'
import { parsePickerInputValue } from '@mui/lab/internal/pickers/date-utils';
import { SERVER_ENDPOINT } from '../../contexts/config'

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});
interface Props {
  drawerWidth: number,
  gameBalance: number;
  setGameBalance: (value: number) => void;
  mobileAppBarOpened: boolean;
}


export const MainContent = (props: Props) => {
  const [payout, setPayout] = React.useState(0);
  const [hide, setHide] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [alertText, setAlertText] = React.useState("");
  const [won, setWon] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [dice1, setDice1] = React.useState(0)
  const [dice2, setDice2] = React.useState(0)

  const [playHistory, setPlayHistory] = React.useState<any[]>([])
  const [statGame, setStatGame] = React.useState({
    players: 0,
    totalBetted: 0,
  })
  const wallet = useWallet();
  const handlePayoutChange = (value: number) => {
    setPayout(value);
  };

  React.useEffect(() => {
    const socket = socketIOClient(SERVER_ENDPOINT);
    socket.on("update_stat_data", data => {
      console.log('socket stat data received : ', data);

      // var array = (data.playTxs as any[]).map(item => Object.fromEntries(
      //   Object.entries(item).map(
      //     ([key, val]) => [key === 'player' ? 'timestamp' : key, val]
      //   )
      // ))
      setPlayHistory(data.playTxs);
      setStatGame(data.statGame);
    });
    axios.post(`${SERVER_ENDPOINT}/getStatData`).then(res => res.data).then(function (result) {
      console.log('returned init stat data : ', result)
      setPlayHistory(result.playTxs);
      setStatGame(result.statGame);
    }).catch(function (error) {
      console.log(error);
    });
  }, [])

  function toggleClasses(die: any) {
    die.classList.toggle("odd-roll");
    die.classList.toggle("even-roll");
  }

  const playBtnClicked = async () => {
    setOpen(false);
    setHide(!hide);

    if (props.gameBalance === 0) {
      warningAlert("You don't have enough amount for game!\nPlease deposit amount!")
    } else {
      if (payout > props.gameBalance) {
        infoAlert("You can't wager more than current Balance!")
      } else {
        if (payout <= 0) {
          errorAlert("Please input positive amount!")
        } else {

          const value = (await getDepositBalance(wallet) as any).value.lamports / LAMPORTS_PER_SOL
          // .then((res) => {
          //   return (res.value.lamports / LAMPORTS_PER_SOL).toFixed(3)
          // });
          console.log(value.toFixed(3), 'gameBalance-----Roll Dice')
          props.setGameBalance(parseFloat(value.toFixed(3)))

          // setLoading(true)

          const result = await playGame(wallet, payout, () => setLoading(false), () => setLoading(false), () => props.setGameBalance(parseFloat((props.gameBalance - payout).toFixed(3))));
          if (!result || result.gameData === undefined) {
            clearInterval(result?.setintervalDice)
            return
          } else {
            // const balance = ((await getDepositBalance(wallet) as any).value.lamports / LAMPORTS_PER_SOL).toFixed(3);
            // props.setGameBalance(parseFloat(balance));

            let eleList = document.querySelectorAll(".die-list") as unknown as any[];
            let dice = [...eleList];
            clearInterval(result?.setintervalDice)
            dice.forEach(die => {
              // toggleClasses(die);
              (document.getElementById('die-1') as any).dataset.roll = result.gameData.rand1.toNumber();
              (document.getElementById('die-2') as any).dataset.roll = result.gameData.rand2.toNumber();
              (document.getElementById('die-3') as any).dataset.roll = result.gameData.rand3.toNumber();
              (document.getElementById('die-4') as any).dataset.roll = result.gameData.rand4.toNumber();
              setDice1(result.gameData.rand1.toNumber() + result.gameData.rand2.toNumber())
              setDice2(result.gameData.rand3.toNumber() + result.gameData.rand4.toNumber())
            });
            // eleList = document.querySelectorAll(".dice-div") as unknown as any[];
            // dice = [...eleList];
            // dice.forEach((die, index) => {

            //   die.classList.toggle("transformX-dice");
            //   die.classList.toggle("transformX-dice");
            // });


            if (result.gameData.rewardAmount.toNumber() > 0) {
              props.setGameBalance(parseFloat((props.gameBalance + payout).toFixed(3)))
              setWon(true);
              setOpen(true);
              setAlertText("You won!")
              successAlert("Player won!")
            } else {
              setWon(false);
              setOpen(true);
              setAlertText("You are lost!");
              errorAlert("Player lost!!");
            }

          }
          // setLoading(false)
          setHide(!hide);
        }
      }
    }
  }
  const restart = () => {
    setLoading(true)
    // await claim(wallet);
    setTimeout(async () => {
      const balance = (await getDepositBalance(wallet) as any).value.lamports / LAMPORTS_PER_SOL;
      // .then((res) => {
      //   if (res.value === undefined) return
      //   return res.value.lamports / LAMPORTS_PER_SOL
      // });
      console.log(balance, 'gameBalance------Restart')
      props.setGameBalance(balance)
    }, 1000)
    setPayout(0)
    setOpen(false)
    setLoading(false)
    setHide(!hide);
    setTimeout(() => {
      window.location.reload();
    }, 3000)
  }

  const retry = () => {
    setTimeout(async () => {
      const balance = (await getDepositBalance(wallet) as any).value.lamports / LAMPORTS_PER_SOL;
      // .then((res) => {
      //   return res.value.lamports / LAMPORTS_PER_SOL
      // });
      console.log(balance.toFixed(3), 'gameBalance-------Retry')
      props.setGameBalance(balance)
    }, 1000)
    setHide(!hide);
    setOpen(false);
    // document.getElementById('die-1').dataset.roll = 1;
    // document.getElementById('die-2').dataset.roll = 1;
    // document.getElementById('die-3').dataset.roll = 1;
    // document.getElementById('die-4').dataset.roll = 1;
    setPayout(0);
    setTimeout(() => {
      window.location.reload()
    }, 3000)
  }

  return (
    <Box component="div"
      aria-label="main content" style={{ filter: `${props.mobileAppBarOpened ? 'none' : ' blur(3px)'}` }}>
      <div style={{ marginLeft: `${props.drawerWidth + 10}px` }} className={`${style.mainContentPanel}`}>
        <div className={`${style.firstPanel}`}>
          <div>
            <p className={`${style.gradientTitle}`}>
              LUVAMI ORIGINAL
            </p>
            <p className={`${style.textTitle}`}>
              <span className="color-white">Roll the Dice</span>
            </p>
            <div className={`${style.colorBarWrapper}`}>
              <span className={`${style.colorBar}`}></span>
            </div>
            <div className={`${style.gameDetailInfo}`}>
              <p className={`${style.subTitle}`} style={{ marginTop: '32px' }}>
                Game information
              </p>
              <p className={`${style.subDescription}`}>
                Roll the Dice is a game of chance. You (the player) rolls 2 dice against the system, the pair of dice that add up to the highest number wins.
              </p>
              <p className={`${style.subTitle}`}>
                Game rules
              </p>
              <p className={`${style.subDescription}`}>
                The minimum bet is 0.05 Solana (SOL)
                You must hold one of the allowed NFT collection's NFT in your wallet.
                Don't gambling with money you can't lose
              </p>
            </div>
            <div className={``}>
              <p className={`${style.subTitle}`}>
                Bet amount <span>(in SOL)</span>
              </p>
              <div className={`${style.solDepositPanel}`}>

                <Button className={`${style.depositBtn} smDisplayNone`} onClick={() => handlePayoutChange(0.05)}>
                  0.05
                </Button>
                <Button className={`${style.depositBtn}`} onClick={() => handlePayoutChange(0.1)}>
                  0.10
                </Button>
                <Button className={`${style.depositBtn} smDisplayNone`} onClick={() => handlePayoutChange(0.25)}>
                  0.25
                </Button>
                <Button className={`${style.depositBtn}`} onClick={() => handlePayoutChange(0.5)}>
                  0.50
                </Button>
                <Button className={`${style.depositBtn} smDisplayNone`} onClick={() => handlePayoutChange(0.75)}>
                  0.75
                </Button>
                <Button className={`${style.depositBtn}`} onClick={() => handlePayoutChange(1.0)}>
                  1.00
                </Button>
                <Button className={`${style.depositBtn} smDisplayNone`} onClick={() => handlePayoutChange(2.5)}>
                  2.50
                </Button>
                {/* <TextField id="customBetAmount" label="Custom Amount" variant="outlined" className={`${style.customDeposit}`} /> */}
                <input type='number' className={`${style.customDepositInput}`} placeholder='Custom amount' value={payout} onChange={(e) => handlePayoutChange(parseFloat(e.target.value))}></input>
                <Button className={`${style.dicePlayBtn}`} onClick={playBtnClicked}>  <span className="color-white">Roll the Dice!</span></Button>
              </div>
            </div>
          </div>


        </div>
        <div className={`${style.secondPanel}`}>
          <div>

            <div className={`${style.secondPanelTitlePanel}`}>
              <h2 className={`${style.title1}`}>
                LUVAMI ORIGINAL
              </h2>
              <h2 className={`${style.title2}`}>
                Roll the Dice
              </h2>
            </div>

            <div className={`${style.playerDiceWrapper}`}>
              <p className={`${style.gameTitle}`}>
                Your (Player's) Dice
              </p>
              <div className={`transformX-dice diceDivWrapper`}>
                <Dice2 />
              </div>
              <p className={`${style.resultText}`}>
                {
                  open &&
                  <>
                    <span>
                      Total: <span className={`font-number`}>{dice2}</span>
                    </span>

                    {!won ?
                      <span style={{ color: '#F24949' }}>
                        You lost
                      </span>
                      :
                      <>
                        <span style={{ color: '#36BD64' }}>
                          You won!
                        </span>
                      </>
                    }
                  </>

                }
                {
                  !open && <>&nbsp;</>
                }
              </p>

            </div>
            <div className={`${style.systemDiceWrapper}`}>
              <p className={`${style.gameTitle}`}>
                The System's Dice
              </p>
              <div className={`transformX-dice diceDivWrapper`} >
                <Dice1 />
              </div>
              <p className={`${style.resultText}`} >

                {
                  open &&
                  <>
                    <span>
                      Total: <span className={`font-number`}>{dice1}</span>
                    </span>

                    {won ?
                      <span style={{ color: '#F24949' }}>
                        System lost
                      </span>
                      :
                      <>
                        <span style={{ color: '#36BD64' }}>
                          System won!
                        </span>
                      </>
                    }
                  </>

                }
                {
                  !open && <>&nbsp;</>
                }
              </p>
            </div>
            <div className={`${style.replayPanel}`}>
              <p >
                Congratulations! Want to roll again for <span className={`font-number`}>{payout}</span> SOL?
              </p>
              <Button className={`${style.replayBtn}`} onClick={playBtnClicked}> Quick play again</Button>
            </div>
          </div>
        </div>

        <div className={`${style.thirdPanel}`}>
          <div >
            <h2 className={`${style.historyTitle}`}>Games being played live</h2>

            <div className={`${style.historyWrapper}`}>
              {

                playHistory && playHistory.length > 0 && playHistory.map((item, index) => {


                  let passtimeSec = new Date().getTime() / 1000 - (item as any).timestamp;

                  var passtime = 0
                  if (passtimeSec < 60) passtime = Math.ceil(passtimeSec);
                  else if (passtimeSec < 3600) passtime = Math.ceil(passtimeSec / 60)
                  else passtime = Math.ceil(passtimeSec / 3600)
                  if ((item as any).balance > 0) return (
                    <p className="text-green">
                      Player ({(item as any).player.slice(0, 3)}...{(item as any).player.slice(-4)}) won&nbsp;
                      <span className="font-number">{(item as any).balance}</span> SOL - {(passtimeSec >= 3600) ? <><span className="font-number">{passtime}</span>hours</> : (passtimeSec >= 60) ? <><span className="font-number">{passtime}</span>minutes</> : <><span className="font-number">{passtime}</span>seconds</>} ago
                    </p>
                  );
                  else return (
                    <p className="text-red">
                      Player ({(item as any).player.slice(0, 3)}...{(item as any).player.slice(-4)}) lost&nbsp;
                      <span className="font-number">{Math.abs((item as any).balance)}</span> SOL - {(passtimeSec >= 3600) ? <><span className="font-number">{passtime}</span>hours</> : (passtimeSec >= 60) ? <><span className="font-number">{passtime}</span>minutes</> : <><span className="font-number">{passtime}</span>seconds</>} ago
                    </p>
                  )
                })
              }
            </div>



            <h2 className={`${style.statTitle}`}>Live platform statistics</h2>

            <p>
              There are a total of <span className="font-number"> {statGame.players} </span> games played

            </p>
            <p>
              And there is currently <span className="font-number"> {statGame.totalBetted.toFixed(1)} </span> SOL gambled
            </p>

          </div>
        </div>
      </div>
    </Box>
  )
}
