import { Box, Button, ListItem } from '@mui/material';
import React from 'react';
import { NavLink as NavLinkRouterDom, useLocation } from 'react-router-dom';
import { ScreenProps } from '../../../screens';

const NavLink:React.FC<ScreenProps> = ({
  icon, name, path
}) => {
  const location = useLocation();
  const isRouteActive = location.pathname === path;
  return (
    <ListItem
      disableGutters
      sx={{
        display: 'flex',
        mb: 0.5,
        py: 0,
        px: 2
      }}
    >
      <Button
        component={NavLinkRouterDom}
        to={path}
        startIcon={icon}
        disableRipple
        sx={{
          backgroundColor: isRouteActive ? 'rgba(255,255,255, 0.08)' : '',
          borderRadius: 1,
          color: isRouteActive ? 'secondary.main' : 'neutral.300',
          fontWeight: isRouteActive ? 'fontWeightBold' :'',
          justifyContent: 'flex-start',
          px: 3,
          textAlign: 'left',
          textTransform: 'none',
          width: '100%',
          '& .MuiButton-startIcon': {
            color: isRouteActive ? 'secondary.main' : 'neutral.400'
          },
          '&:hover': {
            backgroundColor: 'rgba(255,255,255, 0.08)'
          }
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {name}
        </Box>
      </Button>
    </ListItem>
  )
}
export default NavLink
