const Menu = {
    preload: function (){
         game.load.image('start','../assets/images/new_game.png');
         game.load.image('settings','assets/images/rules.png');
    },
    create: function (){
        Background = this.add.graphics(0, 0);
        Background.beginFill(0x53BECE, 1);
        Background.drawRect(0, 0, 800, 640);
        Background.endFill();
        const startButton = this.add.button(game.world.centerX, game.world.centerY + 25, 'start', this.startGame, this);
        const settings = this.add.button(game.world.centerX - 5, game.world.centerY + 100, 'settings', this.settings, this);
        startButton.anchor.setTo(0.5, 0.5);
        settings.anchor.setTo(0.5, 0.5);
        startButton.scale.setTo(0.2, 0.2);
        settings.scale.setTo(0.2, 0.2);

    },
    startGame: function (){
        this.state.start('Game');
    },
    settings: function (){
        this.state.start('Settings');
    }
};
