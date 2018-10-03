import Phaser from 'phaser';
import mountains from './assets/mountains.png';
import dude from './assets/dude.png';
import wood from './assets/wood.png';

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
  scene: {
    key: 'main',
    preload: preload,
    create: create,
    update: update
  },
};

let game = new Phaser.Game(config);

let player;
let cursors;
let platform;

function preload() {
  this.load.image('mountains', mountains);
  this.load.spritesheet('dude', dude, { frameWidth: 32, frameHeight: 48 });
  this.load.image('wood', wood);
}

function create() {
  // background = this.add.image(0, 0, 'mountains');
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
  platform.create(0, 490, 'wood').setScale(0.5).refreshBody();
  platform.create(155, 490, 'wood').setScale(0.5).refreshBody();
  platform.create(300, 490, 'wood').setScale(0.5).refreshBody();
  platform.create(450, 490, 'wood').setScale(0.5).refreshBody();
  platform.create(600, 490, 'wood').setScale(0.5).refreshBody();
  platform.create(750, 490, 'wood').setScale(0.5).refreshBody();


  player = this.physics.add.sprite(100, 400, 'dude');
  player.body.setGravityY(300);
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  // make sure little dude collides with platform
  this.physics.add.collider(player, platform);

  // animations
  this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: 'stand',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20,
  });
}

function update() {

  // input cursor events
  cursors = this.input.keyboard.createCursorKeys();
  if (cursors.right.isDown) {
    player.anims.play('run', true);
    this.mountains.tilePositionX += 4;
  } else {
    player.setVelocityX(0);
    player.anims.play('stand');
  }
}

// if (module.hot) {
//   module.hot.accept(() => {});

//   module.hot.dispose(() => {
//     window.location.reload();
//   });
// }
