import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { VoiceRecognition, TextToSpeech } from '@/utils/voice';
import { sendToGemini, getSystemPrompt, Message } from '@/utils/gemini';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

const Home: React.FC = () => {
  const { student } = useAuth();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const voiceRecognition = useRef(new VoiceRecognition());
  const tts = useRef(new TextToSpeech());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!voiceRecognition.current.isAvailable()) {
      toast({
        title: 'Voice Recognition Unavailable',
        description: 'Speech recognition is not supported on this device.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleVoiceInput = async () => {
    if (isListening) {
      voiceRecognition.current.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setCurrentTranscript('');

    voiceRecognition.current.start(
      async (transcript) => {
        setIsListening(false);
        setCurrentTranscript(transcript);
        
        // Add user message
        const userMessage: Message = { role: 'user', content: transcript };
        setMessages(prev => [...prev, userMessage]);
        
        // Process with Gemini
        setIsProcessing(true);
        try {
          const systemPrompt = getSystemPrompt(
            student?.name || '',
            student?.usn || '',
            student?.semester || 0,
            student?.branch || ''
          );
          
          const response = await sendToGemini([...messages, userMessage], systemPrompt);
          
          const assistantMessage: Message = { role: 'assistant', content: response };
          setMessages(prev => [...prev, assistantMessage]);
          
          // Speak the response
          setIsSpeaking(true);
          tts.current.speak(response, () => {
            setIsSpeaking(false);
          });
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to process your request. Please check your API key.',
            variant: 'destructive',
          });
          console.error('Error:', error);
        } finally {
          setIsProcessing(false);
          setCurrentTranscript('');
        }
      },
      (error) => {
        setIsListening(false);
        toast({
          title: 'Error',
          description: `Voice recognition error: ${error}`,
          variant: 'destructive',
        });
      }
    );
  };

  const toggleSpeaker = () => {
    if (isSpeaking) {
      tts.current.stop();
      setIsSpeaking(false);
    }
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] flex flex-col p-4">
        {/* Welcome Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            Welcome, {student?.name}!
          </h2>
          <p className="text-muted-foreground text-sm">
            Your AI-powered campus assistant
          </p>
        </div>

        {/* Messages Area */}
        <Card className="flex-1 bg-card border-border p-4 mb-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Tap the microphone to start a conversation
                </p>
                <p className="text-sm text-muted-foreground">
                  Ask me about classes, events, facilities, or campus tours!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {currentTranscript && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] p-3 rounded-2xl bg-primary/50 text-primary-foreground">
                    <p className="text-sm italic">{currentTranscript}</p>
                  </div>
                </div>
              )}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-2xl bg-secondary text-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </Card>

        {/* Voice Controls */}
        <div className="flex items-center justify-center gap-4">
          {/* Mic Button */}
          <Button
            size="lg"
            onClick={handleVoiceInput}
            disabled={isProcessing || isSpeaking}
            className={`h-20 w-20 rounded-full transition-all ${
              isListening
                ? 'bg-destructive hover:bg-destructive shadow-voice-glow animate-pulse'
                : 'bg-gradient-accent hover:opacity-90'
            }`}
          >
            {isListening ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>

          {/* Speaker Toggle */}
          <Button
            size="lg"
            variant="outline"
            onClick={toggleSpeaker}
            disabled={!isSpeaking}
            className="h-16 w-16 rounded-full border-border"
          >
            {isSpeaking ? (
              <Volume2 className="h-6 w-6 text-accent" />
            ) : (
              <VolumeX className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Status Indicator */}
        <div className="text-center mt-4 min-h-[24px]">
          {isListening && (
            <p className="text-accent font-medium animate-pulse">Listening...</p>
          )}
          {isProcessing && (
            <p className="text-primary font-medium">Processing...</p>
          )}
          {isSpeaking && (
            <p className="text-accent font-medium">Speaking...</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
