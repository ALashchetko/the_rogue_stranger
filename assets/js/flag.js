Flag = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, "flag");
    this.scale.setTo(0.3, 0.3);
    this.anchor.setTo(0.5, 0.5);
    this.animations.add('flag_idle', Phaser.Animation.generateFrameNames('flag_idle', 0, 5), 5, true);
};

Flag.prototype = Object.create(Phaser.Sprite.prototype);
Flag.prototype.constructor = Flag;
Flag.prototype.update = function() {
    game.physics.arcade.collide(this, layer);
    this.animations.play('flag_idle');
    if (player.y === this.y && player.x + 20 > this.x && player.x - 20 < this.x) restart();
};
