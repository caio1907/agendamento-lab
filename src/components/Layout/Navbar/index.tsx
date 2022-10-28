import React from 'react';
import styled from '@emotion/styled';
import { AppBar, Box, IconButton, Toolbar, Tooltip } from '@mui/material';
import * as Icon from '@mui/icons-material'

interface Props {
  logOut: () => void
  sidebarOnOpen: () => void
}

const Root = styled(AppBar)(({ theme }:any) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3]
}))

const Navbar:React.FC<Props> = ({
  logOut,
  sidebarOnOpen
}) => {
  return (
    <>
      <Root
        sx={{
          left: {
            lg: 280
          },
          width: {
            lg: 'calc(100% - 280px)'
          }
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={sidebarOnOpen}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none'
              }
            }}
          >
            <Icon.Menu fontSize='small'/>
          </IconButton>
          <Tooltip title='Search'>
            <IconButton sx={{ ml: 1 }}>
              <Icon.Search fontSize='small' />
            </IconButton>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title='Sair'>
            <IconButton sx={{ ml: 1 }} onClick={logOut}>
              <Icon.Logout fontSize='small' />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </Root>
    </>
  )
}
export default Navbar;
