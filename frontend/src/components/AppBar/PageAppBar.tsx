import React from 'react';

import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { web3 } from '@project-serum/anchor';
import { Dialog, DialogActions, DialogContent, DialogProps } from "@mui/material";
import TextField from '@mui/material/TextField';

import style from './PageAppBar.module.css'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { createSvgIcon } from '@mui/material/utils';
import Link from '@mui/material/Link';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useWallet } from "@solana/wallet-adapter-react";
import { errorAlert } from '../toastGroup';
import { deposit, getDepositBalance, withDraw } from '../../contexts/helper';
import LoadingPage from "../LoadingPage";
import { HamburgerMenu } from './Hamburger';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { ADMIN_PUBKEY, SERVER_ENDPOINT, SOLANA_NETWORK } from '../../contexts/config';


export const solConnection = new web3.Connection(web3.clusterApiUrl(SOLANA_NETWORK));


const HomeFillIcon = createSvgIcon(
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M10.5 4.32206L18.375 12.1971V17.7188C18.375 18.2409 18.1676 18.7417 17.7984 19.1109C17.4292 19.4801 16.9284 19.6875 16.4062 19.6875H4.59375C4.07161 19.6875 3.57085 19.4801 3.20163 19.1109C2.83242 18.7417 2.625 18.2409 2.625 17.7188V12.1971L10.5 4.32206ZM17.0625 3.28125V7.875L14.4375 5.25V3.28125C14.4375 3.1072 14.5066 2.94028 14.6297 2.81721C14.7528 2.69414 14.9197 2.625 15.0938 2.625H16.4062C16.5803 2.625 16.7472 2.69414 16.8703 2.81721C16.9934 2.94028 17.0625 3.1072 17.0625 3.28125Z" fill="white" />
    <path fillRule="evenodd" clipRule="evenodd" d="M9.57204 1.96875C9.81817 1.7227 10.1519 1.58447 10.5 1.58447C10.848 1.58447 11.1818 1.7227 11.4279 1.96875L20.1521 10.6916C20.2753 10.8149 20.3446 10.982 20.3446 11.1563C20.3446 11.3305 20.2753 11.4977 20.1521 11.6209C20.0289 11.7441 19.8617 11.8133 19.6875 11.8133C19.5132 11.8133 19.3461 11.7441 19.2228 11.6209L10.5 2.89669L1.7771 11.6209C1.65387 11.7441 1.48674 11.8133 1.31247 11.8133C1.13821 11.8133 0.971076 11.7441 0.84785 11.6209C0.724623 11.4977 0.655396 11.3305 0.655396 11.1563C0.655396 10.982 0.724623 10.8149 0.84785 10.6916L9.57204 1.96875Z" fill="white" />
  </svg>,
  'HomeFill',
);
const HomeFillIcon2 = createSvgIcon(
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M7.5 3.08719L13.125 8.71219V12.6562C13.125 13.0292 12.9768 13.3869 12.7131 13.6506C12.4494 13.9143 12.0917 14.0625 11.7188 14.0625H3.28125C2.90829 14.0625 2.5506 13.9143 2.28688 13.6506C2.02316 13.3869 1.875 13.0292 1.875 12.6562V8.71219L7.5 3.08719ZM12.1875 2.34375V5.625L10.3125 3.75V2.34375C10.3125 2.21943 10.3619 2.1002 10.4498 2.01229C10.5377 1.92439 10.6569 1.875 10.7812 1.875H11.7188C11.8431 1.875 11.9623 1.92439 12.0502 2.01229C12.1381 2.1002 12.1875 2.21943 12.1875 2.34375Z" fill="white" />
    <path fillRule="evenodd" clipRule="evenodd" d="M6.83717 1.40626C7.01298 1.23051 7.25139 1.13177 7.49998 1.13177C7.74857 1.13177 7.98699 1.23051 8.16279 1.40626L14.3944 7.63689C14.4824 7.72491 14.5318 7.84429 14.5318 7.96876C14.5318 8.09324 14.4824 8.21262 14.3944 8.30064C14.3063 8.38866 14.187 8.4381 14.0625 8.4381C13.938 8.4381 13.8186 8.38866 13.7306 8.30064L7.49998 2.06907L1.26936 8.30064C1.18134 8.38866 1.06196 8.4381 0.937482 8.4381C0.813005 8.4381 0.693626 8.38866 0.605607 8.30064C0.517588 8.21262 0.46814 8.09324 0.46814 7.96876C0.46814 7.84429 0.517588 7.72491 0.605607 7.63689L6.83717 1.40626Z" fill="white" />
  </svg>,
  'HomeFill2',
);
const DiamondHalf = createSvgIcon(
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_2_48)">
      <path d="M20.4291 11.8781C21.1903 11.1169 21.1903 9.88312 20.4291 9.12187L11.8781 0.57225C11.1169 -0.189 9.88444 -0.189 9.1245 0.57225L0.57225 9.1245C-0.189001 9.88575 -0.189001 11.1182 0.572251 11.8781L9.1245 20.4304C9.88575 21.1916 11.1182 21.1916 11.8781 20.4304L20.4291 11.8781ZM19.7019 10.5C19.7019 10.6667 19.6376 10.8321 19.5116 10.9594L10.9594 19.5116C10.8375 19.6334 10.6723 19.7019 10.5 19.7019C10.3277 19.7019 10.1625 19.6334 10.0406 19.5116L1.48837 10.9594C1.42793 10.8991 1.37999 10.8275 1.34733 10.7487C1.31467 10.6699 1.29793 10.5853 1.29806 10.5L19.7019 10.5Z" fill="white" />
    </g>
    <defs>
      <clipPath id="clip0_2_48">
        <rect width="21" height="21" fill="white" transform="translate(21) rotate(90)" />
      </clipPath>
    </defs>
  </svg>,
  'DiamondHalf',
);
const DiamondHalf2 = createSvgIcon(
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5922 8.48397C15.1359 7.94018 15.1359 7.05888 14.5922 6.51509L8.48397 0.407838C7.94018 -0.135946 7.05982 -0.135946 6.51697 0.407838L0.407838 6.51697C-0.135946 7.06075 -0.135946 7.94112 0.407838 8.48397L6.51697 14.5931C7.06075 15.1369 7.94112 15.1369 8.48397 14.5931L14.5922 8.48397ZM14.0728 7.49953C14.0728 7.6186 14.0268 7.73673 13.9368 7.82768L7.82768 13.9368C7.74064 14.0238 7.62261 14.0727 7.49953 14.0727C7.37645 14.0727 7.25842 14.0238 7.17139 13.9368L1.06225 7.82768C1.01907 7.78465 0.984834 7.7335 0.961502 7.67718C0.938171 7.62087 0.92621 7.56049 0.926309 7.49953L14.0728 7.49953Z" fill="white" />
  </svg>,
  'DiamondHalf2',
);
const GlobalEarth = createSvgIcon(
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 10.5C0 7.71523 1.10625 5.04451 3.07538 3.07538C5.04451 1.10625 7.71523 0 10.5 0C13.2848 0 15.9555 1.10625 17.9246 3.07538C19.8938 5.04451 21 7.71523 21 10.5C21 13.2848 19.8938 15.9555 17.9246 17.9246C15.9555 19.8938 13.2848 21 10.5 21C7.71523 21 5.04451 19.8938 3.07538 17.9246C1.10625 15.9555 0 13.2848 0 10.5ZM9.84375 1.41356C8.96437 1.68131 8.09156 2.48981 7.36706 3.84825C7.12836 4.29988 6.92306 4.76838 6.75281 5.25H9.84375V1.41356ZM5.36812 5.25C5.58688 4.55282 5.86802 3.87678 6.20813 3.23006C6.43507 2.80095 6.69715 2.39136 6.99169 2.0055C5.3655 2.6799 3.96638 3.80575 2.95969 5.25H5.36812ZM4.60425 9.84375C4.64362 8.69269 4.78538 7.58887 5.01375 6.5625H2.19712C1.70772 7.59288 1.41568 8.70583 1.33613 9.84375H4.60425ZM6.36169 6.5625C6.10354 7.63849 5.95491 8.73784 5.91806 9.84375H9.84375V6.5625H6.36169ZM11.1562 6.5625V9.84375H15.0806C15.0443 8.73788 14.8961 7.63853 14.6383 6.5625H11.1562ZM5.91938 11.1562C5.95579 12.2621 6.10398 13.3615 6.36169 14.4375H9.84375V11.1562H5.91938ZM11.1562 11.1562V14.4375H14.6383C14.8837 13.4334 15.0399 12.327 15.0819 11.1562H11.1562ZM6.75281 15.75C6.93394 16.2566 7.14 16.7265 7.36706 17.1518C8.09156 18.5102 8.96569 19.3174 9.84375 19.5864V15.75H6.75281ZM6.99169 18.9945C6.69713 18.6087 6.43505 18.1991 6.20813 17.7699C5.86803 17.1232 5.58689 16.4472 5.36812 15.75H2.95969C3.96633 17.1943 5.36547 18.3202 6.99169 18.9945ZM5.01375 14.4375C4.7764 13.3587 4.63932 12.2603 4.60425 11.1562H1.33613C1.4175 12.3244 1.71806 13.4308 2.19712 14.4375H5.01375ZM14.0083 18.9945C15.6345 18.3202 17.0337 17.1943 18.0403 15.75H15.6319C15.4131 16.4472 15.132 17.1232 14.7919 17.7699C14.565 18.1991 14.3029 18.6087 14.0083 18.9945ZM11.1562 15.75V19.5864C12.0356 19.3187 12.9084 18.5102 13.6329 17.1518C13.86 16.7265 14.0661 16.2566 14.2472 15.75H11.1562ZM15.9862 14.4375H18.8029C19.2819 13.4308 19.5825 12.3244 19.6639 11.1562H16.3958C16.3607 12.2603 16.2236 13.3587 15.9862 14.4375ZM19.6639 9.84375C19.5843 8.70583 19.2923 7.59289 18.8029 6.5625H15.9862C16.2146 7.58887 16.3564 8.69269 16.3958 9.84375H19.6639ZM14.7919 3.23006C15.1161 3.83906 15.3982 4.51631 15.6319 5.25H18.0403C17.0337 3.8057 15.6345 2.67983 14.0083 2.0055C14.2944 2.37825 14.5569 2.79037 14.7919 3.23006ZM14.2472 5.25C14.077 4.76837 13.8717 4.29987 13.6329 3.84825C12.9084 2.48981 12.0356 1.68263 11.1562 1.41356V5.25H14.2472Z" fill="white" />
  </svg>,
  'GlobalEarth',
);
const GlobalEarth2 = createSvgIcon(
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 7.5C0 5.51088 0.746278 3.60322 2.07466 2.1967C3.40304 0.790176 5.20472 0 7.08333 0C8.96195 0 10.7636 0.790176 12.092 2.1967C13.4204 3.60322 14.1667 5.51088 14.1667 7.5C14.1667 9.48912 13.4204 11.3968 12.092 12.8033C10.7636 14.2098 8.96195 15 7.08333 15C5.20472 15 3.40304 14.2098 2.07466 12.8033C0.746278 11.3968 0 9.48912 0 7.5ZM6.64062 1.00969C6.0474 1.20094 5.45859 1.77844 4.96984 2.74875C4.80881 3.07134 4.67032 3.40598 4.55547 3.75H6.64062V1.00969ZM3.62135 3.75C3.76893 3.25202 3.95858 2.76913 4.18802 2.30719C4.34112 2.00068 4.51792 1.70811 4.71661 1.4325C3.61959 1.91421 2.67573 2.7184 1.99661 3.75H3.62135ZM3.10604 7.03125C3.1326 6.20906 3.22823 5.42063 3.38229 4.6875H1.48219C1.15203 5.42348 0.955022 6.21845 0.901354 7.03125H3.10604ZM4.29161 4.6875C4.11747 5.45607 4.0172 6.24131 3.99234 7.03125H6.64062V4.6875H4.29161ZM7.52604 4.6875V7.03125H10.1734C10.1489 6.24134 10.0489 5.45609 9.87505 4.6875H7.52604ZM3.99323 7.96875C4.01779 8.75865 4.11776 9.5439 4.29161 10.3125H6.64062V7.96875H3.99323ZM7.52604 7.96875V10.3125H9.87505C10.0406 9.59531 10.146 8.805 10.1743 7.96875H7.52604ZM4.55547 11.25C4.67766 11.6119 4.81667 11.9475 4.96984 12.2513C5.45859 13.2216 6.04828 13.7981 6.64062 13.9903V11.25H4.55547ZM4.71661 13.5675C4.5179 13.2919 4.3411 12.9993 4.18802 12.6928C3.95859 12.2309 3.76893 11.748 3.62135 11.25H1.99661C2.6757 12.2816 3.61956 13.0858 4.71661 13.5675ZM3.38229 10.3125C3.22218 9.54194 3.1297 8.75735 3.10604 7.96875H0.901354C0.95625 8.80313 1.15901 9.59344 1.48219 10.3125H3.38229ZM9.45005 13.5675C10.5471 13.0858 11.491 12.2816 12.1701 11.25H10.5453C10.3977 11.748 10.2081 12.2309 9.97865 12.6928C9.82559 12.9993 9.64879 13.2919 9.45005 13.5675ZM7.52604 11.25V13.9903C8.11927 13.7991 8.70807 13.2216 9.19682 12.2513C9.35 11.9475 9.48901 11.6119 9.6112 11.25H7.52604ZM10.7844 10.3125H12.6845C13.0077 9.59344 13.2104 8.80313 13.2653 7.96875H11.0606C11.037 8.75735 10.9445 9.54194 10.7844 10.3125ZM13.2653 7.03125C13.2116 6.21845 13.0146 5.42349 12.6845 4.6875H10.7844C10.9384 5.42063 11.0341 6.20906 11.0606 7.03125H13.2653ZM9.97865 2.30719C10.1973 2.74219 10.3877 3.22594 10.5453 3.75H12.1701C11.491 2.71836 10.5471 1.91417 9.45005 1.4325C9.64307 1.69875 9.82016 1.99312 9.97865 2.30719ZM9.6112 3.75C9.49636 3.40598 9.35786 3.07133 9.19682 2.74875C8.70807 1.77844 8.11927 1.20187 7.52604 1.00969V3.75H9.6112Z" fill="white" />
  </svg>,
  'GlobalEarth2',
);
interface Props {
  gameBalance: number;
  setGameBalance: (value: number) => void;
  handleMobileAppBarOpened: () => void;

}
const PageAppBar = (props: Props) => {
  const [open, setOpen] = React.useState(false);
  const [depositWithdraw, setDepositWithdraw] = React.useState(false);
  const [depositAmount, setDepositAmount] = React.useState(0);
  const [withdrawAmount, setWithdrawAmount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [walletAmount, setWalletAmount] = React.useState(0);
  const [mobileMenuShow, setMobileMenuShow] = React.useState(false);
  const [detailInfoOpen, sedtDetailInfoOpen] = React.useState(false);

  const theme = useTheme();
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('md');
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  const [totalSolGambled, setTotalSolGambled] = React.useState(0)
  const [totalPlayerSolWon, setTotalPlayerSolWon] = React.useState(0)
  const [totalPlayerSolLost, setTotalPlayerSolLost] = React.useState(0)
  const [totalGamePlayed, setTotalGamePlayed] = React.useState(0)
  const [totalPlayerGameWon, setTotalPlayerGameWon] = React.useState(0)
  const [totalPlayerGameLost, setTotalPlayerGameLost] = React.useState(0)
  const handledetailInfoClickOpen = () => {

    if (wallet && wallet.publicKey && ADMIN_PUBKEY.indexOf(wallet.publicKey.toBase58()) !== -1) {
      const fd = new FormData;

      fd.append('address', wallet.publicKey.toBase58());
      // console.log('+++++++++++++++++ address : ', wallet.publicKey.toBase58())
      axios.post(`${SERVER_ENDPOINT}/getStatDetailInfo`, {
        address: wallet.publicKey.toBase58()
      }).then(res => res.data).then(function (data) {
        console.log('+++++++++++++++++++:::::::::::::', data)

        setTotalSolGambled(parseFloat((data.totalBetted).toFixed(2)))
        setTotalPlayerSolWon(parseFloat((data.playerWonSol).toFixed(2)))
        setTotalPlayerSolLost(parseFloat((data.PlayerLostSol).toFixed(2)))
        setTotalGamePlayed(parseInt(data.players))
        setTotalPlayerGameWon(parseInt(data.playerWonNumbers))
        setTotalPlayerGameLost(parseInt(data.playerLostNumbers))

      }).catch(function (error) {
        console.log(error);
      })
    }
    sedtDetailInfoOpen(true);
  };

  const handledetailInfoClickClose = () => {
    sedtDetailInfoOpen(false);
  };

  const wallet = useWallet();
  const depositClick = () => {
    setOpen(true)
    setDepositWithdraw(true);
    setMobileMenuShow(false);

  }

  const withdrawClick = () => {
    setOpen(true)
    setDepositWithdraw(false)
    setMobileMenuShow(false);
  }

  const deposit_confirm = async () => {
    // const balance = await solConnection.getBalance(wallet.publicKey).then((res) => {
    //   return res / LAMPORTS_PER_SOL;
    // })
    setOpen(false)
    if (!wallet.publicKey || !wallet.connected) {
      errorAlert("Please connect your wallet")
      return;
    }
    if (depositAmount > walletAmount) {
      setDepositAmount(0)
      errorAlert("You don't have enough amount to deposit!")
    } else if (depositAmount <= 0) {
      errorAlert("Please input positive amount")
    } else {
      setLoading(true);

      let depositedAmount = await deposit(wallet, depositAmount);
      if (!depositedAmount) return;

      // const result = await getDepositBalance(wallet)
      // if (!result) {
      //   errorAlert("Please try again.");
      //   return;
      // }

      // .then((res) => {
      //   console.log('-----------------------', res)
      //   if (!res || (res as any).value === undefined) return 0
      //   console.log('-----------------------', res)
      //   return (res as any).value.lamports / LAMPORTS_PER_SOL
      // });

      // console.log('-----------------------', result)
      const balance = await solConnection.getBalance(wallet.publicKey) / LAMPORTS_PER_SOL;
      // console.log(result, typeof (result), 'result<----------')
      // console.log(balance, typeof (balance), 'balance<-------')
      setLoading(false);
      props.setGameBalance(parseFloat((props.gameBalance + parseFloat(depositedAmount as unknown as string)).toFixed(3)));//parseFloat(((result as any).value.lamports / LAMPORTS_PER_SOL).toFixed(3))
      setWalletAmount(parseFloat(balance.toFixed(3)));
      setDepositAmount(0)

      // setTimeout(() => {
      //   window.location.reload()
      // }, 5000)
    }
  }

  const withdraw_confirm = async () => {
    if (!wallet.publicKey) {
      // errorAlert("Please connect your wallet!")
      return;
    }
    if (withdrawAmount > props.gameBalance) {
      errorAlert("You can't withdraw more than current Balance")
    } else if (withdrawAmount <= 0) {
      errorAlert("Please input positive amount")
    } else {
      setOpen(false)
      // console.log('-------------------------------withdraw state2')
      setLoading(true);
      let withdrawedAmount = await withDraw(wallet, withdrawAmount)
      // console.log('-------------------------------withdraw state3')
      if (!withdrawedAmount) return;
      // const result = await getDepositBalance(wallet)

      // .then((res) => {
      //   if (!res || (res as any).value === undefined) return 0
      //   return (res as any).value.lamports / LAMPORTS_PER_SOL
      // });

      // console.log('-------------------------------withdraw state4', result)
      const balance = await solConnection.getBalance(wallet.publicKey) / LAMPORTS_PER_SOL
      // console.log(result, typeof (result), 'result------>')
      console.log(balance, typeof (balance), 'balance------>')
      setLoading(false)
      props.setGameBalance(parseFloat((props.gameBalance - parseFloat(withdrawedAmount as unknown as string)).toFixed(3)));//parseFloat(((result as any).value.lamports / LAMPORTS_PER_SOL).toFixed(3))

      setWalletAmount(parseFloat(balance.toFixed(3)));
      setWithdrawAmount(0)

      // setTimeout(() => {
      //   window.location.reload()
      // }, 5000)
    }
  }

  const cancel = () => {
    setOpen(false)
    setDepositAmount(0)
    setWithdrawAmount(0)
  }
  const depositHandleChange = async (value: any) => {

    setDepositAmount(value)
  }

  const withdrawHandleChange = (value: any) => {
    setWithdrawAmount(value as number)
  }

  const handleMenuToggle = () => {
    setMobileMenuShow(!mobileMenuShow)
  }

  // React.useEffect(() => {
  // }, [])
  React.useEffect(() => {
    var walletBtn = document.querySelectorAll('.walletBtnWrapper > .wallet-adapter-button-trigger');
    // walletBtn.on('click', function () {
    //   alert('s')
    // })
    // if (mobileMenuShow) {
    props.handleMobileAppBarOpened()
    walletBtn.forEach(function (item) {
      item.addEventListener('click', function () {
        // setMobileMenuShow(false);
        // alert('clicked')
      });
    })


    // }
  }, [mobileMenuShow])
  React.useEffect(() => {
    const fetchDepositAmount = async () => {
      let balance = await getDepositBalance(wallet)
      console.log('returned deposit amount  :', balance)
      // .then((res) => {
      //   if (res === undefined) return
      //   // const interval = setInterval(() => {
      //   })
      if (!balance || !balance.value) props.setGameBalance(0);
      else props.setGameBalance(parseFloat(((balance as any).value.lamports / LAMPORTS_PER_SOL).toFixed(3)))
      // }, 1000)

      // return () =>clearInterval(interval)
      // })
    }
    fetchDepositAmount();
    const fetchWalletAmount = async () => {

      if (!wallet.publicKey) {

        // errorAlert("Please connect your wallet!!");
        setWalletAmount(0);
        return;
      }
      await solConnection.getBalance(wallet.publicKey).then((res: number) => {
        setWalletAmount(parseFloat((res / LAMPORTS_PER_SOL).toFixed(3)));
      })
    }
    fetchWalletAmount();
  }, [wallet.connected])


  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} className={`${style.desktopAppBarWrapper}`}>
        <Toolbar className={`${style.topBarWrapper}`}>
          {/* <Typography variant="h6" noWrap component="div">
          Clipped drawer
        </Typography> */}

          <div className={`logoTextPanel`}>
            <span className={`text-gradient ${style.logoText1}`}>Luvami</span>
            <span className={`${style.logoText2} `}>Gambling</span>
          </div>

          <div className={`${style.multiWrapper}`}>

            {wallet.connected && wallet &&
              <>
                <div className={`${style.gameBlogPanel}`}>
                  {/* SeUpqkDqRYD4jf3Mi2TQ2bceE77cvvLZDLtqyURkcJ6 */}
                  {
                    wallet && wallet.publicKey && ADMIN_PUBKEY.indexOf(wallet.publicKey.toBase58()) !== -1 &&

                    <Button variant="outlined" style={{ color: 'white', borderColor: 'white', marginRight: '20px', height: '45px' }} onClick={handledetailInfoClickOpen}>Detail Info</Button>

                  }
                  <h3>Current Balance:&nbsp;<span className={`${style.fontNumber}`}>{props.gameBalance}</span>&nbsp;SOL&nbsp;&nbsp;&nbsp;</h3>
                  <ButtonGroup variant="outlined" aria-label="outlined button group" style={{ marginRight: '30px', height: '45px' }}>
                    <Button style={{ borderRadius: '10px 0 0 10px', color: 'white', borderColor: 'white' }} onClick={depositClick}>Deposit</Button>
                    <Button style={{ borderRadius: '0 10px 10px 0', color: 'white', borderColor: 'white' }} onClick={withdrawClick}>Withdraw</Button>

                  </ButtonGroup>
                </div>

                <Dialog
                  open={open}
                  maxWidth="sm"
                >
                  <DialogContent>
                    {depositWithdraw ?
                      <h3>Please input deposit amount.</h3>
                      :
                      <h3>Please input withdraw amount.</h3>
                    }
                    <h4>Your Wallet Balance: <span className={`${style.fontNumber}`} >{walletAmount}</span> SOL</h4>
                    <Box
                      sx={{
                        width: 300,
                        maxWidth: '100%',
                      }}
                    >
                      {depositWithdraw ?
                        <TextField
                          className="deposit"
                          fullWidth
                          label="Deposit Amount"
                          id="deposit"
                          type="number"
                          value={depositAmount}
                          required
                          onChange={(e) => depositHandleChange(e.target.value)}
                        />
                        :
                        <TextField
                          fullWidth
                          className="deposit"
                          label="Withdraw Amount"
                          id="withdraw"
                          type="number"
                          value={withdrawAmount}
                          required
                          onChange={(e) => withdrawHandleChange(e.target.value)}
                        />
                      }
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    {depositWithdraw ?
                      <Button variant="contained" onClick={() => deposit_confirm()}>Confirm</Button>
                      :
                      <Button variant="contained" onClick={() => withdraw_confirm()}>Confirm</Button>
                    }
                    <Button variant="contained" color="error" onClick={() => cancel()}>Cancel</Button>
                  </DialogActions>
                </Dialog>


              </>
            }
            <span className={`${style.walletConWrapper}`}>
              <WalletModalProvider>
                <WalletMultiButton />
              </WalletModalProvider>
            </span>
          </div>

        </Toolbar>



      </AppBar>
      {loading &&
        <LoadingPage />
      }
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} className={`${style.mobileAppBarWrapper}`}>
        <Toolbar className={`${style.mobileTopBarWrapper}`}>
          {/* <Typography variant="h6" noWrap component="div">
          Clipped drawer
        </Typography> */}

          <div>


            <div className={`${style.topBarMenu}`}>
              <div className={`logoTextPanel`}>
                <span className={`text-gradient ${style.logoText1}`}>Luvami</span>
                <span className={`${style.logoText2} smDisplayNone`}>Gambling</span>
              </div>
              <div className={`${style.gameBlogPanel}`}>
                {
                  wallet && wallet.connected &&
                  <h3><span className={`${style.balanceLabel}`}>Current Balance:&nbsp;</span><span className={`${style.fontNumber}`}>{props.gameBalance}</span>&nbsp;SOL&nbsp;&nbsp;&nbsp;</h3>

                }
                <HamburgerMenu onClick={handleMenuToggle} mobileMenuShow={mobileMenuShow} />
              </div>
            </div>
            {
              mobileMenuShow &&
              <div  >
                <div>
                  <List>
                    <Link href="#" underline="none" onClick={() => { setMobileMenuShow(false); }}>

                      <ListItem button key={'HomepageMobileBar'} className={`${style.sidebarMenuItem}`}>
                        <ListItemIcon style={{ marginRight: "10px", minWidth: 'auto' }} className={`${style.menuIconWrapper}`}>
                          {
                            (window.innerWidth > 600) ?

                              <HomeFillIcon /> :
                              <HomeFillIcon2 />
                          }

                        </ListItemIcon>
                        <ListItemText primary={`Homepage`} className={`${style.sideBarMenuText}`} />
                      </ListItem>
                    </Link>
                    <ListItem button key={'GamesMobileBar'} className={`${style.sidebarMenuItem}`} onClick={() => { setMobileMenuShow(false); }}>
                      <ListItemIcon style={{ marginRight: "10px", minWidth: 'auto' }} className={`${style.menuIconWrapper}`}>
                        {
                          (window.innerWidth > 600) ?
                            <DiamondHalf /> :
                            <DiamondHalf2 />
                        }
                      </ListItemIcon>
                      <ListItemText primary={`Games`} className={`${style.sideBarMenuText}`} />
                    </ListItem>
                    <ListItem button key={'KindKoalasMobileBar'} className={`${style.sidebarMenuItem}`} onClick={() => { setMobileMenuShow(false); }}>
                      <ListItemIcon style={{ marginRight: "10px", minWidth: 'auto' }} className={`${style.menuIconWrapper}`}>
                        {
                          (window.innerWidth > 600) ?
                            <GlobalEarth /> :
                            <GlobalEarth2 />
                        }
                      </ListItemIcon>
                      <ListItemText primary={`Kind Koalas`} className={`${style.sideBarMenuTextWithImg}`} />
                      {
                        (window.innerWidth > 600) ?
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_2_20)">
                              <path fillRule="evenodd" clipRule="evenodd" d="M7.01675 2.84375C7.01675 2.73601 6.97395 2.63267 6.89776 2.55649C6.82158 2.4803 6.71824 2.4375 6.6105 2.4375H1.21875C0.895517 2.4375 0.585524 2.5659 0.356964 2.79446C0.128404 3.02302 0 3.33302 0 3.65625L0 11.7812C0 12.1045 0.128404 12.4145 0.356964 12.643C0.585524 12.8716 0.895517 13 1.21875 13H9.34375C9.66698 13 9.97698 12.8716 10.2055 12.643C10.4341 12.4145 10.5625 12.1045 10.5625 11.7812V6.3895C10.5625 6.28176 10.5197 6.17842 10.4435 6.10224C10.3673 6.02605 10.264 5.98325 10.1562 5.98325C10.0485 5.98325 9.94517 6.02605 9.86899 6.10224C9.7928 6.17842 9.75 6.28176 9.75 6.3895V11.7812C9.75 11.889 9.7072 11.9923 9.63101 12.0685C9.55483 12.1447 9.45149 12.1875 9.34375 12.1875H1.21875C1.11101 12.1875 1.00767 12.1447 0.931488 12.0685C0.855301 11.9923 0.8125 11.889 0.8125 11.7812V3.65625C0.8125 3.54851 0.855301 3.44517 0.931488 3.36899C1.00767 3.2928 1.11101 3.25 1.21875 3.25H6.6105C6.71824 3.25 6.82158 3.2072 6.89776 3.13101C6.97395 3.05483 7.01675 2.95149 7.01675 2.84375Z" fill="white" fillOpacity="0.75" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M13 0.40625C13 0.298506 12.9572 0.195175 12.881 0.118988C12.8049 0.0428012 12.7015 0 12.5938 0L8.53128 0C8.42353 0 8.3202 0.0428012 8.24401 0.118988C8.16783 0.195175 8.12503 0.298506 8.12503 0.40625C8.12503 0.513994 8.16783 0.617325 8.24401 0.693512C8.3202 0.769699 8.42353 0.8125 8.53128 0.8125H11.6131L4.99365 7.43112C4.95588 7.4689 4.92592 7.51374 4.90547 7.56309C4.88503 7.61244 4.87451 7.66533 4.87451 7.71875C4.87451 7.77217 4.88503 7.82506 4.90547 7.87441C4.92592 7.92376 4.95588 7.9686 4.99365 8.00638C5.03142 8.04415 5.07626 8.07411 5.12561 8.09455C5.17496 8.11499 5.22786 8.12551 5.28128 8.12551C5.33469 8.12551 5.38759 8.11499 5.43694 8.09455C5.48629 8.07411 5.53113 8.04415 5.5689 8.00638L12.1875 1.38694V4.46875C12.1875 4.57649 12.2303 4.67983 12.3065 4.75601C12.3827 4.8322 12.486 4.875 12.5938 4.875C12.7015 4.875 12.8049 4.8322 12.881 4.75601C12.9572 4.67983 13 4.57649 13 4.46875V0.40625Z" fill="white" fillOpacity="0.75" />
                            </g>
                            <defs>
                              <clipPath id="clip0_2_20">
                                <rect width="13" height="13" fill="white" />
                              </clipPath>
                            </defs>
                          </svg> :


                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_2_237)">
                              <path fillRule="evenodd" clipRule="evenodd" d="M5.3975 2.1875C5.3975 2.10462 5.36458 2.02513 5.30597 1.96653C5.24737 1.90792 5.16788 1.875 5.085 1.875H0.9375C0.68886 1.875 0.450403 1.97377 0.274587 2.14959C0.098772 2.3254 0 2.56386 0 2.8125L0 9.0625C0 9.31114 0.098772 9.5496 0.274587 9.72541C0.450403 9.90123 0.68886 10 0.9375 10H7.1875C7.43614 10 7.6746 9.90123 7.85041 9.72541C8.02623 9.5496 8.125 9.31114 8.125 9.0625V4.915C8.125 4.83212 8.09208 4.75263 8.03347 4.69403C7.97487 4.63542 7.89538 4.6025 7.8125 4.6025C7.72962 4.6025 7.65013 4.63542 7.59153 4.69403C7.53292 4.75263 7.5 4.83212 7.5 4.915V9.0625C7.5 9.14538 7.46708 9.22487 7.40847 9.28347C7.34987 9.34208 7.27038 9.375 7.1875 9.375H0.9375C0.85462 9.375 0.775134 9.34208 0.716529 9.28347C0.657924 9.22487 0.625 9.14538 0.625 9.0625V2.8125C0.625 2.72962 0.657924 2.65013 0.716529 2.59153C0.775134 2.53292 0.85462 2.5 0.9375 2.5H5.085C5.16788 2.5 5.24737 2.46708 5.30597 2.40847C5.36458 2.34987 5.3975 2.27038 5.3975 2.1875Z" fill="white" fillOpacity="0.75" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M10 0.3125C10 0.22962 9.96711 0.150134 9.9085 0.0915291C9.8499 0.032924 9.77041 0 9.68753 0L6.56253 0C6.47965 0 6.40016 0.032924 6.34156 0.0915291C6.28295 0.150134 6.25003 0.22962 6.25003 0.3125C6.25003 0.39538 6.28295 0.474866 6.34156 0.533471C6.40016 0.592076 6.47965 0.625 6.56253 0.625H8.93316L3.84128 5.71625C3.81222 5.74531 3.78918 5.7798 3.77345 5.81776C3.75773 5.85572 3.74963 5.89641 3.74963 5.9375C3.74963 5.97859 3.75773 6.01928 3.77345 6.05724C3.78918 6.0952 3.81222 6.12969 3.84128 6.15875C3.87033 6.18781 3.90483 6.21085 3.94279 6.22658C3.98075 6.2423 4.02144 6.25039 4.06253 6.25039C4.10362 6.25039 4.14431 6.2423 4.18227 6.22658C4.22023 6.21085 4.25472 6.18781 4.28378 6.15875L9.37503 1.06687V3.4375C9.37503 3.52038 9.40795 3.59987 9.46656 3.65847C9.52516 3.71708 9.60465 3.75 9.68753 3.75C9.77041 3.75 9.8499 3.71708 9.9085 3.65847C9.96711 3.59987 10 3.52038 10 3.4375V0.3125Z" fill="white" fillOpacity="0.75" />
                            </g>
                            <defs>
                              <clipPath id="clip0_2_237">
                                <rect width="10" height="10" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>

                      }
                    </ListItem>

                  </List>

                </div>


                <div style={{ marginBottom: '15px' }}>
                  <span className={`${style.walletConWrapper} walletBtnWrapper`} >
                    <WalletModalProvider >
                      <WalletMultiButton />
                    </WalletModalProvider>
                  </span>

                </div>
                {wallet.connected && wallet &&
                  <div>
                    <ButtonGroup variant="outlined" aria-label="outlined button group" className={`${style.gamaBalanceManageBtnGroup}`}>
                      <Button style={{ color: 'white', borderColor: 'white' }} onClick={depositClick}>Deposit</Button>
                      <Button style={{ color: 'white', borderColor: 'white' }} onClick={withdrawClick}>Withdraw</Button>
                      {
                        wallet && wallet.publicKey && ADMIN_PUBKEY.indexOf(wallet.publicKey.toBase58()) !== -1 &&
                        <Button style={{ color: 'white', borderColor: 'white' }} onClick={handledetailInfoClickOpen}>Detail Info</Button>
                      }

                    </ButtonGroup>
                  </div>
                }

              </div>
            }



          </div>

        </Toolbar>


      </AppBar>

      <Dialog
        fullScreen={fullScreen}
        open={detailInfoOpen}
        maxWidth={maxWidth}
        onClose={handledetailInfoClickClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" style={{ textAlign: 'center' }}>
          {"LUVAMI GAME DETAIL INFOMATION"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>

            <div style={{ margin: 'auto', maxWidth: '250px' }}>


              <p>Total SOL gambled : {totalSolGambled} SOL </p>
              <p>Total SOL won : {totalPlayerSolWon} SOL</p>
              <p>Total SOL lost : {totalPlayerSolLost} SOL</p>



              <p>Total games played : {totalGamePlayed}  </p>
              <p>Total games won : {totalPlayerGameWon} </p>
              <p>Total games lost : {totalPlayerGameLost} </p>


            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>

          <Button onClick={handledetailInfoClickClose} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>

  )
}

export default PageAppBar;