var map, layer, causticLayer, player, Background, cursors, jumpKey, actionKeys,
    coinsCounterText,
    coins,
    coinsCount = 0,
    checkpoints,
    haveAdditionalWeapon = false,
    additionalWeaponIcon,
    checkpointCoor = {
        x: 50,
        y: 50,
    },
    lifes, status = 'idle',
    gameOver, countOflifes = 3,
    additionalWeapon,
    daggers,
    enemy,
    bone;
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
        game.load.image('dagger_active', 'assets/images/dagger_active.png');
        game.load.image('dagger_on_ground', 'assets/images/dagger_on_ground.png');
        game.load.image('coin_cunter', 'assets/images/coin_counter.png');
        game.load.image('skeleton_bone', 'assets/images/skeleton/skeleton_bone.png');
        game.load.spritesheet('tiles', 'assets/images/tiles.png', 16, 16);
        game.load.tilemap('level', 'assets/images/level.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.atlas('knight', 'assets/images/knight/knight_atlas.png', 'assets/images/knight/knight_atlas.json');
        game.load.atlas('skeleton', 'assets/images/skeleton/skeleton_atlas.png', 'assets/images/skeleton/skeleton_atlas.json');
        game.load.atlas('slime', 'assets/images/slime/slime_atlas.png', 'assets/images/slime/slime_atlas.json');
        game.load.atlas('flag', 'assets/images/flag/flag_atlas.png', 'assets/images/flag/flag_atlas.json');
    },
    create: function() {
        Background = game.add.graphics(0, 0);
        Background.beginFill(0x53BECE, 1);
        Background.drawRect(0, 0, game.world.width + 500, game.world.height + 500);
        Background.endFill();
        game.physics.startSystem(Phaser.Physics.ARCADE);
        map = game.add.tilemap('level');
        map.addTilesetImage('tiles');
        map.setCollisionBetween(1, 12);
        map.setCollisionBetween(13, 16);
        map.setCollisionBetween(19, 22);
        map.setTileIndexCallback(18, setCheckpointCoor, game);
        layer = map.createLayer('Tile Layer 1');
        causticLayer = map.createLayer('CausticTileLayer');
        map.setCollisionBetween(31, 33, true, causticLayer);
        layer.resizeWorld();

        flag = new Flag(game, 40, 444.5);
        flag.enableBody = true;
        game.add.existing(flag);

        player = game.add.sprite(32, game.world.height - 150, 'knight');
        player.animations.add('knight_walk', Phaser.Animation.generateFrameNames('knight_walk', 0, 7), 8, true);
        player.animations.add('knight_idle', Phaser.Animation.generateFrameNames('knight_idle', 0, 3), 4, true);
        player.animations.add('knight_slash', Phaser.Animation.generateFrameNames('knight_slash', 0, 9), 20, true);
        player.animations.add('knight_block', Phaser.Animation.generateFrameNames('knight_block', 0, 6), 20, true);
        player.animations.add('knight_hit', Phaser.Animation.generateFrameNames('knight_death', 0, 2), 10, true);
        player.animations.add('knight_death', Phaser.Animation.generateFrameNames('knight_death', 0, 8), 6, true);
        game.physics.enable(player);
        player.body.gravity.y = 300;
        player.body.bounce.y = 0.1;
        player.anchor.setTo(0.5, 0.5);
        player.x = 50;
        player.y = 50;

        enemy = game.add.group();
        createEnemy();

        daggers = game.add.group();
        daggers.enableBody = true;
        map.createFromObjects('daggers', 87, 'dagger_on_ground', 0, true, false, daggers);

        coins = game.add.group();
        coins.enableBody = true;
        map.createFromObjects('coins', 85, 'coin', 0, true, false, coins);
        coinsCounterText = game.add.text(45, 40, ':0', {
            font: "20px Press Start 2P",
            fill: "#190707"
        });
        coinsCounterText.fixedToCamera = true;
        coinsCounterImage = game.add.sprite(20, 35, 'coin_cunter');
        coinsCounterImage.scale.setTo(0.1, 0.1);
        coinsCounterImage.fixedToCamera = true;

        potionsHealth = game.add.group();
        potionsHealth.enableBody = true;
        map.createFromObjects('h_potions', 86, 'potion_health', 0, true, false, potionsHealth);

        checkpoints = game.add.group();
        checkpoints.enableBody = true;
        map.createFromObjects('checkpoints', 18, 'tiles', 16, true, false, checkpoints);


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
        actionKeys = game.input.keyboard.addKeys({
            'slash': Phaser.KeyCode.A,
            'block': Phaser.KeyCode.D,
            'death': Phaser.KeyCode.K,
            'jumpKey': Phaser.KeyCode.SPACEBAR,
            'pause': Phaser.KeyCode.ESC,
            'additionalWeapon': Phaser.KeyCode.C
        })
        game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
        restart();
    },
    update: function() {
        game.physics.arcade.collide(player, causticLayer, getDamageFromTile);
        game.physics.arcade.collide(player, layer);
        game.physics.arcade.collide(additionalWeapon, layer, () => additionalWeapon.kill());
        game.physics.arcade.overlap(player, coins, getCoin, null, this);
        game.physics.arcade.overlap(player, potionsHealth, addLife, null, this);
        game.physics.arcade.overlap(player, checkpoints, setCheckpointCoor, null, this);
        game.physics.arcade.overlap(additionalWeapon, enemy, killEnemyByAdditionalWeapon, null, this);
        game.physics.arcade.overlap(player, daggers, getAdditionalWeapon, null, this);
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
        } else if (actionKeys.block.isDown && status === 'idle') {
            player.animations.play('knight_block');
            if (player.animations.currentFrame.name === 'knight_block6')
                player.animations.paused = true;
        } else if (actionKeys.additionalWeapon.isDown && status === 'idle') {
            throwAdditionalWeapon();
        } else if (actionKeys.death.isDown || status === 'hit') {
            status = 'hit';
            player.animations.play('knight_hit');
            if (player.animations.currentFrame.name === 'knight_death2')
                getDamage();
        } else if (status === 'idle') {
            player.animations.play('knight_idle');
        }
        if (actionKeys.jumpKey.isDown && player.body.onFloor() && status === 'idle') {
            player.body.velocity.y = -200;
        }
        if (actionKeys.pause.isDown) {
            restart();
            game.state.start('Menu');
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
    const x_range = 40,
        y_range = 15;
    const hit = (i, scale) => {
        return scale ?
            player.world.x < enemy.children[i].world.x &&
            player.world.x + x_range >= enemy.children[i].world.x &&
            player.world.y + y_range > enemy.children[i].world.y &&
            player.world.y - (y_range + 5) < enemy.children[i].world.y :
            player.world.x > enemy.children[i].world.x &&
            player.world.x - x_range <= enemy.children[i].world.x &&
            player.world.y + y_range > enemy.children[i].world.y &&
            player.world.y - (y_range + 5) < enemy.children[i].world.y;
    };
    for (let i = 0; i < enemy.countLiving(); i++) {
        if ((player.scale.x > 0 && hit(i, true)) || (player.scale.x < 0 && hit(i, false)))
            enemy.getChildAt(i).destroy();
    }
}

