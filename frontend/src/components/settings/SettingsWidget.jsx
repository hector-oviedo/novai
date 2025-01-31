import { useState } from 'react';

import { Box, Drawer, IconButton } from '@mui/material';
import { FaCog } from 'react-icons/fa';

import { SettingsPanel } from './SettingsPanel';

export const SettingsWidget = () => {
  const drawerWidth = 240;

  const [ open, setOpen ] = useState(false);

  const toggleDrawer = () => { setOpen(!open); };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : 60,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 60,
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
        }}}>
      
      <IconButton
        onClick={toggleDrawer}
        sx={{
          margin: 1,
          borderRadius: '50%',
          alignSelf: 'flex-end',
          }}>
        <FaCog size={24}/>
      </IconButton>

      <Box sx={{ padding: 2, display: open ? 'block' : 'none' }}>
        <SettingsPanel/>
      </Box>
    </Drawer>
  )
}