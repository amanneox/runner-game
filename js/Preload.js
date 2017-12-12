var SideScroller = SideScroller || {};

//loading the game assets
SideScroller.Preload = function(){};

SideScroller.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.image('player', 'assets/images/player/PNG/Player/poses/player_stand.png');
      this.load.image('walk1', 'assets/images/player/PNG/Player/poses/player_walk1.png');
        this.load.image('walk2', 'assets/images/player/PNG/Player/poses/player_walk2.png');
        this.load.image('jump', 'assets/images/player/PNG/Player/poses/player_jump.png');
    this.load.image('playerDuck', 'assets/images/player/PNG/Player/poses/player_duck.png');
    this.load.image('playerDead', 'assets/images/player/PNG/Player/poses/player_hurt.png');
    this.load.image('goldCoin', 'assets/images/goldCoin.png');

      this.load.image('coinhud', 'assets/images/coin_gold.png');
        this.load.image('carrothud', 'assets/images/carrots.png');
        
    this.load.image('floor', 'assets/images/ground.png');
      this.load.image('floor1', 'assets/images/ground1.png');
        this.load.image('floor2', 'assets/images/ground2.png');
          this.load.image('floor3', 'assets/images/ground3.png');
            this.load.image('bg', 'assets/images/bg_layer4.png');
    this.load.image('yellowBlock', 'assets/images/yellow-block.png');
    this.load.audio('coin', 'assets/audio/coin.wav');
    this.load.audio('die', 'assets/audio/die.ogg');
        this.load.audio('jump', 'assets/audio/jump.ogg');
  },
  create: function() {
    this.state.start('Game');
  }
};
