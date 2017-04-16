var game;
game = new Phaser.Game(640, 480, Phaser.CANVAS, 'game');
game.state.add('Menu', Menu);
game.state.add('Game', Game);
game.state.add('Settings', Settings);
game.state.add('Intro', Intro);
game.state.start('Menu');