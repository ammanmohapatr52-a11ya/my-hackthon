import React, { createContext, useContext, useState, useCallback } from 'react';

interface AnnouncerContextType {
  announcePolite: (message: string) => void;
  announceAssertive: (message: string) => void;
}

const AnnouncerContext = createContext<AnnouncerContextType>({
  announcePolite: () => {},
  announceAssertive: () => {},
});

export const useAnnounce = () => useContext(AnnouncerContext);

export const AnnouncerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  const announcePolite = useCallback((message: string) => {
    // Clear first to re-trigger assistive tech if message is identical
    setPoliteMessage('');
    setTimeout(() => setPoliteMessage(message), 50);
  }, []);

  const announceAssertive = useCallback((message: string) => {
    setAssertiveMessage('');
    setTimeout(() => setAssertiveMessage(message), 50);
  }, []);

  return (
    <AnnouncerContext.Provider value={{ announcePolite, announceAssertive }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0',
        }}
      >
        {politeMessage}
      </div>
      <div
        aria-live="assertive"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0',
        }}
      >
        {assertiveMessage}
      </div>
    </AnnouncerContext.Provider>
  );
};
