class AudioManager {
    constructor() {
      // === FLAGS / EIGENSCHAFTEN ===
      this.isMusicMuted = false;  
      this.isSfxMuted = false;
  
      // Optionale Lautstärke-Werte
      this.musicVolume = 0.2; // 20% Hintergrund
      this.sfxVolume = 0.5;   // 50% bei Effekten
  
      // === AUDIO OBJEKTE LADEN ===
      // 1) Hintergrundmusik
      this.backgroundMusic = new Audio('audio/game-sound.mp3');
      this.backgroundMusic.loop = true; 
      this.backgroundMusic.volume = this.musicVolume; 
      
      // 2) Soundeffekte
      this.chickenDeathSound = new Audio('audio/chicken-noise.mp3');
      this.endbossDeathSound = new Audio('audio/endboss-noise.mp3');
      this.pepeDiesSound = new Audio('audio/pepe-dies.mp3');
      this.pepeHurtSound = new Audio('audio/pepe-hurt.mp3');
      this.jumpSound = new Audio('audio/jump.mp3');
      this.winGameSound = new Audio('audio/win-game.mp3');
      this.levelCompleteSound = new Audio('audio/level-complete.mp3');
    }
  
    // === METHODEN FÜR MUSIK ===
    playBackgroundMusic() {
      if (!this.isMusicMuted) {
        this.backgroundMusic.play();
      }
    }
  
    pauseBackgroundMusic() {
      this.backgroundMusic.pause();
    }
  
    // === METHODEN FÜR SFX ===
    playChickenDeath() {
      this.playSfx(this.chickenDeathSound);
    }
  
    playEndbossDeath() {
      this.playSfx(this.endbossDeathSound);
    }
  
    playPepeDies() {
      this.playSfx(this.pepeDiesSound);
    }
  
    playPepeHurt() {
      this.playSfx(this.pepeHurtSound);
    }
  
    playJump() {
      this.playSfx(this.jumpSound);
    }
  
    playWinGame() {
      this.playSfx(this.winGameSound);
    }
  
    playLevelComplete() {
      this.playSfx(this.levelCompleteSound);
    }
  
    // === ALLGEMEINE HILFS-METHODE FÜR SFX ===
    playSfx(audioObj) {
      if (!this.isSfxMuted) {
        audioObj.volume = this.sfxVolume;
        audioObj.currentTime = 0; // damit der Sound immer von vorne startet
        audioObj.play();
      }
    }
  
    // === MUTE / UNMUTE / LAUTSTÄRKE ===
  
    setMusicMuted(muted) {
      this.isMusicMuted = muted;
      if (muted) {
        // Pause + Lautstärke = 0, um sicher zu sein
        this.backgroundMusic.pause();
      } else {
        // Lautstärke wiederherstellen
        this.backgroundMusic.volume = this.musicVolume;
        this.backgroundMusic.play();
      }
    }
  
    setSfxMuted(muted) {
      this.isSfxMuted = muted;
    }
  
    // Ggf. setMusicVolume(value), setSfxVolume(value) usw. 
    // ...
  }
  