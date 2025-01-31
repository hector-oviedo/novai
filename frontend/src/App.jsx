import { InputWidget } from "./components/input/InputWidget";
import { OutputWidget } from "./components/output/OutputWidget";
import { SettingsWidget } from "./components/settings/SettingsWidget";

import { Box } from '@mui/material';

export const App = () => {

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%' }}>
      <SettingsWidget />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <OutputWidget />
        <InputWidget />
      </Box>
    </Box>
  );
};
