const Menu = {
    preload: function (){
         game.load.image('start','../assets/images/new_game.png');
         game.load.image('settings','assets/images/rules.png');
    },
    create: function (){
        Background = this.add.graphics(0, 0);
        Background.beginFill(0x53BECE, 1);
        Background.drawRect(0, 0, game.world.width, game.world.height);
        Background.endFill();
        const startButton = this.add.button(320, 265, 'start', this.startGame, this);
        const settings = this.add.button(315, 340, 'settings', this.settings, this);
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
