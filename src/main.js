import Phaser from 'phaser';

import mountains from './assets/mountains.png';
import wood from './assets/wood.png';

import welcomeSprite from './assets/welcomeSprite.png';
import welcome from './assets/welcome.png';
import play from './assets/play.png';
import rules from './assets/faq.png';
import ok from './assets/ok.png';
import rulesList from './assets/rulesList.png';

import run1 from './assets/islandBoyRun/1.png';
import run2 from './assets/islandBoyRun/2.png';
import run3 from './assets/islandBoyRun/3.png';
import run4 from './assets/islandBoyRun/4.png';
import run5 from './assets/islandBoyRun/5.png';
import run6 from './assets/islandBoyRun/6.png';

import jump1 from './assets/islandBoyJump/1.png';
import jump2 from './assets/islandBoyJump/2.png';
import jump3 from './assets/islandBoyJump/3.png';
import jump4 from './assets/islandBoyJump/4.png';
import jump5 from './assets/islandBoyJump/5.png';
import jump6 from './assets/islandBoyJump/6.png';

import pearl from './assets/pearl.png';
import stone3 from './assets/Stone_3.png';

import runningAudio from './assets/island-runner-music.mp3';

import bar from './assets/bar.png';
import loading from './assets/loading.png';

import youLose from './assets/youLose.png';
import lostGameAudio from './assets/lostGame.mp3';

import faint1 from './assets/islandBoyFaint/1.png';
import faint2 from './assets/islandBoyFaint/2.png';
import faint3 from './assets/islandBoyFaint/3.png';
import faint4 from './assets/islandBoyFaint/4.png';

import slide1 from './assets/islandBoySlide/1.png';
import slide2 from './assets/islandBoySlide/2.png';
import slide3 from './assets/islandBoySlide/3.png';

import coin from './assets/coin.png';
import close from './assets/close.png';
import bomb from './assets/bomb.png';
import musicOff from './assets/music-off.png';
import music from './assets/music.png';


let player;
let cursors;
let platform;
let score = 0;
let scoreText;
let themeSound;
let finalScore;
let lostSound;
let startTime;
let currentTime;
let elapsedSeconds;

const gameScene = new Phaser.Scene('Game');

