// Christmas jingle sound utility

let jingleAudio: HTMLAudioElement | null = null;

/**
 * Play a festive jingle bell sound
 * Uses an audio file from the public folder
 */
export function playJingleSound() {
  try {
    // Create audio element on first use
    if (!jingleAudio) {
      jingleAudio = new Audio('/sounds/christmas-bells-02-439604.mp3');
      jingleAudio.volume = 0.3; // Keep it subtle
    }

    // Reset to start if already playing
    jingleAudio.currentTime = 0;
    jingleAudio.play().catch(() => {
      // Silently fail if autoplay is blocked
    });
  } catch (e) {
    // Silently fail if audio isn't supported
    console.debug('Audio not supported:', e);
  }
}
