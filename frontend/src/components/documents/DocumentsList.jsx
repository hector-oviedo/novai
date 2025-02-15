import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import { DocumentItem } from "./DocumentItem";

export const DocumentsList = ({ documents }) => {
  if (!documents || !Array.isArray(documents) || documents.length === 0) {
    return null;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left"><Typography fontWeight="bold">Name</Typography></TableCell>
            <TableCell align="center"><Typography fontWeight="bold">Description</Typography></TableCell>
            <TableCell align="center"><Typography fontWeight="bold">Total Sessions</Typography></TableCell>
            <TableCell align="right"><Typography fontWeight="bold">Actions</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc, i) => (
            <DocumentItem key={i} document={doc} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
