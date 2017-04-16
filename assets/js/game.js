var map, layer, causticLayer, player, Background, cursors, actionKeys,
    coinsCounterText, coins, coinsCount = 0,
    checkpoints, haveAdditionalWeapon = false,
    additionalWeaponIcon, add_weapon = false,
    lifes,
    ladders,
    water,
    gameOver,
    tombstones,
    countOflifes = 3,
    additionalWeapon, daggers, enemy, flag,
    checkpointCoor = {
        x: 50,
        y: 50,
    },
    getDamageSound,
    slimeKillSound,
    skeletonKillSound,
    slashOnTargetSound,
    slashWithoutTarget,
    jumpSound,
    gameOverSound,
    coinPickupSound,
    drinkPotionSound,
    shieldSound,
    daggerThrowSound,
    daggerPickUpSound,
    checkpointSound,
    alertSound,
    gameMusic;
const screenWidth = 640,
    screenHeight = 480;
const style = {
    font: "bold 30px Press Start 2P",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
};
const countOfLevels = 2;
let current_level = 1;

let Game = {
    create: function() {
        Background = game.add.sprite(0, 0, 'level1back');
        Background.fixedToCamera = true;
        game.physics.startSystem(Phaser.Physics.ARCADE);

        map = game.add.tilemap('level1');
        map.addTilesetImage('tiles');
        map.setCollisionBetween(1, 4);
        map.setCollisionBetween(7, 10);
        map.setCollisionBetween(13, 16);
        map.setCollisionBetween(19, 22);
        map.setCollision([25, 26, 27, 28, 29, 30, 43, 44, 54, 60, 66, 77]);
        map.setTileIndexCallback(18, setCheckpointCoor, game);
        layer = map.createLayer('Tile Layer 1');
        causticLayer = map.createLayer('CausticTileLayer');
        map.setCollisionBetween(31, 33, true, causticLayer);
        layer.resizeWorld();

        flag = new Flag(game, 2355, 300);
        flag.enableBody = true;
        game.add.existing(flag);

        tombstones = game.add.group();
        tombstones.enableBody = true;
        map.createFromObjects('tombstones', 88, 'tombstone', 0, true, false, tombstones);

        ladders = game.add.group();
        ladders.enableBody = true;
        map.createFromObjects('ladders', 78, 'tiles', 77, true, false, ladders);
        map.createFromObjects('ladders', 72, 'tiles', 71, true, false, ladders);

        player = new Player(game);
        game.add.existing(player);

        getDamageSound = game.add.audio('get_damage_sound');
        slimeKillSound = game.add.audio('slime_kill_sound');
        skeletonKillSound = game.add.audio('skeleton_kill_sound');
        slashOnTargetSound = game.add.audio('slash_on_target_sound');
        slashWithoutTargetSound = game.add.audio('slash_without_target_sound');
        jumpSound = game.add.audio('jump_sound');
        gameOverSound = game.add.audio('game_over_sound');
        coinPickupSound = game.add.audio('coin_pick_up_sound');
        drinkPotionSound = game.add.audio('drink_potion_sound');
        shieldSound = game.add.audio('shield_sound');
        daggerThrowSound = game.add.audio('dagger_throw_sound');
        daggerPickUpSound = game.add.audio('dagger_pick_up_sound');
        checkpointSound = game.add.audio('checkpoint_sound');
        gameMusic = game.add.audio('game_music');
        alertSound = game.add.audio('alert_sound');
        gameMusic.loop = true;

        enemy = game.add.group();

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
        coinsCounterImage = game.add.sprite(20, 35, 'coin_counter');
        coinsCounterImage.scale.setTo(0.1, 0.1);
        coinsCounterImage.fixedToCamera = true;

        potionsHealth = game.add.group();
        potionsHealth.enableBody = true;
        map.createFromObjects('h_potions', 86, 'potion_health', 0, true, false, potionsHealth);

        checkpoints = game.add.group();
        checkpoints.enableBody = true;
        map.createFromObjects('checkpoints', 18, 'tiles', 16, true, false, checkpoints);

        water = game.add.group();
        water.enableBody = true;
        map.createFromObjects('water', 55, 'tiles', 54, true, false, water);
        map.createFromObjects('water', 56, 'tiles', 55, true, false, water);
        map.createFromObjects('water', 57, 'tiles', 56, true, false, water);
        map.createFromObjects('water', 58, 'tiles', 57, true, false, water);

        lifes = game.add.group();
        initLife(countOflifes);
        lifes.fixedToCamera = true;

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
        restart();
    },
    update: function() {
        game.physics.arcade.overlap(player, tombstones, skeletonUprising, null, this);
        game.physics.arcade.overlap(additionalWeapon, enemy, killEnemyByAdditionalWeapon, null, this);
        game.physics.arcade.collide(additionalWeapon, layer, () => additionalWeapon.kill());
        player.body.velocity.x = 0;
        getDamageFromTouch();
        death();
        if (actionKeys.pause.isDown) {
            countOflifes = 3;
            start.y = 250;
            status = 'death';
            current_level = 1;
            create_level('level1');
            restart();
            gameMusic.stop();
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
        drinkPotionSound.play();
        life.revive();
    }
    potionHealth.kill();
}

function createEnemy() {
    if (current_level === 1) {
        skeleton = new Skeleton(game, 255, 290, 1, 50);
        game.add.existing(skeleton);
        enemy.add(skeleton);
        skeleton = new Skeleton(game, 1015, 250, 1, 50);
        game.add.existing(skeleton);
        enemy.add(skeleton);
        skeleton = new Skeleton(game, 1250, 250, -1, 50);
        game.add.existing(skeleton);
        enemy.add(skeleton);
        skeleton = new Skeleton(game, 1950, 290, -1, 50);
        game.add.existing(skeleton);
        enemy.add(skeleton);
        skeleton = new Skeleton(game, 2960, 290, -1, 50);
        game.add.existing(skeleton);
        enemy.add(skeleton);
        slime = new Slime(game, 254, 76.5, 1, 50, 50);
        game.add.existing(slime);
        enemy.add(slime);
        slime = new Slime(game, 855, 290, 1, 50, 50);
        game.add.existing(slime);
        enemy.add(slime);
        slime = new Slime(game, 1540, 420, 1, 50, 50);
        game.add.existing(slime);
        enemy.add(slime);
        slime = new Slime(game, 1600, 420, -1, 50, 50);
        game.add.existing(slime);
        enemy.add(slime);
    } else if (current_level === 2) {
        skeleton = new Skeleton(game, 480, 124, -1, 50);
        game.add.existing(skeleton);
        enemy.add(skeleton);
        skeleton = new Skeleton(game, 925, 120, -1, 50);
        game.add.existing(skeleton);
        enemy.add(skeleton);
        skeleton = new Skeleton(game, 725, 430, -1, 50);
        game.add.existing(skeleton);
        enemy.add(skeleton);
        slime = new Slime(game, 100, 124, 1, 50, 40);
        game.add.existing(slime);
        enemy.add(slime);
        slime = new Slime(game, 280, 76.5, 1, 50, 40);
        game.add.existing(slime);
        enemy.add(slime);
        slime = new Slime(game, 1270, 100, 1, 50, 50);
        game.add.existing(slime);
        enemy.add(slime);
        slime = new Slime(game, 100, 304, 1, 50, 50);
        game.add.existing(slime);
        enemy.add(slime);
        slime = new Slime(game, 460, 304, -1, 50, 50);
        game.add.existing(slime);
        enemy.add(slime);
        slime = new Slime(game, 550, 304, -1, 50, 50);
        game.add.existing(slime);
        enemy.add(slime);
        slime = new Slime(game, 852, 444.5, 1, 50, 50);
        game.add.existing(slime);
        enemy.add(slime);
    }
}

function setCheckpointCoor(player, checkpoint) {
    if (checkpoint.frame === 16) {
        setupText('Checkpoint activated!');
        checkpointSound.play();
        checkpoint.frame = 17;
        checkpointCoor.x = player.x;
        checkpointCoor.y = player.y;
    }
}

function getCoin(player, coin) {
    coinsCount++;
    coinsCounterText.setText(':' + coinsCount);
    coinPickupSound.play();
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
        daggerPickUpSound.play();
        additionalWeaponIcon = game.add.sprite(15, screenHeight - 50, AWNamePassive);
        additionalWeaponIcon.scale.setTo(1.5, 1.5);
        additionalWeaponIcon.fixedToCamera = true;
        additionalWeapon = game.add.sprite(0, 0, AWNameActive);
        additionalWeapon.exists = false;
        additionalWeapon.enableBody = true;
        additionalWeapon.checkWorldBounds = true;
        additionalWeapon.outOfBoundsKill = true;
        game.physics.enable(additionalWeapon);
        haveAdditionalWeapon = true;
    }
}