gameScene.create = function () {
  startTime = new Date();
  console.log(startTime);
  themeSound = this.sound.add('runningAudio');
  themeSound.play({ loop: true });

  const imageBaseWidth = 1920;
  const imageBaseHeight = 1080;

  this.mountains = this.add.tileSprite(400, 210, imageBaseWidth, imageBaseHeight, 'mountains');
  this.mountains.setScale(0.5);

  // this.stone3 = this.add.sprite(500, 470, 'stone3');
  // this.pearl = this.add.sprite(400, 320, 'pearl');
  // this.pearl = this.physics.add.sprite(400, 320, 'pearl');
  // this.pearl.body.setAllowGravity(false);

  const musicOffButton = this.add.sprite(700, 55, 'musicOff').setScale(0.3).setInteractive({ useHandCursor: true });
  const musicButton = this.add.sprite(700, 55, 'music').setScale(0.3).setInteractive({ useHandCursor: true });
  musicButton.visible = false;

  musicOffButton.on('pointerdown', () => {
    themeSound.mute = true;
    musicOffButton.visible = false;
    musicButton.visible = true;
  });

  musicButton.on('pointerdown', () => {
    themeSound.mute = false;
    musicButton.visible = false;
    musicOffButton.visible = true;
  });

  // create ground & scale to fit the width of the game
  platform = this.physics.add.staticGroup();
  this.stones = this.physics.add.group();
  this.coins = this.physics.add.group();
  // this.pearl = this.physics.add.group();

  scoreText = this.add.text(16, 16, 'Score: 0', { fontFamily: 'Chewy', fontSize: '32px', fill: '#000' });

  for (let i = 0; i < 6; i++) {
    platform.create((i * 150), 490, 'wood').setScale(0.5).refreshBody();
  }

  this.anims.create({
    key: 'run',
    frames: [
      { key: 'run1' },
      { key: 'run2' },
      { key: 'run3' },
      { key: 'run4' },
      { key: 'run5' },
      { key: 'run6', duration: 20 },
    ],
    frameRate: 7,
    // repeat: -1,
  });

  this.anims.create({
    key: 'jump',
    frames: [
      { key: 'jump1' },
      { key: 'jump2' },
      { key: 'jump3' },
      { key: 'jump4' },
      { key: 'jump5' },
      { key: 'jump6', duration: 100 },
    ],
    frameRate: 7,
    repeat: -1,
  });

  this.anims.create({
    key: 'faint',
    frames: [
      { key: 'faint1' },
      { key: 'faint2' },
      { key: 'faint3' },
      { key: 'faint4', duration: 100 },
    ],
    frameRate: 7,
    repeat: -1,
  });

  this.anims.create({
    key: 'slide',
    frames: [
      { key: 'slide1' },
      { key: 'slide2' },
      { key: 'slide3', duration: 100 },
    ],
    frameRate: 7,
    repeat: -1,
  });

  player = this.physics.add.sprite(150, 400, 'run1').setScale(0.08);
  player.setBounce(0.2);
  player.body.setGravityY(300);
  player.setCollideWorldBounds(true);

  this.physics.add.collider(player, platform);
  this.physics.add.collider(this.stones, platform);
  this.physics.add.collider(this.coins, platform);

  this.physics.add.overlap(player, this.pearl, this.collectPearl, null, this);
  this.physics.add.overlap(player, this.stones, this.restartGame, null, this);
  this.physics.add.overlap(player, this.coins, this.collectCoins, null, this);

  this.makePearl();

  this.time.addEvent({
    callback: this.generateStone3,
    callbackScope: this,
    repeat: Infinity,
    delay: 3000,
  });

  this.time.addEvent({
    callback: this.generateCoins,
    callbackScope: this,
    repeat: Infinity,
    delay: 1234,
  });

  player.anims.play('run', true);
};

gameScene.collectPearl = function (player, pearl) {
  pearl.disableBody(true, true);
  score += 50;
  scoreText.setText('Score: ' + score);
};

gameScene.collectCoins = function (player, coin) {
  coin.disableBody(true, true);
  score += 5;
  scoreText.setText('Score: ' + score);
};

gameScene.generateCoins = function () {
  this.coins.create(800, platform.children.entries[0].y - 30, 'coin').setScale(0.3);
};

gameScene.generateStone3 = function () {
  this.stones.create(800, platform.children.entries[0].y - 30, 'stone3');
};

gameScene.makePearl = function () {
  if (this.pearl) {
    this.pearl.destroy();
  }

  const pearlX = Phaser.Math.Between(900, 10000);
  const pearlY = Phaser.Math.Between(200, 400);
  this.pearl = this.physics.add.sprite(pearlX, pearlY, 'pearl');
  this.pearl.body.setAllowGravity(false);
  // this.pearl.x -= 10;
};

