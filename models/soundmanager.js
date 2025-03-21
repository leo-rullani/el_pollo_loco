/**
 * @class SoundManager
 * Manages music (musicMuted) and sound effects (sfxMuted) preferences,
 * plus a general soundEnabled if you want a quick toggle for everything.
 */
class SoundManager {
  constructor() {
    // 1) Sound On/Off
    const storedSound = localStorage.getItem("soundEnabled");
    this.soundEnabled = storedSound !== null ? storedSound === "true" : true;

    // 2) Separate Music
    const storedMusicMuted = localStorage.getItem("musicMuted");
    this.musicMuted =
      storedMusicMuted !== null ? storedMusicMuted === "true" : false;

    // 3) Separate SFX
    const storedSfxMuted = localStorage.getItem("sfxMuted");
    this.sfxMuted = storedSfxMuted !== null ? storedSfxMuted === "true" : false;
  }

  /** A simple toggle for global sound (on/off). */
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem("soundEnabled", this.soundEnabled);
    console.log(`Sound is now: ${this.soundEnabled ? "ON" : "OFF"}`);
  }

  /** Mutes/unmutes only music, store in localStorage. */
  toggleMusic() {
    this.musicMuted = !this.musicMuted;
    localStorage.setItem("musicMuted", this.musicMuted);
    console.log(`Music is now: ${this.musicMuted ? "MUTED" : "UNMUTED"}`);
  }

  /** Mutes/unmutes only SFX, store in localStorage. */
  toggleSfx() {
    this.sfxMuted = !this.sfxMuted;
    localStorage.setItem("sfxMuted", this.sfxMuted);
    console.log(`SFX is now: ${this.sfxMuted ? "MUTED" : "UNMUTED"}`);
  }

  /**
   * A quick method to see if we should play *anything*.
   * Some prefer to override musicMuted/sfxMuted if soundEnabled === false.
   */
  isSoundAllowed() {
    return this.soundEnabled;
  }

  /**
   * Plays the specified audio if:
   * 1) soundEnabled = true AND
   * 2) if it's music, musicMuted = false; if it's SFX, sfxMuted = false.
   * This requires you to know whether `audio` is music or SFX.
   */
  playSound(audio, isMusic = false) {
    if (!this.soundEnabled) return; // global sound off

    // if it's music but musicMuted is true => do nothing
    if (isMusic && this.musicMuted) return;
    // if it's SFX but sfxMuted is true => do nothing
    if (!isMusic && this.sfxMuted) return;

    audio.currentTime = 0;
    audio.play();
  }
}