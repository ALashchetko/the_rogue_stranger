var game;
game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game');
game.state.add('Menu', Menu);
game.state.add('Game', Game);
game.state.add('Settings', Settings);
game.state.start('Menu');

// function preload() {
//     game.load.image('sky', 'assets/sky.png');
//     game.load.image('star', 'assets/star.png');
//     game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
//     game.load.spritesheet('tiles', 'assets/tiles.png', 16, 16);
//     game.load.tilemap('level', 'assets/level.json', null, Phaser.Tilemap.TILED_JSON);
// }

// function create() {
//     // stars = game.add.group();
//     // stars.enableBody = true;
//     // for (var i = 0; i < 12; i++)
//     // {
//     //     var star = stars.create(i * 70, 0, 'star');
//     //     star.body.gravity.y = 300;
//     //     star.body.bounce.y = 0.7 + Math.random() * 0.2;
//     // }
//     // scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
// }

// function update() {
//     // game.physics.arcade.collide(stars, platforms);
//     // game.physics.arcade.overlap(player, stars, collectStar, null, this);
// }

// function collectStar (player, star) {
//     // Removes the star from the screen
//     star.kill();
//     //  Add and update the score
//     score += 10;
//     scoreText.text = 'Score: ' + score;
// }
