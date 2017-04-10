var map, layer, player, Background, cursors, jumpKey, actionKeys, jumpTimer = 0,
    coinsCounterText,
    coins,
    coinsCount = 0,
    checkpointCoor = {
        x: 50,
        y: 50,
    },
    lifes, status = 'idle',
    gameOver, countOflifes = 3,
    enemy;
const screenWidth = 640,
    screenHeight = 480;
let start = {
    x: 50,
    y: 50
};
var Game = {
    preload: function() {
        game.load.image('heart', 'assets/images/heart.png');
        game.load.image('potion_health', 'assets/images/potion_health.png');
        game.load.image('coin', 'assets/images/coin.png');
        game.load.image('coin_cunter', 'assets/images/coin_counter.png');
        game.load.spritesheet('tiles', 'assets/images/tiles.png', 16, 16);
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
        map.setTileIndexCallback(31, getDamageFromTile, game);
        map.setTileIndexCallback(32, getDamageFromTile, game);
        map.setTileIndexCallback(33, getDamageFromTile, game);
        map.setTileIndexCallback(18, setCheckpointCoor, game);
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

        coins = game.add.group();
        coins.enableBody = true;
        map.createFromObjects('coins', 85, 'coin', 0, true, false, coins);
        coinsCounterText = game.add.text(45, 40, ':0', { font: "20px Press Start 2P", fill: "#190707" });
        coinsCounterText.fixedToCamera = true;
        coinsCounterImage = game.add.sprite(20, 35, 'coin_cunter');
        coinsCounterImage.scale.setTo(0.1, 0.1);
        coinsCounterImage.fixedToCamera = true;

        potionsHealth = game.add.group();
        potionsHealth.enableBody = true;
        map.createFromObjects('h_potions', 86, 'potion_health', 0, true, false, potionsHealth);
        potionsHealth.scale.setTo(0.8, 0.8);

        lifes = game.add.group();
        initLife(countOflifes);
        lifes.fixedToCamera = true;

        const style = {
            font: "bold 30px Press Start 2P",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        gameOver = game.add.text(0, 0, "\t\t\tGame over! \nClick to restart", style);
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
        game.physics.arcade.overlap(player, coins, getCoin, null, this);
        game.physics.arcade.overlap(player, potionsHealth, addLife, null, this);
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
        }
    }
};


function initLife(count) {
    for (var i = 0; i < count; i++) {
        var life = lifes.create(screenWidth - (30 * i) - 50, 50, 'heart');
        life.anchor.setTo(0.5, 0.5);
        life.scale.setTo(0.2, 0.2);
        life.alpha = 0.85;
    }
}


function addLife(player, potionHealth) {
    var lifesCount = lifes.countLiving()
    if (lifesCount < countOflifes && lifesCount !== 0) {
        var life = lifes.getChildAt(lifesCount);
        life.revive();
    }
    potionHealth.kill();
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
            if (player.scale.x > 0) enemy.children[i].scale.x < 0 ? player.body.velocity.x = -hitSpeed * 2.5 : player.body.velocity.x = -hitSpeed;
            else enemy.children[i].scale.x < 0 ? player.body.velocity.x = hitSpeed : player.body.velocity.x = hitSpeed * 2.5;
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
    let life = lifes.getChildAt(lifes.countLiving() - 1);
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
    status = 'idle';
    lifes.removeAll();
    initLife(countOflifes);
    enemy.removeAll();
    createEnemy();
    player.revive();
    player.x = start.x;
    player.y = start.y;
    gameOver.visible = false;
    coinsCount = 0;
    coinsCounterText.setText(':' + coinsCount);
    potionsHealth = potionsHealth.children.map(potionHealth => potionHealth.revive());
    coins = coins.children.map(coin => coin.revive());
}

function getDamageFromTile() {
    player.x = checkpointCoor.x;
    player.y = checkpointCoor.y;
    status = 'hit';
}

function setCheckpointCoor() {
    checkpointCoor.x = player.x;
    checkpointCoor.y = player.y;
}

function getCoin(player, coin) {
    coinsCount++;
    coinsCounterText.setText(':' + coinsCount);
    coin.kill();
}
