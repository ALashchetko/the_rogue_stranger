var map, layer, player, Background, cursors, jumpKey, actionKeys, jumpTimer = 0,
    lifes, status = 'idle',
    gameOver, countOflifes = 3,
    enemy;
let screenWidth = 640,
    screenHeight = 480;
var Game = {
    preload: function() {
        game.load.spritesheet('tiles', 'assets/images/tiles.png', 16, 16);
        game.load.image('heart', 'assets/images/heart.png');
        game.load.tilemap('level', 'assets/images/level.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.atlas('knight', 'assets/images/knight/knight_atlas.png', 'assets/images/knight/knight_atlas.json');
        game.load.atlas('skeleton', 'assets/images/skeleton/skeleton_atlas.png', 'assets/images/skeleton/skeleton_atlas.json');
    },
    create: function() {
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
        player = game.add.sprite(32, game.world.height - 150, 'knight');
        player.animations.add('knight_walk', Phaser.Animation.generateFrameNames('knight_walk', 0, 7), 8, true);
        player.animations.add('knight_idle', Phaser.Animation.generateFrameNames('knight_idle', 0, 3), 4, true);
        player.animations.add('knight_slash', Phaser.Animation.generateFrameNames('knight_slash', 0, 9), 10, true);
        player.animations.add('knight_block', Phaser.Animation.generateFrameNames('knight_block', 0, 6), 10, true);
        player.animations.add('knight_hit', Phaser.Animation.generateFrameNames('knight_death', 0, 2), 10, true);
        player.animations.add('knight_death', Phaser.Animation.generateFrameNames('knight_death', 0, 8), 6, true);
        game.physics.enable(player);
        player.body.gravity.y = 250;
        player.body.bounce.y = 0.1;
        player.anchor.setTo(0.5, 0.5);
        player.x = 50;
        player.y = 50;

        enemy = game.add.group();
        createEnemy();

        lifes = game.add.group();
        addLife(countOflifes);
        lifes.fixedToCamera = true;

        var style = {
            font: "bold 50px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        gameOver = game.add.text(0, 0, "   Game over! \nClick to restart", style);
        gameOver.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
        gameOver.setTextBounds(0, screenHeight / 2, screenWidth, 50);
        gameOver.visible = false;
        gameOver.fixedToCamera = true;

        cursors = game.input.keyboard.createCursorKeys();
        jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        actionKeys = game.input.keyboard.addKeys({
            'slash': Phaser.KeyCode.A,
            'block': Phaser.KeyCode.D,
            'death': Phaser.KeyCode.K
        })
        game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
    },
    update: function() {
        game.physics.arcade.collide(player, layer);
        player.body.velocity.x = 0;
        getDamageFromTouch();
        death();
        if (cursors.left.isDown && status === 'idle') {
            player.body.velocity.x = -100;
            player.scale.setTo(-1, 1);
            player.animations.play('knight_walk');
        } else if (cursors.right.isDown && status === 'idle') {
            player.body.velocity.x = 100;
            player.scale.setTo(1, 1);
            player.animations.play('knight_walk');
        } else if (actionKeys.slash.isDown && status === 'idle') {
            player.animations.play('knight_slash');
            if (player.animations.currentFrame.name === 'knight_slash7')
                getSlash();
        } else if (actionKeys.block.isDown) {
            player.animations.play('knight_block');
            if (player.animations.currentFrame.name === 'knight_block6') {
                player.animations.paused = true;
            }
        } else if (actionKeys.death.isDown || status === 'hit') {
            status = 'hit';
            player.animations.play('knight_hit');
            if (player.animations.currentFrame.name === 'knight_death2')
                getDamage();
        } else if (status === 'idle') {
            player.animations.play('knight_idle');
        }
        if (jumpKey.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
            player.body.velocity.y = -200;
            jumpTimer = game.time.now + 650;
            addLife(lifes.countLiving() + 1);
        }
    }
};

function addLife(count) {
    if (count <= 5) {
        lifes.removeAll();
        for (var i = 0; i < count; i++) {
            var life = lifes.create(screenWidth - 150 + (30 * i), 50, 'heart');
            life.anchor.setTo(0.5, 0.5);
            life.scale.setTo(0.2, 0.2);
            life.alpha = 0.85;
        }
    }
}

function getSlash() {
    const range = 40,
        tmpPos = 15;
    const hit = (i, scale) => {
        return scale ?
            player.world.x < enemy.children[i].world.x &&
            player.world.x + range >= enemy.children[i].world.x &&
            player.world.y + tmpPos > enemy.children[i].world.y &&
            player.world.y - (tmpPos + 5) < enemy.children[i].world.y :
            player.world.x > enemy.children[i].world.x &&
            player.world.x - range <= enemy.children[i].world.x &&
            player.world.y + tmpPos > enemy.children[i].world.y &&
            player.world.y - (tmpPos + 5) < enemy.children[i].world.y;

    };
    for (let i = 0; i < enemy.countLiving(); i++) {
        if ((player.scale.x > 0 && hit(i, true)) || (player.scale.x < 0 && hit(i, false)))
            enemy.removeChild(enemy.children[i]);
    }
}

function getDamageFromTouch() {
    const range = 5,
        tmpPos = 15,
        hitSpeed = 500;
    const touch = (i, scale) => {
        return scale ?
            player.world.x < enemy.children[i].world.x &&
            player.world.x + range >= enemy.children[i].world.x &&
            player.world.y + tmpPos >= enemy.children[i].world.y &&
            player.world.y - (tmpPos + 5) <= enemy.children[i].world.y :
            player.world.x > enemy.children[i].world.x &&
            player.world.x - range <= enemy.children[i].world.x &&
            player.world.y + tmpPos >= enemy.children[i].world.y &&
            player.world.y - (tmpPos + 5) <= enemy.children[i].world.y;
    };
    for (let i = 0; i < enemy.countLiving(); i++) {
        if ((player.scale.x > 0 && touch(i, true)) || (player.scale.x < 0 && touch(i, false))) {
            status = 'hit';
            player.animations.play('knight_hit');
            if (player.scale.x > 0) enemy.children[i].scale.x < 0 ? player.body.velocity.x = -hitSpeed * 2.5 : player.body.velocity.x = -hitSpeed;
            else enemy.children[i].scale.x < 0 ? player.body.velocity.x = hitSpeed : player.body.velocity.x = hitSpeed * 2.5;
            if (player.animations.currentFrame.name === 'knight_death2') getDamage();
        }
    }
}

function death() {
    if (!lifes.countLiving()) {
        status = 'death';
        player.animations.play('knight_death');
        if (player.animations.currentFrame.name === 'knight_death8') {
            player.kill();
            gameOver.visible = true;
            game.input.onTap.addOnce(restart, this);
        }
    }
}

function getDamage() {
    let life = lifes.getFirstAlive();
    if (!lifes.countLiving()) death();
    else {
        life.kill();
        status = 'idle';
    }
}

function createEnemy() {
    skeleton = new Skeleton(game, 75, 124, 1, 40);
    game.add.existing(skeleton);
    enemy.add(skeleton);
    skeleton = new Skeleton(game, 480, 124, -1, 40);
    game.add.existing(skeleton);
    enemy.add(skeleton);
    skeleton = new Skeleton(game, 100, 304, 1, 40);
    game.add.existing(skeleton);
    enemy.add(skeleton);
    skeleton = new Skeleton(game, 460, 304, -1, 40);
    game.add.existing(skeleton);
    enemy.add(skeleton);
    skeleton = new Skeleton(game, 550, 304, -1, 40);
    game.add.existing(skeleton);
    enemy.add(skeleton);
}

function restart() {
    addLife(countOflifes);
    status = 'idle';
    enemy.removeAll();
    createEnemy();
    player.revive();
    player.x = 50;
    player.y = 50;
    gameOver.visible = false;
}
