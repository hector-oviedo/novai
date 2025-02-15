import { useState } from 'react';
import { logoutUser } from "../../slices/userThunks";
import { Box, Button, Divider, Drawer, IconButton } from '@mui/material';
import { useDispatch } from "react-redux";
import { FaCog, FaPowerOff } from 'react-icons/fa';

import { SettingsPanel } from './SettingsPanel';
import { UserPanel } from './UserPanel';
import { SessionsWidget } from '../sessions/SessionsWidget';
import { PageNav } from './PageNav';

export const SettingsWidget = ({setActivePage, activePage }) => {
  const drawerWidth = 240;
  const dispatch = useDispatch();
  const [ open, setOpen ] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const toggleDrawer = () => { setOpen(!open); };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        width: open ? drawerWidth : 60,
        flexShrink: 0,
        height: '100%',
        '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 60,
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
        }}}>
      

      {/* UserPanel & Side Popup Toggle*/}
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', padding: '4px 8px' }}>

        {/* UserPanel */}
        <Box sx={{ display: open ? 'flex' : 'none', flexGrow: 1, justifyContent: 'flex-start' }}>
          <UserPanel />
        </Box>

        {/* Side Popup Toggle */}
        <IconButton
          onClick={toggleDrawer}
          sx={{
            borderRadius: '50%',
            alignSelf: 'flex-end',
          }}>
          <FaCog size={24} />
        </IconButton>
      </Box>

      <Divider sx={{display: open ? 'flex' : 'none'}}/>
      
      {/*Sections Nav*/}
      <Box sx={{ display: open ? 'block' : 'none', mb:2, mt:2 }}>
        <PageNav setActivePage={setActivePage}/>
      </Box>

      <Divider sx={{display: open ? 'flex' : 'none'}}/>

      {/* Logout Button */}
      <Button
        variant="contained"
        color="warning"
        sx={{
          borderRadius: '20px',
          m: 2,
          p: 0.5,
          pl:2,
          width: 'auto',
          fontSize: '12px',
          display: open ? 'flex' : 'none',
          alignItems: 'center',
          textAlign:'center',
          justifyContent: 'flex-start',
          gap: 1, }}
        onClick={handleLogout}>
      <FaPowerOff size={16} />
        Logout
      </Button>

      <Divider sx={{display: open ? 'flex' : 'none'}}/>

      {/*Chat Historial*/}

      <Box sx={{ padding: 2, display: open ? 'block' : 'none' }}>
        <SessionsWidget setActivePage={setActivePage} activePage={activePage}/>
      </Box>

      <Divider sx={{display: open ? 'flex' : 'none'}}/>

      {/*Dark Mode Toggle*/}
      <Box sx={{ pl: 2, display: open ? 'block' : 'none', mt: 'auto', mb:2 }}>
        <SettingsPanel/>
      </Box>
      
    </Drawer>
  )
}