// OutputText.jsx
import React from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { OutputSnippet } from './OutputSnippet';

export const OutputText = ({ content }) => {
  const components = {
    table: TableWidget,
    code({ inline, children }) {
      if (!inline) return <OutputSnippet content={String(children).trim()} />;
      return <code>{children}</code>;
    },
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={components}>
        {content}
    </ReactMarkdown>
  );
};

import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TableWidget = ({ children }) => {
  const theme = useTheme();
  return (
    <Box
      component="table"
      sx={{
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: 1,
        overflowX: 'auto',
        textAlign:'center',
        '& thead': {
          backgroundColor: theme.palette.table?.background || 'lightgray',
        },
        '& th, & td': {
          border: `1px solid ${theme.palette.table?.border || '#ccc'}`,
          padding: '8px',
        },
      }}
    >
      {children}
    </Box>
  );
};