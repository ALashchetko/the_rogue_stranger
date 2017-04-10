const scale = 0.7;
Slime = function(game, x, y, direction, speed) {
    Phaser.Sprite.call(this, game, x, y, "slime");
    this.animations.add('slime_jump', Phaser.Animation.generateFrameNames('slime_jump', 0, 5), 8, true);
    this.animations.add('slime_idle', Phaser.Animation.generateFrameNames('slime_idle', 0, 5), 8, true);
    this.scale.setTo(scale, scale);
    this.anchor.setTo(0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.xSpeed = direction * speed;
    this.startx = x;
    this.body.gravity.y = 250;
};

Slime.prototype = Object.create(Phaser.Sprite.prototype);
Slime.prototype.constructor = Slime;

Slime.prototype.update = function() {
    // game.physics.arcade.collide(this, layer, moveslime);
    game.physics.arcade.collide(this, layer);
    // this.body.velocity.x = this.xSpeed;
    this.animations.play('slime_idle');
};

// function moveslime(slime) {
//     if (slime.xSpeed > 0 && slime.x > (slime.startx + 100) || slime.xSpeed < 0 && slime.x < (slime.startx))
//         slime.xSpeed *= -1;
//     if (slime.xSpeed > 0) slime.scale.setTo(scale, scale);
//     else if (slime.xSpeed < 0) slime.scale.setTo(-scale, scale);
// }
