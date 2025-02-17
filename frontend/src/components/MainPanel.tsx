import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

interface Props {
    drawerWidth: number;
}

const MainPanel = (props: any) => {
    const { children } = props;// ${props.drawerWidth}
    return (
        <>
            <Box
                component="main"
                sx={{

                    flexGrow: 1,
                    p: 3,
                    width: { sm: `100%` },
                    height: '100vh',
                    overflow: 'auto',
                }}
            >

                <Container maxWidth="lg" sx={{ mt: 12 }}>
                    {/* <Typography paragraph>
                        <h3>Net Worth</h3>
                        <h4>$0.00</h4>

                    </Typography> */}
                    {children}

                </Container>
            </Box>
        </>
    );

}

export default MainPanel