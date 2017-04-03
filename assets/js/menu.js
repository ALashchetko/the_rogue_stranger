var Menu = {
    preload: function (){
         game.load.image('button','../assets/images/diamond.png');
    },
    create: function (){
        Background = this.add.graphics(0, 0);
        Background.beginFill(0x53BECE, 1);
        Background.drawRect(0, 0, 800, 640);
        Background.endFill();
        this.add.button(game.world.centerX, 400, 'button', this.startGame, this);
    },
    startGame: function (){
        this.state.start('Game');
    }
};