function getDamageFromTouch() {
    const x_range = 10,
        y_range = 15,
        hitSpeed = 500;
    const touch = (i, scale) => {
        return scale ?
            player.world.x < enemy.children[i].world.x &&
            player.world.x + x_range >= enemy.children[i].world.x &&
            player.world.y + y_range >= enemy.children[i].world.y &&
            player.world.y - (y_range + 5) <= enemy.children[i].world.y :
            player.world.x > enemy.children[i].world.x &&
            player.world.x - x_range <= enemy.children[i].world.x &&
            player.world.y + y_range >= enemy.children[i].world.y &&
            player.world.y - (y_range + 5) <= enemy.children[i].world.y;
    };
    for (let i = 0; i < enemy.countLiving(); i++) {
        if ((player.scale.x > 0 && touch(i, true)) || (player.scale.x < 0 && touch(i, false))) {
            if (player.animations.currentFrame.name != 'knight_block6') status = 'hit';
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
    skeleton = new Skeleton(game, 75, 124, 1, 50);
    game.add.existing(skeleton);
    enemy.add(skeleton);
    skeleton = new Skeleton(game, 480, 124, -1, 50);
    game.add.existing(skeleton);
    enemy.add(skeleton);
    skeleton = new Skeleton(game, 100, 304, 1, 50);
    game.add.existing(skeleton);
    enemy.add(skeleton);
    skeleton = new Skeleton(game, 460, 304, -1, 50);
    game.add.existing(skeleton);
    enemy.add(skeleton);
    skeleton = new Skeleton(game, 550, 304, -1, 50);
    game.add.existing(skeleton);
    enemy.add(skeleton);
    slime = new Slime(game, 254, 76.5, 1, 50, 50);
    game.add.existing(slime);
    enemy.add(slime);
    slime = new Slime(game, 852, 444.5, 1, 50, 50);
    game.add.existing(slime);
    enemy.add(slime);
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
    player.scale.setTo(1, 1);
    gameOver.visible = false;
    coinsCount = 0;
    coinsCounterText.setText(':' + coinsCount);
    daggers.removeAll();
    if (additionalWeaponIcon) additionalWeaponIcon.kill();
    haveAdditionalWeapon = false
    map.createFromObjects('daggers', 87, 'dagger_on_ground', 0, true, false, daggers);
    coins.removeAll();
    map.createFromObjects('coins', 85, 'coin', 0, true, false, coins);
    potionsHealth.removeAll();
    map.createFromObjects('h_potions', 86, 'potion_health', 0, true, false, potionsHealth);
    checkpointCoor.x = start.x;
    checkpointCoor.y = start.y;
    checkpoints.children.map(checkpoint => checkpoint.frame = 16);
}

function getDamageFromTile() {
    player.x = checkpointCoor.x;
    player.y = checkpointCoor.y;
    status = 'hit';
}

function setCheckpointCoor(player, checkpoint) {
    if (checkpoint.frame === 16) {
        checkpoint.frame = 17;
        checkpointCoor.x = player.x;
        checkpointCoor.y = player.y;
    }
}

function getCoin(player, coin) {
    coinsCount++;
    coinsCounterText.setText(':' + coinsCount);
    coin.kill();
}

function getAdditionalWeapon(player, AW) {
    if (haveAdditionalWeapon === false) {
        let AWNameActive;
        let AWNamePassive;
        switch (AW.key) {
            case 'dagger_on_ground':
                AWNameActive = 'dagger_active';
                AWNamePassive = 'dagger_on_ground';
                break;
            default:
                break;
        }
        AW.kill();
        additionalWeaponIcon = game.add.sprite(15, screenHeight - 50, AWNamePassive);
        additionalWeaponIcon.scale.setTo(1.5, 1.5);
        additionalWeaponIcon.fixedToCamera = true;
        additionalWeapon = game.add.sprite(0, 0, AWNameActive);
        additionalWeapon.exists = false;
        additionalWeapon.enableBody = true;
        additionalWeapon.physicsBodyType = Phaser.Physics.ARCADE;
        additionalWeapon.checkWorldBounds = true;
        additionalWeapon.outOfBoundsKill = true;
        game.physics.enable(additionalWeapon);
        haveAdditionalWeapon = true;
    }
}

function throwAdditionalWeapon() {
    if (haveAdditionalWeapon === true) {
        haveAdditionalWeapon = false;
        additionalWeapon.reset(player.x - 8, player.y - 8);
        additionalWeapon.scale.setTo(0.5, 0.5);
        if (player.scale.x > 0) {
            game.physics.arcade.moveToXY(additionalWeapon, player.x + 10, player.y - 8, 200);
        } else {
            additionalWeapon.scale.setTo(-0.5, 0.5);
            game.physics.arcade.moveToXY(additionalWeapon, player.x - 10, player.y - 8, 200);
        }
        additionalWeaponIcon.kill();
    }
}

function killEnemyByAdditionalWeapon(additionalWeapon, enemy) {
    enemy.destroy();
    additionalWeapon.kill();
}