gameScene.update = function () {
  // input cursor events
  const onGround = player.body.blocked.down || player.body.touching.down;
  cursors = this.input.keyboard.createCursorKeys();
  if (onGround) {
    player.anims.play('run', true);
  }

  currentTime = new Date();
  elapsedSeconds = currentTime.getTime() - startTime.getTime();
  elapsedSeconds = Math.abs(elapsedSeconds / 1000);

  if (elapsedSeconds <= 30) {
    this.mountains.tilePositionX += 4;
  } else if (elapsedSeconds > 30 && elapsedSeconds <= 60) {
    this.mountains.tilePositionX += 4.1;
  } else if (elapsedSeconds > 60 && elapsedSeconds <= 90) {
    this.mountains.tilePositionX += 4.2;
  } else if (elapsedSeconds > 90 && elapsedSeconds <= 120) {
    this.mountains.tilePositionX += 4.3;
  } else if (elapsedSeconds > 120) {
    this.mountains.tilePositionX += 4.4;
  }

  if (elapsedSeconds <= 30) {
    this.pearl.x -= 7;
  } else if (elapsedSeconds > 30 && elapsedSeconds <= 60) {
    this.pearl.x -= 7.1;
  } else if (elapsedSeconds > 60 && elapsedSeconds <= 90) {
    this.pearl.x -= 7.2;
  } else if (elapsedSeconds > 90 && elapsedSeconds <= 120) {
    this.pearl.x -= 7.3;
  } else if (elapsedSeconds > 120) {
    this.pearl.x -= 7.4;
  }

  if ((cursors.up.isDown || cursors.space.isDown) && onGround) {
    player.body.setVelocityY(-400);
    player.anims.stop('run');
    player.anims.play('jump');
    // player.setFrame(5);
  }

  if ((cursors.down.isDown) && onGround) {
    // player.body.setVelocityY(-400);
    player.anims.stop('run');
    player.anims.play('slide');
    // player.setFrame(5);
  }

  this.stones.getChildren().forEach((stone) => {
    if (elapsedSeconds <= 30) {
      stone.x -= 4;
    } else if (elapsedSeconds > 30 && elapsedSeconds <= 60) {
      stone.x -= 4.1;
    } else if (elapsedSeconds > 60 && elapsedSeconds <= 90) {
      stone.x -= 4.2;
    } else if (elapsedSeconds > 90 && elapsedSeconds <= 120) {
      stone.x -= 4.3;
    } else if (elapsedSeconds > 120) {
      stone.x -= 4.4;
    }
  });

  this.coins.getChildren().forEach((coin) => {
    if (elapsedSeconds <= 30) {
      coin.x -= 4;
    } else if (elapsedSeconds > 30 && elapsedSeconds < 60) {
      coin.x -= 4.1;
    } else if (elapsedSeconds > 60 && elapsedSeconds < 90) {
      coin.x -= 4.2;
    } else if (elapsedSeconds > 90 && elapsedSeconds < 120) {
      coin.x -= 4.3;
    } else if (elapsedSeconds > 120) {
      coin.x -= 4.4;
    }
  });

  this.physics.add.overlap(player, this.pearl, this.collectPearl, null, this);

  if (this.pearl.x < 0) {
    this.makePearl();
  }
};

gameScene.restartGame = function () {
  player.anims.stop('run') || player.anims.stop('jump') || player.anims.stop('slide');
  themeSound.stop();
  finalScore = score;
  score = 0;
  this.scene.start(losingScene);
};

const welcomeScene = new Phaser.Scene('Welcome');

welcomeScene.create = function () {
  const imageBaseWidth = 1920;
  const imageBaseHeight = 1080;

  this.mountains = this.add.tileSprite(400, 210, imageBaseWidth, imageBaseHeight, 'mountains');
  this.mountains.setScale(0.5);

  // create ground & scale to fit the width of the game
  platform = this.physics.add.staticGroup();

  for (let i = 0; i < 6; i++) {
    platform.create((i * 150), 490, 'wood').setScale(0.5).refreshBody();
  }

  this.add.sprite(170, 400, 'welcomeSprite').setScale(0.3);
  this.add.image(470, 140, 'welcome').setScale(0.7);
  const playButton = this.add.sprite(390, 365, 'play').setScale(0.5).setInteractive({ useHandCursor: true });
  playButton.on('pointerdown', () => this.scene.start(gameScene));
  const rulesButton = this.add.sprite(640, 365, 'rules').setScale(0.5).setInteractive({ useHandCursor: true });
  rulesButton.on('pointerdown', () => this.scene.start(rulesScene));
};

let rulesScene = new Phaser.Scene('Rules');