function throwAdditionalWeapon() {
    if (haveAdditionalWeapon === true) {
        daggerThrowSound.play();
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

function skeletonUprising(player, tombstone) {
    if (lifes.countLiving()) {
        alertSound.play();
        skeleton = new Skeleton(game, tombstone.x, tombstone.y - 20, -player.scale.x, 50);
        game.add.existing(skeleton);
        enemy.add(skeleton);
        tombstone.kill();
    }
}

function setupText(text) {
    game.instructions = game.add.text(320, 100,
        text, { font: 'bold 25px Press Start 2P', fill: '#190707', align: 'center' }
    );
    game.instructions.anchor.setTo(0.5, 0.5);
    game.instructions.fixedToCamera = true;
    game.time.events.add(2000, game.instructions.destroy, game.instructions);
}

function create_level(level) {
    flag.destroy();
    map.destroy();
    layer.destroy();
    causticLayer.destroy();
    coinsCounterImage.destroy();
    player.destroy();
    enemy.destroy();
    coins.destroy();
    daggers.destroy();
    potionsHealth.destroy();
    checkpoints.destroy();
    checkpoints.destroy();
    lifes.destroy();
    water.destroy();
    ladders.destroy();
    player.destroy();

    if (level === 'level1') start.y = 250;
    if (level === 'level2') start.y = 90;

    Background = game.add.sprite(0, 0, level + 'back');
    Background.fixedToCamera = true;
    map = game.add.tilemap(level);
    map.addTilesetImage('tiles');
    map.setCollisionBetween(1, 4);
    map.setCollisionBetween(7, 10);
    map.setCollisionBetween(13, 16);
    map.setCollisionBetween(19, 22);
    map.setCollision([25, 26, 27, 28, 29, 30, 43, 44, 54, 60, 66, 77]);
    map.setTileIndexCallback(18, setCheckpointCoor, game);
    layer = map.createLayer('Tile Layer 1');
    causticLayer = map.createLayer('CausticTileLayer');
    map.setCollisionBetween(31, 33, true, causticLayer);
    layer.resizeWorld();
    flag = new Flag(game, 40, 444.5);
    flag.enableBody = true;
    game.add.existing(flag);

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

    player = new Player(game);
    game.add.existing(player);

    potionsHealth = game.add.group();
    potionsHealth.enableBody = true;
    map.createFromObjects('h_potions', 86, 'potion_health', 0, true, false, potionsHealth);

    tombstones = game.add.group();
    tombstones.enableBody = true;
    map.createFromObjects('tombstones', 88, 'tombstone', 0, true, false, tombstones);

    checkpoints = game.add.group();
    checkpoints.enableBody = true;
    map.createFromObjects('checkpoints', 18, 'tiles', 16, true, false, checkpoints);

    ladders = game.add.group();
    ladders.enableBody = true;
    map.createFromObjects('ladders', 78, 'tiles', 77, true, false, ladders);
    map.createFromObjects('ladders', 72, 'tiles', 71, true, false, ladders);

    water = game.add.group();
    water.enableBody = true;
    map.createFromObjects('water', 55, 'tiles', 54, true, false, water);
    map.createFromObjects('water', 56, 'tiles', 55, true, false, water);
    map.createFromObjects('water', 57, 'tiles', 56, true, false, water);
    map.createFromObjects('water', 58, 'tiles', 57, true, false, water);

    coinsCounterText.fixedToCamera = true;
    coinsCounterImage = game.add.sprite(20, 35, 'coin_counter');
    coinsCounterImage.scale.setTo(0.1, 0.1);
    coinsCounterImage.fixedToCamera = true;

    lifes = game.add.group();
    initLife(countOflifes);
    lifes.fixedToCamera = true;

    enemy = game.add.group();
    createEnemy();

    gameOver = game.add.text(0, 0, "\t\t\tGame over! \nClick to restart", style);
    gameOver.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    gameOver.setTextBounds(0, screenHeight / 2, screenWidth, 50);
    gameOver.visible = false;
    gameOver.fixedToCamera = true;
    restart();
}

function restart() {
    gameMusic.play();
    lifes.removeAll();
    initLife(countOflifes);
    enemy.removeAll();
    createEnemy();
    gameOver.visible = false;
    if (status === 'death') {
        coinsCount = 0;
        player.revive();
    }
    player.x = start.x;
    player.y = start.y;
    player.scale.setTo(1, 1);
    status = 'idle';
    daggers.removeAll();
    if (additionalWeaponIcon) additionalWeaponIcon.kill();
    haveAdditionalWeapon = false
    map.createFromObjects('daggers', 87, 'dagger_on_ground', 0, true, false, daggers);
    coinsCounterText.setText(':' + coinsCount);
    coins.removeAll();
    map.createFromObjects('coins', 85, 'coin', 0, true, false, coins);
    potionsHealth.removeAll();
    map.createFromObjects('h_potions', 86, 'potion_health', 0, true, false, potionsHealth);
    checkpointCoor.x = start.x;
    checkpointCoor.y = start.y;
    checkpoints.children.map(checkpoint => checkpoint.frame = 16);
    if (add_weapon) {
        getAdditionalWeapon(player, game.add.sprite(0, 0, 'dagger_on_ground'));
        add_weapon = false;
    }
    tombstones.removeAll();
    map.createFromObjects('tombstones', 88, 'tombstone', 0, true, false, tombstones);
}