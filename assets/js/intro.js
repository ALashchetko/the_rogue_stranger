var princess, prince, wizard;

let Intro = {
    create: function() {

        Background = game.add.sprite(0, 0, 'back_intro');
        Background.scale.setTo(0.8, 0.8);
        princess = game.add.sprite(100, 223, 'princess');
        princess.anchor.setTo(0.5, 0.5);
        princess.animations.add('princess_walk', Phaser.Animation.generateFrameNames('princess_walk_00', 1, 8), 20, true);
        //princess.animations.play('princess_walk');
        map = game.add.tilemap('intro');
        map.addTilesetImage('tiles');
        player = game.add.sprite(50, 215, 'knight');
        player.animations.add('knight_idle', Phaser.Animation.generateFrameNames('knight_idle', 0, 3), 4, true);
        player.scale.setTo(1.3, 1.3);
        player.anchor.setTo(0.5, 0.5);
        player.animations.play('knight_idle');
        layer = map.createLayer('Tile Layer 1');


    },
    update: function() {

    }
}