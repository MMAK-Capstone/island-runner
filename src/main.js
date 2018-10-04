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

let player;
let cursors;
let platform;

let gameScene = new Phaser.Scene('Game');

gameScene.preload = function() {
  this.load.image('mountains', mountains);
  this.load.image('wood', wood);
};

gameScene.create = function() {
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  let topBackgroundXOrigin = windowWidth / 2;
  let topBackgroundYOrigin = (windowHeight / 5) * 1.5;
  let topBackgroundHeight = (windowHeight / 5) * 3;

  let imageBaseWidth = 1920;
  let imageBaseHeight = 1080;
  let heightRatio = topBackgroundHeight / imageBaseHeight;

  this.mountains = this.add.tileSprite(400, 210, imageBaseWidth, imageBaseHeight, 'mountains');
  this.mountains.setScale(0.5);

  // create ground & scale to fit the width of the game
  platform = this.physics.add.staticGroup();

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
      { key: 'run6' , duration: 20},
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
    frameRate: 15,
    repeat: -1,
  });

  player = this.physics.add.sprite(150, 400, 'run1').setScale(0.1);
  player.setBounce(0.2);
  player.body.setGravityY(300);
  player.setCollideWorldBounds(true);

  this.physics.add.collider(player, platform);

};

gameScene.update = function() {
  // input cursor events
  let onGround = player.body.blocked.down || player.body.touching.down;
  cursors = this.input.keyboard.createCursorKeys();

  player.anims.play('run', true);
  this.mountains.tilePositionX += 4;

  if ((cursors.up.isDown || cursors.space.isDown) && onGround) {
    player.body.setVelocityY(-400);
    player.anims.play('jump', true);
  }
};

let welcomeScene = new Phaser.Scene('Welcome');

welcomeScene.preload = function() {
  this.load.image('mountains', mountains);
  this.load.image('wood', wood);
  this.load.image('welcomeSprite', welcomeSprite);
  this.load.image('welcome', welcome);
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
},

welcomeScene.create = function() {
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  let topBackgroundXOrigin = windowWidth / 2;
  let topBackgroundYOrigin = (windowHeight / 5) * 1.5;
  let topBackgroundHeight = (windowHeight / 5) * 3;

  let imageBaseWidth = 1920;
  let imageBaseHeight = 1080;
  let heightRatio = topBackgroundHeight / imageBaseHeight;

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

rulesScene.preload = function() {
  this.load.image('mountains', mountains);
  this.load.image('wood', wood);
  this.load.image('welcome', welcome);
  this.load.image('ok', ok);
  this.load.image('rulesList', rulesList);
},

rulesScene.create = function() {
  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  let topBackgroundXOrigin = windowWidth / 2;
  let topBackgroundYOrigin = (windowHeight / 5) * 1.5;
  let topBackgroundHeight = (windowHeight / 5) * 3;

  let imageBaseWidth = 1920;
  let imageBaseHeight = 1080;
  let heightRatio = topBackgroundHeight / imageBaseHeight;

  this.mountains = this.add.tileSprite(400, 210, imageBaseWidth, imageBaseHeight, 'mountains');
  this.mountains.setScale(0.5);

  // create ground & scale to fit the width of the game
  platform = this.physics.add.staticGroup();

  for (let i = 0; i < 6; i++) {
    platform.create((i * 150), 490, 'wood').setScale(0.5).refreshBody();
  }

  this.add.sprite(170, 400, 'welcomeSprite').setScale(0.3);
  this.add.image(540, 245, 'rulesList').setScale(0.3);
  const okButton = this.add.sprite(535, 350, 'ok').setScale(0.24).setInteractive({ useHandCursor: true });
  okButton.on('pointerdown', () => this.scene.start(welcomeScene));
};

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
  scene: [welcomeScene, gameScene, rulesScene],
};

let game = new Phaser.Game(config);

// if (module.hot) {
//   module.hot.accept(() => {});

//   module.hot.dispose(() => {
//     window.location.reload();
//   });
// }
