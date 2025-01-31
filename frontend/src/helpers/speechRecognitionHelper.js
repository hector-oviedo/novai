export const useSpeechRecognition = ({ onResult }) => {
    const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechRecognition = recognition ? new recognition() : null;
  
    let isSupported = !!speechRecognition;
    let transcript = '';
  
    if (speechRecognition) {
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.onresult = (event) => {
        transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        onResult(transcript);
      };
    }
  
    const startListening = () => {
      if (speechRecognition) speechRecognition.start();
    };
  
    const stopListening = () => {
      if (speechRecognition) speechRecognition.stop();
    };
  
    return { startListening, stopListening, transcript, isSupported };
};