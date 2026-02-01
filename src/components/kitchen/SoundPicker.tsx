import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Volume2, Check, X, Play, Link, Loader2, Repeat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SoundOption {
  id: string;
  name: string;
  description: string;
  play: (ctx: AudioContext) => void;
}

// 10 Different alert sounds with LONGER durations
const soundOptions: SoundOption[] = [
  {
    id: 'chime',
    name: 'Chime Arpeggio',
    description: 'C-E-G major chord',
    play: (ctx) => {
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const start = ctx.currentTime + i * 0.12;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.5, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.25);
        osc.start(start);
        osc.stop(start + 0.25);
      });
    }
  },
  {
    id: 'bell',
    name: 'Bell Ring',
    description: 'Classic bell sound',
    play: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  },
  {
    id: 'doorbell',
    name: 'Doorbell',
    description: 'Two-tone doorbell',
    play: (ctx) => {
      [523.25, 392].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const start = ctx.currentTime + i * 0.2;
        gain.gain.setValueAtTime(0.5, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.25);
        osc.start(start);
        osc.stop(start + 0.25);
      });
    }
  },
  {
    id: 'alarm',
    name: 'Alert Alarm',
    description: 'Urgent beeping',
    play: (ctx) => {
      [0, 0.12, 0.24, 0.36].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 1000;
        osc.type = 'square';
        const start = ctx.currentTime + delay;
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.setValueAtTime(0, start + 0.1);
        osc.start(start);
        osc.stop(start + 0.1);
      });
    }
  },
  {
    id: 'notification',
    name: 'Soft Notification',
    description: 'Gentle ping',
    play: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1318.51;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  },
  {
    id: 'success',
    name: 'Success Fanfare',
    description: 'Ascending tones',
    play: (ctx) => {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'triangle';
        const start = ctx.currentTime + i * 0.08;
        gain.gain.setValueAtTime(0.4, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.18);
        osc.start(start);
        osc.stop(start + 0.18);
      });
    }
  },
  {
    id: 'cash',
    name: 'Cash Register',
    description: 'Ka-ching!',
    play: (ctx) => {
      const freqs = [1500, 2000, 2500];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const start = ctx.currentTime + i * 0.04;
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.12);
        osc.start(start);
        osc.stop(start + 0.12);
      });
    }
  },
  {
    id: 'xylophone',
    name: 'Xylophone',
    description: 'Melodic tap',
    play: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1174.66;
      osc.type = 'triangle';
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  },
  {
    id: 'gong',
    name: 'Deep Gong',
    description: 'Low resonant tone',
    play: (ctx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 130.81;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    }
  },
  {
    id: 'triple',
    name: 'Triple Beep',
    description: 'Three quick beeps',
    play: (ctx) => {
      [0, 0.15, 0.3].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        osc.type = 'sine';
        const start = ctx.currentTime + delay;
        gain.gain.setValueAtTime(0.4, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.1);
        osc.start(start);
        osc.stop(start + 0.1);
      });
    }
  }
];

interface SoundPickerProps {
  onSelect: (soundId: string, customUrl?: string) => void;
  onClose: () => void;
  currentSound?: string;
  currentCustomUrl?: string;
}

