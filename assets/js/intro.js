let Intro = {
    create: function() {
        game.stage.backgroundColor = '#ffffff';
        player = game.add.sprite(game.world.centerX, game.world.centerY, 'knight');
        player.animations.add('knight_idle', Phaser.Animation.generateFrameNames('knight_idle', 0, 3), 4, true);
        game.add.tween(player).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
        player.scale.setTo(2, 2);
        player.animations.play('knight_idle');
    },
    update: function() {

    }
}