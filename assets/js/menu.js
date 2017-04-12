const Menu = {
    preload: function() {
        game.load.image('start', '../assets/images/new_game.png');
        game.load.image('settings', 'assets/images/rules.png');
        game.load.image('back1', 'assets/images/back1.jpg');
    },
    create: function() {
        const background = game.add.sprite(0, 0, 'back1')
        background.scale.setTo(1.2, 1.2);
        const style = {
            font: "bold 55px Algerian",
            fill: 'chocolate',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        const text = game.add.text(320, 80, "THE HISTORY BEGIN", style);
        text.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
        text.anchor.setTo(0.5, 0.5);
        const startButton = this.add.button(320, 265, 'start', this.startGame, this);
        const settings = this.add.button(315, 340, 'settings', this.settings, this);
        startButton.anchor.setTo(0.5, 0.5);
        settings.anchor.setTo(0.5, 0.5);
        startButton.scale.setTo(0.2, 0.2);
        settings.scale.setTo(0.2, 0.2);
    },
    startGame: function() {
        this.state.start('Game');
    },
    settings: function() {
        this.state.start('Settings');
    }
};
