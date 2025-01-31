import { Typography, Switch, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../../slices/settingsSlice';

export const SettingsPanel = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.settings.darkMode);

  return (
    <Box sx={{ p: 3, width: '210px' }}>
      <Typography variant="h6">
        Settings
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body1">Dark Mode</Typography>
        <Switch checked={darkMode} onChange={() => dispatch(toggleDarkMode())} />
      </Box>
    </Box>
  );
};
