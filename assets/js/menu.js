let load_complete = false;
let menuMusic, musicOn = false;
const Menu = {
    create: function() {
        const background = game.add.sprite(0, 0, 'back1')
        background.scale.setTo(1.2, 1.2);
        const style = {
            font: "bold 55px Algerian",
            fill: 'chocolate',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        const menu_text = game.add.text(320, 80, "THE HISTORY BEGIN", style);
        menu_text.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
        menu_text.anchor.setTo(0.5, 0.5);
        menu_text.visible = false;
        if (load_complete) menu_text.visible = true;
        const startButton = this.add.button(320, 265, 'start', this.startGame, this);
        const settings = this.add.button(315, 340, 'settings', this.settings, this);
        startButton.anchor.setTo(0.5, 0.5);
        settings.anchor.setTo(0.5, 0.5);
        startButton.scale.setTo(0.2, 0.2);
        settings.scale.setTo(0.2, 0.2);
        menuMusic = game.add.audio('menu_music');
        menuMusic.loop = true;
        menuMusic.play();

        if (!load_complete) {
            game.load.onLoadStart.add(loadMenuStart, this);
            game.load.onFileComplete.add(fileMenuComplete, this);
            game.load.onLoadComplete.add(loadMenuComplete, this);
            menuLoad();
        }
    },
    startGame: function() {
        menuMusic.stop();
        this.state.start('Game');
    },
    settings: function() {
        menuMusic.stop();
        this.state.start('Settings');
    }
};

let text;

function menuLoad() {
    game.load.image('start', 'assets/images/new_game.png');
    game.load.image('settings', 'assets/images/rules.png');
    game.load.image('back1', 'assets/images/back1.jpg');
    game.load.image('back', 'assets/images/back.png');
    game.load.image('a_button', 'assets/images/Settings/a_button.png');
    game.load.image('d_button', 'assets/images/Settings/d_button.png');
    game.load.image('k_button', 'assets/images/Settings/k_button.png');
    game.load.image('esc_button', 'assets/images/Settings/esc_button.png');
    game.load.image('c_button', 'assets/images/Settings/c_button.png');
    game.load.image('arrows', 'assets/images/Settings/arrows.png');
    game.load.image('space', 'assets/images/Settings/space.png');
    game.load.image('heart', 'assets/images/heart.png');
    game.load.image('potion_health', 'assets/images/potion_health.png');
    game.load.image('coin', 'assets/images/coin.png');
    game.load.image('dagger_active', 'assets/images/dagger_active.png');
    game.load.image('dagger_on_ground', 'assets/images/dagger_on_ground.png');
    game.load.image('coin_counter', 'assets/images/coin_counter.png');
    game.load.image('skeleton_bone', 'assets/images/skeleton/skeleton_bone.png');
    game.load.image('rectangle', 'assets/images/rectangle.jpg');
    game.load.image('level1back', 'assets/images/backg_lvl_1.png');
    game.load.image('level2back', 'assets/images/level2back.png');
    game.load.image('check_mark', 'assets/images/flag/check_mark.png');

    game.load.spritesheet('tiles', 'assets/images/tiles.png', 16, 16);

    game.load.tilemap('level1', 'assets/images/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level2', 'assets/images/level2.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.atlas('knight', 'assets/images/knight/knight_atlas.png', 'assets/images/knight/knight_atlas.json');
    game.load.atlas('skeleton', 'assets/images/skeleton/skeleton_atlas.png', 'assets/images/skeleton/skeleton_atlas.json');
    game.load.atlas('slime', 'assets/images/slime/slime_atlas.png', 'assets/images/slime/slime_atlas.json');
    game.load.atlas('flag', 'assets/images/flag/flag_atlas.png', 'assets/images/flag/flag_atlas.json');
    game.load.audio('get_damage_sound', 'assets/sounds/get_damage.wav');
    game.load.audio('slime_kill_sound', 'assets/sounds/slime_kill.mp3');
    game.load.audio('skeleton_kill_sound', 'assets/sounds/skeleton_kill.mp3');
    game.load.audio('slash_on_target_sound', 'assets/sounds/slash_on_target_2.mp3');
    game.load.audio('slash_without_target_sound', 'assets/sounds/slash_without_target.mp3');
    game.load.audio('jump_sound', 'assets/sounds/jump.wav');
    game.load.audio('game_over_sound', 'assets/sounds/game_over.mp3');
    game.load.audio('coin_pick_up_sound', 'assets/sounds/coin_pick_up.wav');
    game.load.audio('drink_potion_sound', 'assets/sounds/drink_potion.wav');
    game.load.audio('shield_sound', 'assets/sounds/shield.wav');
    game.load.audio('dagger_throw_sound', 'assets/sounds/dagger_throw.wav');
    game.load.audio('dagger_pick_up_sound', 'assets/sounds/dagger_pick_up.wav');
    game.load.audio('checkpoint_sound', 'assets/sounds/checkpoint.wav');
    game.load.audio('game_music', 'assets/sounds/music/game.ogg');
    game.load.audio('menu_music', 'assets/sounds/music/menu.ogg');
    game.load.start();
}

function loadMenuStart() {
    main_loading = game.add.text(320, 240, 'Loading...', {
        font: "16px Press Start 2P",
        fill: '#ffffff'
    });
    main_loading.anchor.setTo(0.5, 0.5);
}

function fileMenuComplete(progress, cacheKey, success, totalLoaded) {
    main_loading.setText("Loading: " + progress + "%");
}

function loadMenuComplete() {
    load_complete = true;
    game.state.start('Menu');
}