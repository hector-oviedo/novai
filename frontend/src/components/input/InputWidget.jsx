import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import { AiOutlineSend, AiOutlineAudio } from 'react-icons/ai';
import { addUserMessage } from '../../slices/messageSlice';
import { sendMessage, sendStreamMessage } from '../../slices/messageThunks';
import { FileAttachmentWidget } from './FileAttachmentWidget';
import { useSpeechRecognition } from '../../helpers/speechRecognitionHelper';

export const InputWidget = () => {
  const [inputValue, setInputValue] = useState('');

  const [attachment, setAttachment] = useState();
  const dispatch = useDispatch();
  const interactionState = useSelector((state) => state.messages.interactionState);
  const [isListening, setIsListening] = useState(false);
  
  const { startListening, stopListening, transcript, isSupported } = useSpeechRecognition({
    onResult: (text) => setInputValue(text),
  });

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.trim().length > 1 || attachment) {
      dispatch(addUserMessage(inputValue));
  
      // Send message along with the attachment if it exists
      dispatch(sendStreamMessage({ userInput: inputValue }));
    
      setInputValue('');
      setAttachment(null);
    }
  };
  
  // Pass selected file to attachment state
  const handleAttachment = (file) => {
    setAttachment(file);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && inputValue.trim().length > 1) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
    setIsListening(!isListening);
  };

  return (
    <Box sx={{ display: 'flex', padding: 2, width: '100%', maxWidth: '940px' }}>
      <Box
        component="form"
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
          borderRadius: 3,
          padding: 1,
        }}
        onSubmit={(e) => e.preventDefault()}
      >
        <TextField
          fullWidth
          multiline
          rows={2}
          variant="standard"
          placeholder="Type your message..."
          value={inputValue || transcript}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          InputProps={{
            disableUnderline: true,
            sx: { paddingLeft: 2 },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  disabled={interactionState !== 'ready' && interactionState !== 'error'}
                  color={isListening ? 'primary' : 'default'}
                  onClick={handleMicClick}
                >
                  <AiOutlineAudio size={24} />
                </IconButton>
                <FileAttachmentWidget 
                  disabled={interactionState !== 'ready' && interactionState !== 'error'} 
                  onFileSelect={handleAttachment}/>
                <IconButton
                  disabled={inputValue.trim().length <= 1 || interactionState !== 'ready' && interactionState !== 'error'}
                  onClick={handleSubmit}
                >
                  <AiOutlineSend size={24} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
};