import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';
import SettingIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { styled } from '@mui/system';
import { createSvgIcon } from '@mui/material/utils';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';

import style from './SideBar.module.css'
import {
    useConnection,
    useWallet,
} from '@solana/wallet-adapter-react';
import { Typography } from '@mui/material';

const HomeFillIcon = createSvgIcon(
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M10.5 4.32206L18.375 12.1971V17.7188C18.375 18.2409 18.1676 18.7417 17.7984 19.1109C17.4292 19.4801 16.9284 19.6875 16.4062 19.6875H4.59375C4.07161 19.6875 3.57085 19.4801 3.20163 19.1109C2.83242 18.7417 2.625 18.2409 2.625 17.7188V12.1971L10.5 4.32206ZM17.0625 3.28125V7.875L14.4375 5.25V3.28125C14.4375 3.1072 14.5066 2.94028 14.6297 2.81721C14.7528 2.69414 14.9197 2.625 15.0938 2.625H16.4062C16.5803 2.625 16.7472 2.69414 16.8703 2.81721C16.9934 2.94028 17.0625 3.1072 17.0625 3.28125Z" fill="white" />
        <path fillRule="evenodd" clipRule="evenodd" d="M9.57204 1.96875C9.81817 1.7227 10.1519 1.58447 10.5 1.58447C10.848 1.58447 11.1818 1.7227 11.4279 1.96875L20.1521 10.6916C20.2753 10.8149 20.3446 10.982 20.3446 11.1563C20.3446 11.3305 20.2753 11.4977 20.1521 11.6209C20.0289 11.7441 19.8617 11.8133 19.6875 11.8133C19.5132 11.8133 19.3461 11.7441 19.2228 11.6209L10.5 2.89669L1.7771 11.6209C1.65387 11.7441 1.48674 11.8133 1.31247 11.8133C1.13821 11.8133 0.971076 11.7441 0.84785 11.6209C0.724623 11.4977 0.655396 11.3305 0.655396 11.1563C0.655396 10.982 0.724623 10.8149 0.84785 10.6916L9.57204 1.96875Z" fill="white" />
    </svg>,
    'HomeFill',
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
const GlobalEarth = createSvgIcon(
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 10.5C0 7.71523 1.10625 5.04451 3.07538 3.07538C5.04451 1.10625 7.71523 0 10.5 0C13.2848 0 15.9555 1.10625 17.9246 3.07538C19.8938 5.04451 21 7.71523 21 10.5C21 13.2848 19.8938 15.9555 17.9246 17.9246C15.9555 19.8938 13.2848 21 10.5 21C7.71523 21 5.04451 19.8938 3.07538 17.9246C1.10625 15.9555 0 13.2848 0 10.5ZM9.84375 1.41356C8.96437 1.68131 8.09156 2.48981 7.36706 3.84825C7.12836 4.29988 6.92306 4.76838 6.75281 5.25H9.84375V1.41356ZM5.36812 5.25C5.58688 4.55282 5.86802 3.87678 6.20813 3.23006C6.43507 2.80095 6.69715 2.39136 6.99169 2.0055C5.3655 2.6799 3.96638 3.80575 2.95969 5.25H5.36812ZM4.60425 9.84375C4.64362 8.69269 4.78538 7.58887 5.01375 6.5625H2.19712C1.70772 7.59288 1.41568 8.70583 1.33613 9.84375H4.60425ZM6.36169 6.5625C6.10354 7.63849 5.95491 8.73784 5.91806 9.84375H9.84375V6.5625H6.36169ZM11.1562 6.5625V9.84375H15.0806C15.0443 8.73788 14.8961 7.63853 14.6383 6.5625H11.1562ZM5.91938 11.1562C5.95579 12.2621 6.10398 13.3615 6.36169 14.4375H9.84375V11.1562H5.91938ZM11.1562 11.1562V14.4375H14.6383C14.8837 13.4334 15.0399 12.327 15.0819 11.1562H11.1562ZM6.75281 15.75C6.93394 16.2566 7.14 16.7265 7.36706 17.1518C8.09156 18.5102 8.96569 19.3174 9.84375 19.5864V15.75H6.75281ZM6.99169 18.9945C6.69713 18.6087 6.43505 18.1991 6.20813 17.7699C5.86803 17.1232 5.58689 16.4472 5.36812 15.75H2.95969C3.96633 17.1943 5.36547 18.3202 6.99169 18.9945ZM5.01375 14.4375C4.7764 13.3587 4.63932 12.2603 4.60425 11.1562H1.33613C1.4175 12.3244 1.71806 13.4308 2.19712 14.4375H5.01375ZM14.0083 18.9945C15.6345 18.3202 17.0337 17.1943 18.0403 15.75H15.6319C15.4131 16.4472 15.132 17.1232 14.7919 17.7699C14.565 18.1991 14.3029 18.6087 14.0083 18.9945ZM11.1562 15.75V19.5864C12.0356 19.3187 12.9084 18.5102 13.6329 17.1518C13.86 16.7265 14.0661 16.2566 14.2472 15.75H11.1562ZM15.9862 14.4375H18.8029C19.2819 13.4308 19.5825 12.3244 19.6639 11.1562H16.3958C16.3607 12.2603 16.2236 13.3587 15.9862 14.4375ZM19.6639 9.84375C19.5843 8.70583 19.2923 7.59289 18.8029 6.5625H15.9862C16.2146 7.58887 16.3564 8.69269 16.3958 9.84375H19.6639ZM14.7919 3.23006C15.1161 3.83906 15.3982 4.51631 15.6319 5.25H18.0403C17.0337 3.8057 15.6345 2.67983 14.0083 2.0055C14.2944 2.37825 14.5569 2.79037 14.7919 3.23006ZM14.2472 5.25C14.077 4.76837 13.8717 4.29987 13.6329 3.84825C12.9084 2.48981 12.0356 1.68263 11.1562 1.41356V5.25H14.2472Z" fill="white" />
    </svg>,
    'GlobalEarth',
);
const SidebarButton = styled(Button)(({ theme }) => ({
    width: "100%",
    fontSize: 16,
    fontWeight: 900,
    borderRadius: 10,
    textTransform: "uppercase",
    padding: "10px 15px",
    color: "#fff",
    position: "relative",
    fontFamily: "Open Sans",
    borderBottom: "1px solid #00000052",
    float: 'left',
    display: 'block',
    "& span": {
        paddingLeft: 10,
        textAlign: "left",
        float: 'left',
        marginLeft: 20,
    },
    "& i": {
        float: 'left',
        width: "30px !important"
    }
}));

interface Props {

    drawerWidth: number;
    // window?: () => Window;
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
}

const SideBar = (props: Props) => {
    // const { window } = props;
    // const container = window !== undefined ? () => window().document.body : undefined;
    const wallet = useWallet();
    const { connection } = useConnection();
    let walletAddress = "";
    if (wallet.connected && wallet.publicKey) {
        walletAddress = wallet.publicKey.toString()
    }

    const drawer = (
        <div>
            <Toolbar >
                Sonar
            </Toolbar>
            <Divider />
            <Box sx={{ p: 1 }}>
                <FormControl fullWidth >
                    {wallet.connected ?
                        <Select defaultValue='0'>
                            <MenuItem value='0' selected>
                                {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                            </MenuItem>
                        </Select> :
                        <Button color="inherit" disableElevation fullWidth style={{ height: '48px' }}>
                            Track an address
                        </Button>
                    }
                </FormControl>

            </Box>
            <Divider />

            <Box sx={{ p: 1 }}>
                <Link href="#" underline="none" color="inherit">
                    <SidebarButton>
                        <i><DashboardIcon /></i>
                        <span>Dashboard</span>
                    </SidebarButton>
                </Link>
            </Box>
            <Box sx={{ p: 1 }}>
                <Link href="#" underline="none" color="inherit">
                    <SidebarButton>
                        <i><SettingIcon /></i>
                        <span>settings</span>
                    </SidebarButton>
                </Link>
            </Box>
        </div >
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: props.drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="side bar"
            className={`${style.appSideBar}`}
        >
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            {/* <Drawer
                variant="temporary"
                open={props.mobileOpen}
                onClose={props.handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: props.drawerWidth },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: props.drawerWidth },
                }}
                open
            >
                <Toolbar />
                {drawer}
            </Drawer> */}
            <Drawer
                variant="permanent"
                sx={{
                    width: props.drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: props.drawerWidth },

                }}
                className={`${style.sideBar}`}
            >
                {/* , boxSizing: 'border-box' */}
                <Toolbar style={{ minHeight: '90px' }} />
                <Box className={`${style.sideBarWrapper}`}>
                    <List>
                        <Link href="#" underline="none">

                            <ListItem button key={'Homepage'} className={`${style.sidebarMenuItem}`}>
                                <ListItemIcon style={{ marginRight: "10px", minWidth: 'auto' }}>
                                    <HomeFillIcon />
                                </ListItemIcon>
                                <ListItemText primary={`Homepage`} className={`${style.sideBarMenuText}`} />
                            </ListItem>
                        </Link>
                        <ListItem button key={'Games'} className={`${style.sidebarMenuItem}`}>
                            <ListItemIcon style={{ marginRight: "10px", minWidth: 'auto' }}>
                                <DiamondHalf />
                            </ListItemIcon>
                            <ListItemText primary={`Games`} className={`${style.sideBarMenuText}`} />
                        </ListItem>
                        <ListItem button key={'KindKoalas'} className={`${style.sidebarMenuItem}`}>
                            <ListItemIcon style={{ marginRight: "10px", minWidth: 'auto' }}>
                                <GlobalEarth />
                            </ListItemIcon>
                            <ListItemText primary={`Kind Koalas`} className={`${style.sideBarMenuTextWithImg}`} />
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
                            </svg>

                        </ListItem>

                    </List>
                </Box>
                <Box style={{ padding: '0px 30px 0px 25px', marginBottom: '55px' }}>
                    <Typography className={`${style.subtitle}`}>
                        CURRENT PROJECTS
                    </Typography>
                    <Button className={`${style.sidebarBtn}`} style={{ color: 'white' }}>
                        <span className={`${style.imgWrapper}`}>
                            {/* eslint-disable-next-line */}
                            <img src='./img/Group 1467.png' alt='koala' />
                        </span>
                        <span>
                            Kind Koalas Club
                        </span>

                    </Button>
                    <Typography className={`${style.sidebarDescription}`}>
                        Want to get listed? <Link href="#" color='#D6D6D6'>Apply here</Link>
                    </Typography>
                </Box>
                <Box style={{ padding: '0px 30px 0px 25px', marginBottom: '75px' }}>
                    <Typography className={`${style.subtitle}`}>
                        GAME LIST
                    </Typography>
                    <Button className={`${style.sidebarBtn}`} style={{ marginBottom: '19px', color: 'white' }}>
                        <span className={`${style.imgWrapper}`}>

                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_2_51)">
                                    <path d="M3.375 0C2.47989 0 1.62145 0.355579 0.988515 0.988515C0.355579 1.62145 0 2.47989 0 3.375L0 14.625C0 15.5201 0.355579 16.3786 0.988515 17.0115C1.62145 17.6444 2.47989 18 3.375 18H14.625C15.5201 18 16.3786 17.6444 17.0115 17.0115C17.6444 16.3786 18 15.5201 18 14.625V3.375C18 2.47989 17.6444 1.62145 17.0115 0.988515C16.3786 0.355579 15.5201 0 14.625 0L3.375 0ZM6.1875 4.5C6.1875 4.94755 6.00971 5.37678 5.69324 5.69324C5.37678 6.00971 4.94755 6.1875 4.5 6.1875C4.05245 6.1875 3.62322 6.00971 3.30676 5.69324C2.99029 5.37678 2.8125 4.94755 2.8125 4.5C2.8125 4.05245 2.99029 3.62322 3.30676 3.30676C3.62322 2.99029 4.05245 2.8125 4.5 2.8125C4.94755 2.8125 5.37678 2.99029 5.69324 3.30676C6.00971 3.62322 6.1875 4.05245 6.1875 4.5ZM15.1875 4.5C15.1875 4.94755 15.0097 5.37678 14.6932 5.69324C14.3768 6.00971 13.9476 6.1875 13.5 6.1875C13.0524 6.1875 12.6232 6.00971 12.3068 5.69324C11.9903 5.37678 11.8125 4.94755 11.8125 4.5C11.8125 4.05245 11.9903 3.62322 12.3068 3.30676C12.6232 2.99029 13.0524 2.8125 13.5 2.8125C13.9476 2.8125 14.3768 2.99029 14.6932 3.30676C15.0097 3.62322 15.1875 4.05245 15.1875 4.5ZM13.5 15.1875C13.0524 15.1875 12.6232 15.0097 12.3068 14.6932C11.9903 14.3768 11.8125 13.9476 11.8125 13.5C11.8125 13.0524 11.9903 12.6232 12.3068 12.3068C12.6232 11.9903 13.0524 11.8125 13.5 11.8125C13.9476 11.8125 14.3768 11.9903 14.6932 12.3068C15.0097 12.6232 15.1875 13.0524 15.1875 13.5C15.1875 13.9476 15.0097 14.3768 14.6932 14.6932C14.3768 15.0097 13.9476 15.1875 13.5 15.1875ZM6.1875 13.5C6.1875 13.9476 6.00971 14.3768 5.69324 14.6932C5.37678 15.0097 4.94755 15.1875 4.5 15.1875C4.05245 15.1875 3.62322 15.0097 3.30676 14.6932C2.99029 14.3768 2.8125 13.9476 2.8125 13.5C2.8125 13.0524 2.99029 12.6232 3.30676 12.3068C3.62322 11.9903 4.05245 11.8125 4.5 11.8125C4.94755 11.8125 5.37678 11.9903 5.69324 12.3068C6.00971 12.6232 6.1875 13.0524 6.1875 13.5ZM9 10.6875C8.55245 10.6875 8.12322 10.5097 7.80676 10.1932C7.49029 9.87678 7.3125 9.44755 7.3125 9C7.3125 8.55245 7.49029 8.12322 7.80676 7.80676C8.12322 7.49029 8.55245 7.3125 9 7.3125C9.44755 7.3125 9.87678 7.49029 10.1932 7.80676C10.5097 8.12322 10.6875 8.55245 10.6875 9C10.6875 9.44755 10.5097 9.87678 10.1932 10.1932C9.87678 10.5097 9.44755 10.6875 9 10.6875Z" fill="white" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_2_51">
                                        <rect width="18" height="18" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>

                        </span>
                        <span className="color-white">
                            Roll the Dice
                        </span>

                    </Button>
                    <Button className={`${style.sidebarBtn}`} style={{ marginBottom: '19px' }} disabled>
                        <span className={`${style.imgWrapper}`}>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_2_54)">
                                    <rect width="22" height="22" rx="11" fill="#3E3B3E" />
                                    <path d="M11 20.625C8.44729 20.625 5.99913 19.6109 4.1941 17.8059C2.38906 16.0009 1.375 13.5527 1.375 11C1.375 8.44729 2.38906 5.99913 4.1941 4.1941C5.99913 2.38906 8.44729 1.375 11 1.375C13.5527 1.375 16.0009 2.38906 17.8059 4.1941C19.6109 5.99913 20.625 8.44729 20.625 11C20.625 13.5527 19.6109 16.0009 17.8059 17.8059C16.0009 19.6109 13.5527 20.625 11 20.625ZM11 22C13.9174 22 16.7153 20.8411 18.7782 18.7782C20.8411 16.7153 22 13.9174 22 11C22 8.08262 20.8411 5.28473 18.7782 3.22183C16.7153 1.15893 13.9174 0 11 0C8.08262 0 5.28473 1.15893 3.22183 3.22183C1.15893 5.28473 0 8.08262 0 11C0 13.9174 1.15893 16.7153 3.22183 18.7782C5.28473 20.8411 8.08262 22 11 22Z" fill="#232124" />
                                    <path d="M11 18.5625C8.9943 18.5625 7.07075 17.7657 5.65251 16.3475C4.23426 14.9293 3.4375 13.0057 3.4375 11C3.4375 8.9943 4.23426 7.07075 5.65251 5.65251C7.07075 4.23426 8.9943 3.4375 11 3.4375C13.0057 3.4375 14.9293 4.23426 16.3475 5.65251C17.7657 7.07075 18.5625 8.9943 18.5625 11C18.5625 13.0057 17.7657 14.9293 16.3475 16.3475C14.9293 17.7657 13.0057 18.5625 11 18.5625ZM11 19.25C12.0834 19.25 13.1562 19.0366 14.1571 18.622C15.1581 18.2074 16.0675 17.5997 16.8336 16.8336C17.5997 16.0675 18.2074 15.1581 18.622 14.1571C19.0366 13.1562 19.25 12.0834 19.25 11C19.25 9.91659 19.0366 8.8438 18.622 7.84286C18.2074 6.84193 17.5997 5.93245 16.8336 5.16637C16.0675 4.40029 15.1581 3.7926 14.1571 3.37799C13.1562 2.96339 12.0834 2.75 11 2.75C8.81196 2.75 6.71354 3.61919 5.16637 5.16637C3.61919 6.71354 2.75 8.81196 2.75 11C2.75 13.188 3.61919 15.2865 5.16637 16.8336C6.71354 18.3808 8.81196 19.25 11 19.25Z" fill="#232124" />
                                    <path d="M7.5625 13.0776C7.667 14.3894 8.70375 15.411 10.5628 15.532V16.5H11.3877V15.5251C13.3127 15.3904 14.4375 14.3619 14.4375 12.8686C14.4375 11.5115 13.5768 10.8116 12.0381 10.4486L11.3877 10.2946V7.65875C12.2127 7.75225 12.738 8.20325 12.8645 8.8275H14.311C14.2065 7.56387 13.123 6.57525 11.3877 6.468V5.5H10.5628V6.48862C8.91963 6.6495 7.799 7.63813 7.799 9.0365C7.799 10.274 8.63225 11.0605 10.0169 11.3836L10.5628 11.5184V14.3151C9.71713 14.1873 9.1575 13.7239 9.031 13.0776H7.5625ZM10.5559 10.0994C9.74463 9.911 9.30463 9.52737 9.30463 8.94987C9.30463 8.30362 9.779 7.81963 10.5628 7.678V10.098H10.5559V10.0994ZM11.5074 11.7397C12.4933 11.968 12.9484 12.3379 12.9484 12.991C12.9484 13.7362 12.3819 14.2478 11.3877 14.3413V11.7122L11.5074 11.7397Z" fill="#232124" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_2_54">
                                        <rect width="22" height="22" rx="11" fill="#232124" />
                                    </clipPath>
                                </defs>
                            </svg>

                        </span>
                        <span>
                            Flip the Coin
                        </span>

                    </Button>
                    <Button className={`${style.sidebarBtn}`} style={{ marginBottom: '13px' }} disabled>
                        <span className={`${style.imgWrapper}`}>
                            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 9.5C19 12.0196 17.9991 14.4359 16.2175 16.2175C14.4359 17.9991 12.0196 19 9.5 19C6.98044 19 4.56408 17.9991 2.78249 16.2175C1.00089 14.4359 0 12.0196 0 9.5C0 6.98044 1.00089 4.56408 2.78249 2.78249C4.56408 1.00089 6.98044 0 9.5 0C12.0196 0 14.4359 1.00089 16.2175 2.78249C17.9991 4.56408 19 6.98044 19 9.5ZM6.5265 7.16419H7.50619C7.67006 7.16419 7.80069 7.03 7.82206 6.86731C7.92894 6.08831 8.46331 5.52069 9.41569 5.52069C10.2303 5.52069 10.9761 5.928 10.9761 6.90769C10.9761 7.66175 10.5319 8.0085 9.83012 8.53575C9.03094 9.11644 8.398 9.7945 8.44312 10.8953L8.44669 11.153C8.44793 11.2309 8.47976 11.3052 8.5353 11.3599C8.59084 11.4145 8.66564 11.4451 8.74356 11.4451H9.70662C9.78536 11.4451 9.86087 11.4138 9.91655 11.3582C9.97222 11.3025 10.0035 11.227 10.0035 11.1482V11.0236C10.0035 10.1709 10.3277 9.92275 11.2029 9.25894C11.9261 8.70912 12.6801 8.09875 12.6801 6.81744C12.6801 5.02313 11.1649 4.15625 9.50594 4.15625C8.00138 4.15625 6.35313 4.85687 6.24031 6.87087C6.23869 6.90922 6.24492 6.9475 6.25864 6.98335C6.27235 7.0192 6.29325 7.05187 6.32006 7.07934C6.34687 7.10681 6.37901 7.12851 6.41451 7.1431C6.45001 7.15769 6.48812 7.16487 6.5265 7.16419ZM9.28744 14.8152C10.0118 14.8152 10.5094 14.3474 10.5094 13.7144C10.5094 13.0589 10.0106 12.5982 9.28744 12.5982C8.59394 12.5982 8.08925 13.0589 8.08925 13.7144C8.08925 14.3474 8.59394 14.8152 9.28862 14.8152H9.28744Z" fill="#3E3B3E" />
                            </svg>

                        </span>
                        <span>
                            Guess the Number
                        </span>

                    </Button>
                    <Typography className={`${style.sidebarDescription}`}>
                        With more games being added
                    </Typography>
                </Box>
                <Box style={{ padding: '0px 30px 0px 25px', marginBottom: '75px' }}>
                    <div className={`${style.eventBox}`}>
                        <p className={`${style.eventTitle}`}>
                            SPECIAL EVENT
                        </p>
                        <p className={`${style.eventContent}`}>
                            Lorem ipsum dorem amit amet dorem lorem liupsum aveci avecta
                        </p>
                    </div>
                </Box>
                <Box style={{ padding: '0px 30px 0px 25px' }}>
                    <div>
                        <Typography className={`${style.sidebarDescription2}`} >
                            Want to earn royalties?
                            <Link href="#" color='#D6D6D6'>Get Koala</Link>
                        </Typography>
                        <Typography className={`${style.sidebarDescription2}`}>
                            Discovered a bug?
                            <Link href="#" color='#D6D6D6'>Report it</Link>
                        </Typography>
                        <Typography className={`${style.sidebarDescription2}`}>
                            Want to get listed?
                            <Link href="#" color='#D6D6D6'>Apply here</Link>
                        </Typography>
                    </div>
                </Box>
            </Drawer>
        </Box>
    );
}

export default SideBar;