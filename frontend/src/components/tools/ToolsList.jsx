import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import { ToolItem } from "./ToolItem";

export const ToolsList = ({ tools }) => {
  if (!tools || !Array.isArray(tools) || tools.length === 0) {
    return <Typography>No function tools available.</Typography>;
  }

  return (
    <TableContainer component={Paper} sx={{borderRadius:'0'}}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Rules</TableCell>
            {/*<TableCell align="right">Sessions</TableCell>*/}
          </TableRow>
        </TableHead>
        <TableBody>
          {tools.map((tool, i) => (
            <ToolItem key={i} tool={tool} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