rulesScene.create = function () {
  const imageBaseWidth = 1920;
  const imageBaseHeight = 1080;

  this.mountains = this.add.tileSprite(400, 210, imageBaseWidth, imageBaseHeight, 'mountains');
  this.mountains.setScale(0.5);

  // create ground & scale to fit the width of the game
  platform = this.physics.add.staticGroup();

  for (let i = 0; i < 6; i++) {
    platform.create((i * 150), 490, 'wood').setScale(0.5).refreshBody();
  }

  this.add.sprite(170, 400, 'welcomeSprite').setScale(0.3);
  this.add.image(540, 245, 'rulesList').setScale(0.3);
  const okButton = this.add.sprite(535, 340, 'ok').setScale(0.22).setInteractive({ useHandCursor: true });
  okButton.on('pointerdown', () => this.scene.start(welcomeScene));
};

const bootScene = new Phaser.Scene('Boot');

bootScene.preload = function () {
  this.load.image('bar', bar);
  this.load.image('loading', loading);
};

bootScene.create = function () {
  this.scene.start(loadingScene);
};

const loadingScene = new Phaser.Scene('Loading');

loadingScene.preload = function () {
  this.add.image(400, 200, 'loading');
  this.add.image(400, 300, 'bar').setScale(0.5);

  this.load.image('mountains', mountains);
  this.load.image('wood', wood);
  this.load.image('welcome', welcome);
  this.load.image('ok', ok);
  this.load.image('rulesList', rulesList);
  this.load.image('welcomeSprite', welcomeSprite);
  this.load.image('play', play);
  this.load.image('rules', rules);
  this.load.image('run1', run1);
  this.load.image('run2', run2);
  this.load.image('run3', run3);
  this.load.image('run4', run4);
  this.load.image('run5', run5);
  this.load.image('run6', run6);
  this.load.image('jump1', jump1);
  this.load.image('jump2', jump2);
  this.load.image('jump3', jump3);
  this.load.image('jump4', jump4);
  this.load.image('jump5', jump5);
  this.load.image('jump6', jump6);
  this.load.audio('runningAudio', runningAudio);
  this.load.image('stone3', stone3);
  this.load.image('pearl', pearl);
  this.load.image('youLose', youLose);
  this.load.audio('lostGameAudio', lostGameAudio);
  this.load.image('faint1', faint1);
  this.load.image('faint2', faint2);
  this.load.image('faint3', faint3);
  this.load.image('faint4', faint4);
  this.load.image('slide1', slide1);
  this.load.image('slide2', slide2);
  this.load.image('slide3', slide3);
  this.load.image('coin', coin);
  this.load.image('musicOff', musicOff);
  this.load.image('music', music);
};

loadingScene.create = function () {
  this.scene.start(welcomeScene);
};

const losingScene = new Phaser.Scene('Losing');

losingScene.create = function () {
  lostSound = this.sound.add('lostGameAudio');
  lostSound.play();

  const imageBaseWidth = 1920;
  const imageBaseHeight = 1080;

  this.mountains = this.add.tileSprite(400, 210, imageBaseWidth, imageBaseHeight, 'mountains');
  this.mountains.setScale(0.5);

  // create ground & scale to fit the width of the game
  platform = this.physics.add.staticGroup();

  for (let i = 0; i < 6; i++) {
    platform.create((i * 150), 490, 'wood').setScale(0.5).refreshBody();
  }

  this.add.image(400, 250, 'youLose').setScale(0.4);
  const playButton = this.add.sprite(400, 282, 'play').setScale(0.23).setInteractive({ useHandCursor: true });
  playButton.on('pointerdown', () => this.scene.start(gameScene));
  this.add.text(420, 313, finalScore, { fontFamily: 'Chewy', fontSize: '32px', fill: '#000' });
};

// MAIN FILE (can stay in this file but import the scenes)

// Creates the configurations for the game including all of the scenes
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [bootScene, loadingScene, welcomeScene, gameScene, rulesScene, losingScene],
};

// Create a new Phaser game with the configurations mentioned above
const game = new Phaser.Game(config);
