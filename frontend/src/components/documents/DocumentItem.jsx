import { Box, TableRow, TableCell, Typography, IconButton } from "@mui/material";
import { FaTrashAlt } from "react-icons/fa"; 
import { useDispatch, useSelector } from "react-redux";
import { removeDocument, fetchDocuments } from "../../slices/documentsThunks";

export const DocumentItem = ({ document }) => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.user);

  const handleRemove = async () => {
    if (window.confirm(`Are you sure you want to delete "${document.name}"?`)) {
      dispatch(removeDocument(document.id)).then(() => dispatch(fetchDocuments(userId)));
    }
  };

  if (!document || !document.id || !document.name || !document.description || !document.sessions) {
    return null;
  }

  return (
    <TableRow>
      <TableCell align="left">
        <Typography variant="body1" fontWeight="bold">
          {document.name}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography variant="body2">{document.description}</Typography>
      </TableCell>
      <TableCell align="center">
        <Typography variant="body2">{document.sessions.length}</Typography>
      </TableCell>
      <TableCell align="right">
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <IconButton
          color="error"
          size="small"
          onClick={handleRemove}>
          <FaTrashAlt />
        </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};