import { useCallback } from 'react';
import { Howl } from 'howler';

export function useAudio({ muted = false } = {}) {
  const playSound = useCallback(
    (name) => {
      if (muted) {
        return;
      }

      try {
        const sound = new Howl({
          src: [`/sounds/${name}.mp3`],
          volume: 0.35,
          html5: false,
        });
        sound.play();
      } catch {
        // Placeholder audio files are intentionally lightweight.
      }
    },
    [muted],
  );

  return { playSound };
}
