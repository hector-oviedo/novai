import { useState } from "react";
import { Box, IconButton, Dialog, Typography, Button } from '@mui/material';
import { AiOutlinePaperClip } from 'react-icons/ai';

export const FileAttachmentWidget = ({ disabled, onFileSelect }) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const allowedTypes = ['text/plain', 'application/msword', 
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && allowedTypes.includes(file.type)) {
      setSelectedFile(file);
      onFileSelect(file); // Pass the selected file to the parent component
    } else {
      alert('Invalid file type. Please upload txt, doc, docx, or pdf files only.');
      setSelectedFile(null);
    }
  };

  return (
    <>
      <IconButton disabled={disabled} onClick={() => setOpen(true)}>
        <AiOutlinePaperClip size={24} />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Attach a File</Typography>
          <input type="file" accept=".txt,.doc,.docx,.pdf" onChange={handleFileSelect} style={{ margin: '20px 0' }} />
          <Button variant="contained" onClick={() => setOpen(false)} disabled={!selectedFile}>
            Confirm
          </Button>
        </Box>
      </Dialog>
    </>
  );
};