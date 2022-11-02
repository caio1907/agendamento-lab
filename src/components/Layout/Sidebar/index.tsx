import React from 'react';
import { Box, Divider, Drawer, useMediaQuery } from '@mui/material';
import screens from '../../../screens';
import NavLink from '../NavLink';
import logo from '../../../logo.svg';
import useStyles from './styles';

interface Props {
  open: boolean,
  onClose?: () => void
}

export const Sidebar:React.FC<Props> = ({ open, onClose }) => {
  const classes = useStyles();
  const lgUp = useMediaQuery((theme:any) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 2
        }}>
          <img src={logo} className={classes.logo} alt="Agendamento" />
        </Box>
        <Divider
          sx={{
            borderColor: '#2D3748',
            mb: 1
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {screens.map((item, index) => (
            <NavLink
              {...item}
              key={index}
            />
          ))}
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor='left'
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant='temporary'
    >
      {content}
    </Drawer>
  );
};

export default Sidebar;
