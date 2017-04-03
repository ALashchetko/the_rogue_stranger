var map, layer, player, Background, cursors, jumpKey, jumpTimer = 0;
var Game = {
    preload: function () {
        game.load.spritesheet('tiles', 'assets/images/tiles.png', 16, 16);
        game.load.tilemap('level', 'assets/images/level.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
    },
    create: function () {
        Background = game.add.graphics(0, 0);
        Background.beginFill(0x53BECE, 1);
        Background.drawRect(0, 0, game.world.width + 500, game.world.height + 500);
        Background.endFill();
        game.physics.startSystem(Phaser.Physics.ARCADE);
        map = game.add.tilemap('level');
        map.addTilesetImage('tiles');
        map.setCollisionBetween(1, 25);
        layer = map.createLayer('Tile Layer 1');
        layer.resizeWorld();
        player = game.add.sprite(32, game.world.height - 150, 'dude');
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        game.physics.enable(player);
        player.body.gravity.y = 250;
        player.body.bounce.y = 0.1;
        player.anchor.setTo(0.5, 0.5);
        player.x = 50;
        player.y = 50;
        cursors = game.input.keyboard.createCursorKeys();
        jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
    },
    update: function () {
        game.physics.arcade.collide(player, layer);
        player.body.velocity.x = 0;
        if (cursors.left.isDown) {
            player.body.velocity.x = -100;
            player.animations.play('left');
        }
        else if (cursors.right.isDown) {
            player.body.velocity.x = 100;
            player.animations.play('right');
        }
        else
        {
            player.animations.stop();
            player.frame = 4;
        }
        if (jumpKey.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
            player.body.velocity.y = -200;
            jumpTimer = game.time.now + 650;
        }
    }
};
