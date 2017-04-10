const Settings = {
    preload: function () {
        game.load.image('back','assets/images/back.png');
        game.load.image('keys','assets/images/rules.png');
    },
    create: function () {
        Background = this.add.graphics(0, 0);
        Background.beginFill(0x53BECE, 1);
        Background.drawRect(0, 0, 800, 640);
        Background.endFill();
        const back = this.add.button(game.world.centerX - 5, game.world.centerY + 100, 'back', this.menu, this);
        back.anchor.setTo(0.5, 0.5);
        back.scale.setTo(0.2, 0.2);
    },
    menu: function () {
        this.state.start('Menu');
    }
}
