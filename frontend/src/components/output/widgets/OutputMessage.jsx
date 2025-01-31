import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { OutputThink } from './tools/OutputThink';
import { OutputText } from './tools/OutputText';

export const OutputMessage = ({ msg }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
      <Box sx={{ p: 2, borderRadius: 2, width: '100%' }}>
        
        { msg.think && msg.think.trim() && (<OutputThink content={msg.think} thinking={msg.thinking}/>) }
        
        <OutputText content={msg.text}/>

      </Box>
    </Box>
  );
};