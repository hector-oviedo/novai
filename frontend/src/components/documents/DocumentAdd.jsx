import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadDocument, fetchDocuments } from "../../slices/documentsThunks";
import { Box, Button, TextField, Typography, Input, FormHelperText } from "@mui/material";
import { FiUpload } from "react-icons/fi";
import { useTheme } from "@mui/material/styles";

export const DocumentAdd = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = ["application/pdf", "text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only PDF, TXT, and DOCX files are allowed.");
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!name || !file) {
      setError("Document name and file are required.");
      return;
    }

    dispatch(uploadDocument({ userId, name, description, file }))
      .unwrap()
      .then(() => dispatch(fetchDocuments(userId)));

    setName("");
    setDescription("");
    setFile(null);
  };

  return (
    <Box sx={{ p: 2, border: `1px solid ${theme.palette.primary.border}`, borderRadius: "8px", mb: 2 }}>
      <Typography variant="h6">Add Document</Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            label="Document Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            border: `2px dashed ${theme.palette.uploadWidget.border}`,
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            p:2,
            m:1,
            mt:2,
            backgroundColor: theme.palette.uploadWidget.background,
            "&:hover": { backgroundColor: theme.palette.uploadWidget.hover },
          }}
          onClick={() => document.getElementById("fileInput").click()}
        >
          <input id="fileInput" type="file" hidden onChange={handleFileChange} />
          <Box display="flex" flexDirection="column" alignItems="center">
            <FiUpload size={50} color={theme.palette.uploadWidget.text} />
            <Typography variant="body2" color={theme.palette.uploadWidget.text}>
              Click to upload
            </Typography>
          </Box>
        </Box>
      </Box>

      {error && <FormHelperText error>{error}</FormHelperText>}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleUpload} disabled={!name || !file}>
          Upload
        </Button>
      </Box>
    </Box>
  );
};
