import { Box, Typography, Paper, IconButton, Collapse } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '@mui/material/styles';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useState } from 'react';
import { motion } from 'framer-motion';

export const OutputThink = ({ content, thinking }) => {
  const theme = useTheme();
  const [ expanded, setExpanded ] = useState(true);
  const [ isThinking, setIsThinking ] = useState(thinking || false);

  return (
    <Box sx={{ mt: 1, overflowX: 'auto' }}>
      <Paper
        sx={{
          p: 1.5,
          bgcolor: theme.palette.think.background,
          color: theme.palette.think.text,
          border: `1px solid ${theme.palette.think.border}`,
          borderRadius: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <Typography
            component={isThinking ? motion.div : 'div'}
            initial={{ opacity: 0.6 }}
            animate={isThinking ? { opacity: [0.6, 1, 0.6] } : {}}
            transition={isThinking ? { duration: 1.5, repeat: Infinity } : {}}
            variant="subtitle1"
            sx={{
              letterSpacing:2,
              fontWeight: '500', 
              textAlign:'center',
              width:'100%'}}>
            THINKING
          </Typography>
          <IconButton size="small">
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>

            <Box sx={{pl:2, pr:2}}>
              {
                <ReactMarkdown>{content}</ReactMarkdown>
              }
            </Box>

        </Collapse>
      </Paper>
    </Box>
  );
};
