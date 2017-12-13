var SideScroller = SideScroller || {};

SideScroller.Game = function(){};

SideScroller.Game.prototype = {
  preload: function() {
      this.game.time.advancedTiming = true;
    },
  create: function() {
    var newItem;

    //game params
    this.levelSpeed = -250;
    this.tileSize = 70;
    this.probCliff = 0.4;
    this.probVertical = 0.4;
    this.probCactus=.12;
    this.probMoreVertical = 0.5;

    //initiate groups, we'll recycle elements
    this.floors = this.game.add.group();
    this.floors.enableBody = true;

    for(var i=0; i<12; i++) {
      if (this.game.time.totalElapsedSeconds()<60) {
          newItem = this.floors.create(i * this.tileSize, this.game.world.height - this.tileSize, 'floor');
      }
    else if(this.game.time.totalElapsedSeconds()>60&&this.game.time.totalElapsedSeconds()<120) {
        newItem = this.floors.create(i * this.tileSize, this.game.world.height - this.tileSize, 'floor1');
    }
    else {
    newItem = this.floors.create(i * this.tileSize, this.game.world.height - this.tileSize, 'floor2');
    }
      newItem.body.immovable = true;
      newItem.body.velocity.x = this.levelSpeed;
    }
    //this.game.add.tileSprite(0, 0, 800 * 4, 700, 'bg');
    this.mountainsBack = this.game.add.tileSprite(0, this.game.height - this.game.cache.getImage('bg').height-70,
       this.game.width,
       this.game.cache.getImage('bg').height,
       'bg'
   );
//this.game.stage.backgroundColor = '#697e96';
    //keep track of the last floor
    this.lastFloor = newItem;

    //keep track of the last element
    this.lastCliff = false;
    this.lastVertical = false;

    this.verticalObstacles = this.game.add.group();
    this.verticalObstacles.enableBody = true;
    this.verticalObstacles.createMultiple(12, 'yellowBlock');
    this.verticalObstacles.setAll('checkWorldBounds', true);
    this.verticalObstacles.setAll('outOfBoundsKill', true);

    /*for(var i=0; i<12; i++) {
      newItem = this.verticalObstacles.create(null, this.game.world.height - this.tileSize, 'floor');
      newItem.body.immovable = true;
      newItem.body.velocity.x = this.levelSpeed;
    }
*/


this.cactus = this.game.add.group();
this.cactus.enableBody = true;
this.cactus.createMultiple(6, 'cactus');
this.cactus.setAll('anchor.x', 0.5);
this.cactus.setAll('anchor.y', 1);
this.cactus.setAll('outOfBoundsKill', true);
this.cactus.setAll('checkWorldBounds', true);

    this.goldcoin = this.game.add.group();
    this.goldcoin.enableBody = true;
    this.goldcoin.physicsBodyType = Phaser.Physics.ARCADE;
    this.goldcoin.createMultiple(30, 'goldCoin');
    this.goldcoin.setAll('anchor.x', 0.5);
    this.goldcoin.setAll('anchor.y', 1);
    this.goldcoin.setAll('outOfBoundsKill', true);
    this.goldcoin.setAll('checkWorldBounds', true);
//this.game.time.events.loop(Phaser.Timer.SECOND * 5 + this.game.rnd.frac() * 10, this.launchCoin, this);
this.coincounter=0;
    this.coins = this.game.add.group();
    this.coins.enableBody = true;

    //create player
    this.player = this.game.add.sprite(250, 320, 'player');
    // /this.player.scale.setTo(0.8);

    //enable physics on the player
    this.game.physics.arcade.enable(this.player);


    //player gravity
    this.player.body.gravity.y = 1000;



    //properties when the player is ducked and standing, so we can use in update()
    var playerDuckImg = this.game.cache.getImage('playerDuck');
    this.player.duckedDimensions = {width: playerDuckImg.width, height: playerDuckImg.height};
    this.player.standDimensions = {width: this.player.width, height: this.player.height};
    this.player.anchor.setTo(0.5, 1);

    var playerJumpImg = this.game.cache.getImage('jump');
    this.player.jumpdimensions = {width: playerJumpImg.width, height: playerJumpImg.height};
    this.player.standdimensions = {width: this.player.width, height: this.player.height};
    this.player.anchor.setTo(0.5, 1);

    //the camera will follow the player in the world
    this.game.camera.follow(this.player);

    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();

    //init game controller
    this.initGameController();

    //sounds
    this.coinSound = this.game.add.audio('coin');
      this.dieSound = this.game.add.audio('die');
      this.jumpSound = this.game.add.audio('jump');
  },
  launchCoin:function() {
      var MIN_ENEMY_SPACING = 300;
      var MAX_ENEMY_SPACING = 3000;
      var ENEMY_SPEED = 300;

      var coin = this.goldcoin.getFirstExists(false);
      if (coin) {
          coin.reset(this.game.rnd.integerInRange(0, this.game.width), -20);
          coin.body.velocity.x = this.game.rnd.integerInRange(-300, 300);
          coin.body.velocity.y = ENEMY_SPEED;
          coin.body.drag.x = 100;

          coin.update = function() {
              coin.angle = 90;

              if (coin.y > this.game.height + 200) {
                  coin.kill();
              }
          }
      }

  },


  update: function() {
    //collision
    this.game.physics.arcade.collide(this.player, this.floors, this.playerHit, null, this);
    this.game.physics.arcade.collide(this.player, this.verticalObstacles, this.playerHit, null, this);
    this.game.physics.arcade.collide(this.player, this.goldcoin, this.collect, null, this);
    //this.game.physics.arcade.overlap(this.player, this.coins, this.collect, null, this);

    //only respond to keys and keep the speed if the player is alive
    if(this.player.alive) {

      if(this.player.body.touching.down) {
        this.player.loadTexture('player');
        this.player.body.setSize(this.player.standDimensions.width, this.player.standDimensions.height);
        this.player.body.velocity.x = -this.levelSpeed;
      }
      else {
        this.player.body.velocity.x = 0;
      }


      if(this.cursors.up.isDown) {
        this.playerJump();
      }
      else if(this.cursors.down.isDown) {
        this.playerDuck();
      }

      if(!this.cursors.down.isDown && this.player.isDucked && !this.pressingDown) {
        //change image and update the body size for the physics engine
        this.player.loadTexture('player');
        this.player.body.setSize(this.player.standDimensions.width, this.player.standDimensions.height);
        this.player.isDucked = false;
      }


      //restart the game if reaching the edge
      if(this.player.x <= -this.tileSize) {
        this.game.state.start('Game');
      }
      if(this.player.y >= this.game.world.height + this.tileSize) {
        this.game.state.start('Game');
      }
    }

    //generate further terrain
    this.generateTerrain();

  },
  generateTerrain: function(){

    var i, delta = 0, block;
    for(i = 0; i < this.floors.length; i++) {
      if(this.floors.getAt(i).body.x <= -this.tileSize) {

        if(Math.random() < this.probCliff && !this.lastCliff && !this.lastVertical) {
          delta = 1;
          this.lastCliff = true;
          this.lastVertical = false;
        }
        else if(Math.random() < this.probVertical && !this.lastCliff) {
          this.lastCliff = false;
          this.lastVertical = true;
          block = this.verticalObstacles.getFirstExists(false);
          block.reset(this.lastFloor.body.x + this.tileSize, this.game.world.height - 2 * this.tileSize);
          block.body.velocity.x = this.levelSpeed;
          block.body.immovable = true;


          upblock = this.goldcoin.getFirstExists(false);
          upblock.reset(this.lastFloor.body.x + this.tileSize, this.game.world.height - 4 * this.tileSize);
          upblock.body.velocity.x = this.levelSpeed;
          upblock.body.immovable = true;




          if(Math.random() < this.probMoreVertical) {
            block = this.verticalObstacles.getFirstExists(false);
            upblock=this.goldcoin.getFirstExists(false);
            if(block) {
              block.reset(this.lastFloor.body.x + this.tileSize, this.game.world.height - 1 * this.tileSize);
              block.body.velocity.x = this.levelSpeed;
              block.body.immovable = true;
            }

          }
if (Math.random() < this.probCactus && !this.lastCliff) {
  this.lastCliff = false;
  this.lastVertical = true;
  cactus = this.cactus.getFirstExists(false);
  cactus.reset(this.lastFloor.body.x + this.tileSize, this.game.world.height - 1 * this.tileSize);
  cactus.body.velocity.x = this.levelSpeed;
  cactus.body.immovable = true;
}
        }
        else {
          this.lastCliff = false;
          this.lastVertical = false;
        }

        this.floors.getAt(i).body.x = this.lastFloor.body.x + this.tileSize + delta * this.tileSize * 1.5;
        this.lastFloor = this.floors.getAt(i);
        break;
      }

    }
  },
  playerHit: function(player, blockedLayer) {
    //if hits on the right side, die
    if(player.body.touching.right) {

      //set to dead (this doesn't affect rendering)
      this.player.alive = false;

      //stop moving to the right
      this.player.body.velocity.x = 0;

      //change sprite image
      this.player.loadTexture('playerDead');
      this.dieSound.play();
      //go to gameover after a few miliseconds
      this.game.time.events.add(1500, this.gameOver, this);
    }
  },
  collect: function(player, collectable) {
    //play audio
    this.coinSound.play();
this.coincounter++;
    //remove sprite
    collectable.destroy();
  },
  initGameController: function() {

    if(!GameController.hasInitiated) {
      var that = this;

      GameController.init({
          right: {
              type: 'none',
          },
          left: {
              type: 'buttons',
              buttons: [
                false,
                {
                  label: 'J',
                  touchStart: function() {
                    if(!that.player.alive) {
                      return;
                    }
                    that.playerJump();
                  }
                },
                false,
                {
                  label: 'D',
                  touchStart: function() {
                    if(!that.player.alive) {
                      return;
                    }
                    that.pressingDown = true; that.playerDuck();
                  },
                  touchEnd: function(){
                    that.pressingDown = false;
                  }
                }
              ]
          },
      });
      GameController.hasInitiated = true;
    }

  },
  //create coins
  createCoins: function() {
    this.coins = this.game.add.group();
    this.coins.enableBody = true;
    var result = this.findObjectsByType('coin', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.coins);
    }, this);
  },
  gameOver: function() {
    this.game.state.start('Game');
  },

  playerJump: function() {
    this.jumpSound.play();
    if(this.player.body.touching.down) {
      this.player.loadTexture('jump');
      this.player.body.setSize(this.player.jumpdimensions.width, this.player.jumpdimensions.height);
      this.player.isjumped = true;
      this.player.body.velocity.y -= 700;
    }
  },
  playerDuck: function() {
      //change image and update the body size for the physics engine
      this.player.loadTexture('playerDuck');
      this.player.body.setSize(this.player.duckedDimensions.width, this.player.duckedDimensions.height);

      //we use this to keep track whether it's ducked or not
      this.player.isDucked = true;
  },
  render: function()
    {
      this.distance=Math.ceil(this.game.time.totalElapsedSeconds());
         this.game.debug.text(this.coincounter+" Coins" , 32, 32,"#000");

    }
};
