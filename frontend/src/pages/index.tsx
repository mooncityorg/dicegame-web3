import type { NextPage } from "next";
import React from 'react';
import Head from "next/head";
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import PageAppBar from '../components/AppBar/PageAppBar';
import SideBar from '../components/AppBar/SideBar';
import MainPanel from '../components/MainPanel';
import { MainContent } from '../components/Dashboard';
import { ToastContainer } from 'react-toastify';

const drawerWidth = 280;

const Home: NextPage = (props) => {

  const [gameBalance, setGameBalance] = React.useState(0);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileAppBarOpened, setMobileAppBarOpened] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileAppBarOpened = () => {
    setMobileAppBarOpened(!mobileAppBarOpened)
  };


  return (

    <>

      <CssBaseline />
      <PageAppBar
        gameBalance={gameBalance}
        setGameBalance={(value) => setGameBalance(value)} handleMobileAppBarOpened={handleMobileAppBarOpened} />


      <SideBar drawerWidth={drawerWidth} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      <MainContent drawerWidth={drawerWidth} gameBalance={gameBalance}
        setGameBalance={(value) => setGameBalance(value)} mobileAppBarOpened={mobileAppBarOpened} />
      {/* <MainPanel
        drawerWidth={drawerWidth}
      >
        <Dashboard
          searchAddress={searchAddress}

        />
      </MainPanel> */}
      <ToastContainer />
    </>

  );
};

export default Home;
