import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volume2, Check, X, Play } from 'lucide-react';

interface SoundOption {
  id: string;
  name: string;
  description: string;
  play: (ctx: AudioContext) => void;
}

// 10 Different alert sounds
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
        const start = ctx.currentTime + i * 0.15;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.5, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15);
        osc.start(start);
        osc.stop(start + 0.15);
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
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
      osc.start();
      osc.stop(ctx.currentTime + 1);
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
        const start = ctx.currentTime + i * 0.3;
        gain.gain.setValueAtTime(0.5, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.3);
        osc.start(start);
        osc.stop(start + 0.3);
      });
    }
  },
  {
    id: 'alarm',
    name: 'Alert Alarm',
    description: 'Urgent beeping',
    play: (ctx) => {
      [0, 0.15, 0.3].forEach((delay) => {
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
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
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
        const start = ctx.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0.4, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.2);
        osc.start(start);
        osc.stop(start + 0.2);
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
        const start = ctx.currentTime + i * 0.05;
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.15);
        osc.start(start);
        osc.stop(start + 0.15);
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
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
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
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    }
  },
  {
    id: 'triple',
    name: 'Triple Beep',
    description: 'Three quick beeps',
    play: (ctx) => {
      [0, 0.2, 0.4].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        osc.type = 'sine';
        const start = ctx.currentTime + delay;
        gain.gain.setValueAtTime(0.4, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.12);
        osc.start(start);
        osc.stop(start + 0.12);
      });
    }
  }
];

interface SoundPickerProps {
  onSelect: (soundId: string) => void;
  onClose: () => void;
  currentSound?: string;
}

export const SoundPicker = ({ onSelect, onClose, currentSound = 'chime' }: SoundPickerProps) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState(currentSound);
  const audioContextRef = useRef<AudioContext | null>(null);

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

  const handleSelect = () => {
    onSelect(selectedId);
    onClose();
  };

  return (
    <Card className="fixed inset-4 md:inset-auto md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[500px] md:max-h-[80vh] z-50 overflow-hidden shadow-2xl">
      <CardHeader className="bg-primary text-primary-foreground flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Choose Alert Sound
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-primary-foreground hover:bg-primary-foreground/20">
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 max-h-[60vh] overflow-y-auto">
        <div className="grid gap-2">
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
        </div>
        
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" className="flex-1" onClick={onClose}>
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
