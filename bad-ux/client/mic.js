export async function captureTranscript() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return {
      transcript: '',
      note: 'Speech recognition is unavailable in this browser.'
    };
  }

  return new Promise((resolve) => {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? '';
      resolve({ transcript });
    };

    recognition.onerror = (event) => {
      resolve({ transcript: '', note: `Speech error: ${event.error}` });
    };

    recognition.onend = () => {
      resolve({ transcript: '', note: 'Speech capture ended with no result.' });
    };

    recognition.start();
  });
}
