import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

import { UserMessage } from './widgets/UserMessage';
import { OutputMessage } from './widgets/OutputMessage';
import { ErrorMessage } from './widgets/ErrorMessage';

export const OutputWidget = () => {
  const messages = useSelector((state) => state.messages.messages);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
      ref={scrollRef}
      sx={{
        width: '100%',
        flexGrow: 1,
        overflowY: 'auto',
        maxHeight: '100vh',
        p: 2,
        bgcolor: 'background.default',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-thumb': { backgroundColor: 'primary.main', borderRadius: '4px' },
      }}>
      {messages.map((msg, index) => {
        switch (msg.type) {
          case 'user':
            return <UserMessage key={index} content={msg.text} />;
          case 'output':
            return <OutputMessage key={index} msg={msg} />;
          case 'error':
            return <ErrorMessage key={index} content={msg.text} />;
          default:
            return null;
        }
      })}
    </Box>
  );
};