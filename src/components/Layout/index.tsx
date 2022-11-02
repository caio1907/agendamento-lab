import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Box, Container } from '@mui/material';

interface Props {
  children: React.ReactNode,
  logOut: () => void
}

const Root = styled('div')(({theme}) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280
  }
}));

const Dashboard:React.FC<Props> = ({
  children,
  logOut
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handleChangeSidebarState = () => setIsSidebarOpen(prev => !prev);
  return (
    <>
      <Root>
        <Container>
          <Box sx={{ pt: 2 }}>
            {children}
          </Box>
        </Container>
      </Root>
      <Navbar {...{logOut}} sidebarOnOpen={handleChangeSidebarState}/>
      <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>
    </>
  )
}
export default Dashboard;
