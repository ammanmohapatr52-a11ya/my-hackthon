import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/ui/Modal';
import { useSpeechInput } from '../../speech/useSpeechInput';
import { parseVoiceCommand, type VoiceIntent } from '../../speech/voiceCommands';
import { Mic, MicOff, Check, ArrowRight } from 'lucide-react';
import { useAnnounce } from '../../accessibility/useAnnounce';
import { useLanguage } from '../../i18n/LanguageContext';
import { assistantVoice } from '../../services/assistantVoice';

interface VoiceCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySolve?: (problem: string) => void;
  onApplyAsk?: (question: string) => void;
}

export const VoiceCommandModal: React.FC<VoiceCommandModalProps> = ({
  isOpen,
  onClose,
  onApplySolve,
  onApplyAsk,
}) => {
  const navigate = useNavigate();
  const { isSupported, isListening, transcript, startListening, stopListening, setTranscript } = useSpeechInput();
  const [detectedIntent, setDetectedIntent] = useState<VoiceIntent | null>(null);
  const { announcePolite } = useAnnounce();
  const { language, t } = useLanguage();

  useEffect(() => {
    if (isOpen && isSupported) {
      setTranscript('');
      setDetectedIntent(null);
      startListening();
      const promptAnnouncement =
        language === 'hi'
          ? 'वॉयस कमांड सुन रहा है। समाधान, प्रश्न या नेविगेट जैसा कमांड बोलें।'
          : language === 'or'
          ? 'ଭଏସ୍ କମାଣ୍ଡ ଶୁଣୁଛି। ସମାଧାନ, ପ୍ରଶ୍ନ କିମ୍ବା ନାଭିଗେଟ୍ ପରି ଏକ କମାଣ୍ଡ କୁହନ୍ତୁ।'
          : 'Voice command listening. Say a command like solve, ask, or navigate.';
      announcePolite(promptAnnouncement);
    } else {
      stopListening();
    }
  }, [isOpen, isSupported, language, startListening, stopListening, setTranscript, announcePolite]);

  useEffect(() => {
    if (transcript.trim()) {
      const intent = parseVoiceCommand(transcript);
      setDetectedIntent(intent);
    }
  }, [transcript]);

  const handleExecute = () => {
    if (!detectedIntent) return;

    stopListening();
    onClose();

    switch (detectedIntent.type) {
      case 'solve': {
        const confirmSolve =
          language === 'hi'
            ? 'गणित समाधान खोला जा रहा है।'
            : language === 'or'
            ? 'ଗଣିତ ସମାଧାନ ପୃଷ୍ଠା ଖୋଲାଯାଉଛି।'
            : 'Opening Math Solver.';
        assistantVoice.speak(confirmSolve, true, language);
        navigate('/solve');
        if (onApplySolve) onApplySolve(detectedIntent.payload);
        break;
      }
      case 'ask': {
        const confirmAsk =
          language === 'hi'
            ? 'AI प्रश्न खोला जा रहा है।'
            : language === 'or'
            ? 'AI ପ୍ରଶ୍ନ ପୃଷ୍ଠା ଖୋଲାଯାଉଛି।'
            : 'Opening AI Tutor.';
        assistantVoice.speak(confirmAsk, true, language);
        navigate('/ask');
        if (onApplyAsk) onApplyAsk(detectedIntent.payload);
        break;
      }
      case 'navigate': {
        navigate(detectedIntent.path);
        break;
      }
      default:
        break;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('voice_modal.title', 'Voice Command')}>
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: isListening ? 'rgba(56, 189, 248, 0.2)' : 'var(--bg-surface)',
            border: `2px solid ${isListening ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            animation: isListening ? 'subtle-pulse 1.5s infinite' : 'none',
          }}
        >
          {isListening ? (
            <Mic size={36} color="var(--accent-primary)" />
          ) : (
            <MicOff size={36} color="var(--text-muted)" />
          )}
        </div>

        <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          {isListening
            ? t('voice_modal.listening', 'Listening for your command...')
            : t('voice_modal.paused', 'Microphone paused')}
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          {t('voice_modal.try_saying', 'Try saying:')}{' '}
          <span style={{ color: 'var(--accent-primary)' }}>
            "{t('voice_modal.sample_solve', 'solve 2x + 6 = 14')}"
          </span>
          ,{' '}
          <span style={{ color: 'var(--accent-primary)' }}>
            "{t('voice_modal.sample_ask', 'ask what is gravity')}"
          </span>
          ,{' '}
          <span style={{ color: 'var(--accent-primary)' }}>
            "{t('voice_modal.sample_nav', 'go to flashcards')}"
          </span>
        </p>

        {transcript ? (
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              textAlign: 'left',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
              {t('voice_modal.recognized', 'RECOGNIZED SPEECH:')}
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-word' }}>
              "{transcript}"
            </div>

            {detectedIntent && (
              <div
                style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--status-success)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }}
              >
                <Check size={16} />
                <span>
                  Action: {detectedIntent.type.toUpperCase()}{' '}
                  {'payload' in detectedIntent ? `(${detectedIntent.payload})` : ''}
                  {'path' in detectedIntent ? `(${detectedIntent.path})` : ''}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              padding: '1.25rem',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              fontStyle: 'italic',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
            }}
          >
            {t('voice_modal.speak_clearly', 'Speak clearly into your microphone... Say "solve x^2 - 4 = 0", "ask what is gravity", or "open map"')}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
          {isListening ? (
            <button type="button" className="btn btn-secondary" onClick={stopListening}>
              <MicOff size={18} /> {t('voice_modal.pause_listening', 'Pause Mic')}
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={startListening}>
              <Mic size={18} /> {t('voice_modal.start_listening', 'Start Mic')}
            </button>
          )}

          {transcript && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleExecute}
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                }}
              >
                <span>Execute Intent</span> <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  stopListening();
                  onClose();
                  navigate('/solve', { state: { initialProblem: transcript } });
                }}
              >
                🔢 Solve as Math
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  stopListening();
                  onClose();
                  navigate('/ask', { state: { initialQuestion: transcript } });
                }}
              >
                ✨ Ask AI Tutor
              </button>
            </>
          )}

          <button type="button" className="btn btn-ghost" onClick={onClose}>
            {t('voice_modal.cancel', 'Close')}
          </button>
        </div>
      </div>
    </Modal>
  );
};
