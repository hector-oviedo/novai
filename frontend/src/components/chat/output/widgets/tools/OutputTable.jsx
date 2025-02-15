import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const OutputTable = ({ content }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 1, overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: theme.palette.table.background,
          color: theme.palette.table.text,
        }}
      >
        <thead>
          <tr>
            {content.length > 0 &&
              Object.keys(content[0]).map((key) => (
                <th
                  key={key}
                  style={{
                    borderBottom: `1px solid ${theme.palette.table.border}`,
                    padding: '8px',
                    textAlign: 'left',
                  }}
                >
                  {key}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {content.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, idx) => (
                <td
                  key={idx}
                  style={{
                    borderBottom: `1px solid ${theme.palette.table.border}`,
                    padding: '8px',
                  }}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};