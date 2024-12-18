/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';

import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { SignInButton } from './SignInButton';
import { SignOutButton } from './SignOutButton';
import { AppBar, Avatar, Box, FormControl, FormHelperText, IconButton, InputLabel, Menu, MenuItem, Select, Toolbar, Typography } from '@mui/material';

import AccountCircle from '@mui/icons-material/AccountCircle';
import { getUserPhoto } from '../services/GraphService';
import useEnhancedEffect from '@mui/material/utils/useEnhancedEffect';
import { loginRequest } from '../authConfig';

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props
 */
export const PageLayout = (props) => {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [photoBlob, setPhotoBlob] = useState(null);

  useEnhancedEffect(() => {
    if (isAuthenticated) {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        .then((response) => {
          getMyPhoto(response.accessToken)
        })
    }
  }, [isAuthenticated])

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  const blobToBase64 = (blob) => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const getMyPhoto = async (accessToken) => {
    return await getUserPhoto('me', accessToken)
      .then(function (response) {
        if (response.ok) {
          return response.blob();
        }
      })
      .then(function (photoBlob) {
        if (photoBlob) {
          var blob = blobToBase64(photoBlob);
          setPhotoBlob(blob);
        } else {
          return 'https://randomuser.me/api/portraits/men/46.jpg';
        }
      });
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>{props?.accounts?.username}</MenuItem>
      <MenuItem onClick={handleMenuClose}><SignOutButton /></MenuItem>
    </Menu>
  );

  
  const handleChange = (event) => {
    let workspace = props.allWorkSpaceDetails.find(x=>x.hospitalId == event.target.value)
    props.setWorkSpaceDetails(workspace);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
        <img src="/DeepForrest_logo.svg" class="logo"/>
          <Typography
            variant="h6"
            noWrap
            component="div"
            class="logodiv"
            sx={{ display: { xs: 'block' } }}
          >
             {props?.workSpaceDetails?.name ? <> | <p class="logtxt"> {props?.workSpaceDetails.name} </p> </>: null}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          {isAuthenticated ?
            <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
              {props.allWorkSpaceDetails?.length > 1 ?

                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={props.workSpaceDetails.hospitalId}
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={handleChange}
                    className="hospital"
                  >
                    {props.allWorkSpaceDetails.map(x=>{
                      return <MenuItem value={x.hospitalId}>{x.hospitalName}</MenuItem>
                    })}
                  </Select>
                </FormControl> : null}

              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {photoBlob ?
                  <Avatar
                    size={100}
                    alt={"IMAGE"}
                    src={photoBlob}
                  /> :
                  <AccountCircle />}
              </IconButton>
            </Box> : null}
        </Toolbar>
      </AppBar>
      {renderMenu}

      {props.children}
    </Box>
  );
};
