const slime_scale = 0.5;
Slime = function(game, x, y, direction, speed) {
    Phaser.Sprite.call(this, game, x, y, "slime");
    this.animations.add('slime_jump', Phaser.Animation.generateFrameNames('slime_jump', 0, 8), 12, true);
    this.animations.add('slime_idle', Phaser.Animation.generateFrameNames('slime_idle', 0, 5), 5, true);
    this.scale.setTo(slime_scale, slime_scale);
    this.anchor.setTo(0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.gravity.y = 250;
    this.slime_status = 'idle';
    this.xSpeed = direction * speed;
    this.startX = x;
    this.appear = 0;
};

Slime.prototype = Object.create(Phaser.Sprite.prototype);
Slime.prototype.constructor = Slime;

Slime.prototype.update = function() {
    game.physics.arcade.collide(this, layer);
    moveSlime(this);
    jump(this);

    if (this.slime_status === 'jump') {
        this.animations.play('slime_jump');
        if (this.animations.currentFrame.name === 'slime_jump8') {
            this.slime_status = 'idle';
        }
    }
    if (this.slime_status === 'idle') this.animations.play('slime_idle');
};

function moveSlime(slime) {
    if ((slime.body.onFloor() && slime.xSpeed > 0 && slime.x > (slime.startX + 100)) || (slime.body.onFloor() && slime.xSpeed < 0 && slime.x < slime.startX))
        slime.xSpeed *= -1;
    if (slime.xSpeed > 0) slime.scale.setTo(-slime_scale, slime_scale);
    else if (slime.xSpeed < 0) slime.scale.setTo(slime_scale, slime_scale);
}

function jump(slime) {
    if (slime.body.onFloor()) {
        slime.body.velocity.x = 0;
        slime.slime_status = 'jump';
        setTimeout(() => slime.body.velocity = {
            x: slime.xSpeed,
            y: -100
        }, 500);
    }
}
