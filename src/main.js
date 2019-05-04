var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
  	height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var cities;
var bombs;
var platforms;
var cursors;
var controlConfig;
var controls;
var score = 0;
var gameOver = false;
var scoreText;
var target = undefined;

var game = new Phaser.Game(config);

var orderCards = [];
var activeOrders = [];

var gamePieceOnClickDown = function (pointer) {
  this.setTint(0xff000);
}

var unitOnClickDown = function (pointer) {
  let success = addMoveOrder(player, this, 5);

  if(success){
    this.setTint(0xff000);
  }else{
    this.setTint(0xff9955);
  }
}

var gamePieceOnClickUp = function (pointer) {
  this.clearTint();
}

var addMoveOrder = function (gameobject, targetObject, speed) {
  if(player.order === undefined){
    player.order = { name : "move",  function : moveToPosition , parameters : {source : gameobject, target : targetObject, 'speed' : speed}, state : STATE_ENUM.READY };
    activeOrders.push(player.order);
    return true;
  }else{
    return false;
  }
}

var runActiveOrders = function(){
  for(orderIndex in activeOrders){
    let order = activeOrders[orderIndex];
    let state = order.state;

    if(state === STATE_ENUM.FINISHED){
      continue;
    }

    state = order.function(order.parameters);

    order.state = state;
  }
}

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    //  A simple background for our game
    let backgroundImage = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'sky');
    backgroundImage.setScale(window.innerWidth / 800, window.innerHeight /600);

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude').setOrigin(0.5, 1);
    player.setInteractive();
    player.setDepth(DEPTH_ENUM.UNIT);

    // Define what happens when the player is clicked
    player.on('pointerdown', gamePieceOnClickDown);

    player.on('pointerout', gamePieceOnClickUp);

    player.on('pointerup', gamePieceOnClickUp);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    player.anims.play('turn');

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    // Setup control config
    controlConfig = {
      camera : this.cameras.main,
      left : cursors.left,
      right : cursors.right,
      up : cursors.up,
      down : cursors.down,
      acceleration : 0.04,
      drag : 0.0008,
      maxSpeed : 0.5
    };

    controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    // Set Background colour
    controlConfig.camera.setBackgroundColor(0x9addf3);

    //  Some cities to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    cities = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 25, y: 150, stepX: 70, stepY: 15 }
    });

    cities.children.iterate(function (child) {

        //  Give each cities a slightly different position
        child.x += Phaser.Math.Between(-5, 5);
        child.y = Phaser.Math.Between(100, 700);

        child.setInteractive();
        child.setDepth(DEPTH_ENUM.CITY);

        // Define what happens when the cities is clicked
        child.on('pointerdown', unitOnClickDown);

        child.on('pointerout', gamePieceOnClickUp);

        child.on('pointerup', gamePieceOnClickUp);

    });

    player.x = cities.getChildren()[0].x;
    player.y = cities.getChildren()[0].y;

    //  The score
    //scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    // Add button
    new TextButton(this, 16, 16, 'End Turn', { fontSize: '32px', fill: '#000' , fontFamily: DEFAULT_FONT }, function () { console.log("Clicked End Turn");} , DEPTH_ENUM.UI);
    new TextButton(this, 16, 48, 'Order : Move', { fontSize: '32px', fill: '#000' }, function () { console.log("Clicked Move");} , DEPTH_ENUM.UI);
    new TextButton(this, 16, 80, 'Order One : None', { fontSize: '32px', fill: '#000' }, function () { console.log("Select Order");} , DEPTH_ENUM.UI);

}

function update (time, delta)
{
    controls.update(delta);

    if (gameOver)
    {
        return;
    }

    runActiveOrders();
}