export const SoundPicker = ({ 
  onSelect, 
  onClose, 
  currentSound = 'chime',
  currentCustomUrl = ''
}: SoundPickerProps) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState(currentSound);
  const [customUrl, setCustomUrl] = useState(currentCustomUrl);
  const [isTestingUrl, setIsTestingUrl] = useState(false);
  const [isLoopingUrl, setIsLoopingUrl] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const customAudioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const playSound = (sound: SoundOption) => {
    const ctx = getAudioContext();
    setPlayingId(sound.id);
    sound.play(ctx);
    setTimeout(() => setPlayingId(null), 1500);
  };

  const stopCustomAudio = () => {
    if (customAudioRef.current) {
      customAudioRef.current.pause();
      customAudioRef.current.currentTime = 0;
      customAudioRef.current = null;
    }
    setIsTestingUrl(false);
    setIsLoopingUrl(false);
  };

  const testCustomUrl = async () => {
    if (!customUrl.trim()) {
      toast({
        variant: "destructive",
        title: "No URL provided",
        description: "Please enter an audio URL (MP3/WAV)"
      });
      return;
    }

    stopCustomAudio();
    setIsTestingUrl(true);

    try {
      const audio = new Audio(customUrl.trim());
      audio.volume = 0.8;
      customAudioRef.current = audio;

      audio.oncanplaythrough = () => {
        audio.play()
          .then(() => {
            setTimeout(() => {
              stopCustomAudio();
            }, 3000); // 3 second preview
          })
          .catch(() => {
            toast({
              variant: "destructive",
              title: "Playback failed",
              description: "Could not play this audio file"
            });
            stopCustomAudio();
          });
      };

      audio.onerror = () => {
        toast({
          variant: "destructive",
          title: "Invalid URL",
          description: "Could not load audio from this URL"
        });
        stopCustomAudio();
      };

      audio.load();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create audio player"
      });
      stopCustomAudio();
    }
  };

  const loopCustomUrl = async () => {
    if (!customUrl.trim()) {
      toast({
        variant: "destructive",
        title: "No URL provided",
        description: "Please enter an audio URL (MP3/WAV)"
      });
      return;
    }

    if (isLoopingUrl) {
      stopCustomAudio();
      return;
    }

    stopCustomAudio();
    setIsLoopingUrl(true);

    try {
      const audio = new Audio(customUrl.trim());
      audio.loop = true;
      audio.volume = 0.8;
      customAudioRef.current = audio;

      audio.oncanplaythrough = () => {
        audio.play()
          .then(() => {
            // Auto-stop after 10 seconds
            setTimeout(() => {
              stopCustomAudio();
            }, 10000);
          })
          .catch(() => {
            toast({
              variant: "destructive",
              title: "Playback failed",
              description: "Could not play this audio file"
            });
            stopCustomAudio();
          });
      };

      audio.onerror = () => {
        toast({
          variant: "destructive",
          title: "Invalid URL",
          description: "Could not load audio from this URL"
        });
        stopCustomAudio();
      };

      audio.load();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create audio player"
      });
      stopCustomAudio();
    }
  };

  const handleSelect = () => {
    if (selectedId === 'custom' && !customUrl.trim()) {
      toast({
        variant: "destructive",
        title: "No URL provided",
        description: "Please enter an audio URL for custom sound"
      });
      return;
    }
    stopCustomAudio();
    onSelect(selectedId, selectedId === 'custom' ? customUrl.trim() : undefined);
    onClose();
  };

  return (
    <Card className="fixed inset-4 md:inset-auto md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[500px] md:max-h-[85vh] z-50 overflow-hidden shadow-2xl">
      <CardHeader className="bg-primary text-primary-foreground flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Choose Alert Sound
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={() => { stopCustomAudio(); onClose(); }} className="text-primary-foreground hover:bg-primary-foreground/20">
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 max-h-[65vh] overflow-y-auto">
        <div className="grid gap-2">
          {/* Built-in sounds */}
          {soundOptions.map((sound) => (
            <div
              key={sound.id}
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                selectedId === sound.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedId(sound.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedId === sound.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {selectedId === sound.id ? <Check className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-medium">{sound.name}</p>
                  <p className="text-xs text-muted-foreground">{sound.description}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  playSound(sound);
                }}
                disabled={playingId === sound.id}
                className="shrink-0"
              >
                <Play className={`w-3 h-3 mr-1 ${playingId === sound.id ? 'animate-pulse' : ''}`} />
                {playingId === sound.id ? 'Playing' : 'Test'}
              </Button>
            </div>
          ))}

          {/* Custom Audio URL option */}
          <div
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedId === 'custom'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setSelectedId('custom')}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                selectedId === 'custom' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                {selectedId === 'custom' ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
              </div>
              <div>
                <p className="font-medium">Custom Audio URL</p>
                <p className="text-xs text-muted-foreground">Paste an MP3/WAV URL</p>
              </div>
            </div>

            {selectedId === 'custom' && (
              <div className="mt-3 space-y-3 pl-11">
                <div>
                  <Label htmlFor="custom-url" className="text-xs text-muted-foreground">
                    Audio URL (MP3, WAV, OGG)
                  </Label>
                  <Input
                    id="custom-url"
                    type="url"
                    placeholder="https://example.com/alarm.mp3"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={testCustomUrl}
                    disabled={isTestingUrl || isLoopingUrl || !customUrl.trim()}
                    className="flex-1"
                  >
                    {isTestingUrl ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Play className="w-3 h-3 mr-1" />
                    )}
                    {isTestingUrl ? 'Playing...' : 'Test (3s)'}
                  </Button>
                  <Button
                    size="sm"
                    variant={isLoopingUrl ? "destructive" : "outline"}
                    onClick={loopCustomUrl}
                    disabled={isTestingUrl || !customUrl.trim()}
                    className="flex-1"
                  >
                    <Repeat className={`w-3 h-3 mr-1 ${isLoopingUrl ? 'animate-spin' : ''}`} />
                    {isLoopingUrl ? 'Stop Loop' : 'Loop (10s)'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tip: Use freesound.org or find a direct MP3 link
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" className="flex-1" onClick={() => { stopCustomAudio(); onClose(); }}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSelect}>
            <Check className="w-4 h-4 mr-2" />
            Use This Sound
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const getSoundById = (id: string) => soundOptions.find(s => s.id === id) || soundOptions[0];

export default SoundPicker;
