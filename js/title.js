var SideScroller = SideScroller || {};

SideScroller.title = function(){};


SideScroller.title.prototype = {
     create: function(){

          var title = this.game.add.sprite(this.game.width / 2, 60, "gametitle");
          title.anchor.set(0.5);
          var grid = this.game.add.sprite(this.game.width / 2, 130, "gridedition");
          grid.anchor.set(0.5);
          var playButton = this.game.add.button(this.game.width / 2, this.game.height / 2 + 100, "playbutton", function(){});
          playButton.anchor.set(0.5);
          menuGroup = this.game.add.group();
          var menuButton = this.game.add.button(this.game.width / 2, this.game.height - 30, "menubutton", this.toggleMenu);
          menuButton.anchor.set(0.5);
          menuGroup.add(menuButton);
          var resetGame = this.game.add.button(this.game.width / 2, this.game.height + 50, "resetgame", function(){});
          resetGame.anchor.set(0.5);
          menuGroup.add(resetGame);
          var thankYou = this.game.add.button(this.game.width / 2,this.game.height + 130, "thankyou", function(){});
          thankYou.anchor.set(0.5);
          menuGroup.add(thankYou);
        },
 toggleMenu:function()
{
     if(menuGroup.y == 0){
          var menuTween = this.game.add.tween(menuGroup).to({
               y: -180
          }, 500, Phaser.Easing.Bounce.Out, true);
     }
     if(menuGroup.y == -180){
          var menuTween = this.game.add.tween(menuGroup).to({
               y: 0
          }, 500, Phaser.Easing.Bounce.Out, true);
     }
}
   };
