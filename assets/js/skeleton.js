const skeleton_scale = 0.7;
Skeleton = function(game, x, y, direction, speed) {
    Phaser.Sprite.call(this, game, x, y, "skeleton");
    this.animations.add('skeleton_walk', Phaser.Animation.generateFrameNames('skeleton_walk', 0, 5), 8, true);
    this.animations.add('skeleton_throw', Phaser.Animation.generateFrameNames('skeleton_throw', 0, 5), 5, true);
    this.scale.setTo(skeleton_scale, skeleton_scale);
    this.anchor.setTo(0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.xSpeed = direction * speed;
    this.startX = x;
    this.body.gravity.y = 250;
    this.skeleton_status = 'idle';
};

Skeleton.prototype = Object.create(Phaser.Sprite.prototype);
Skeleton.prototype.constructor = Skeleton;

Skeleton.prototype.update = function() {
    game.physics.arcade.collide(this, layer, moveSkeleton);
    this.body.velocity.x = this.xSpeed;
    atack(this);
    if (this.skeleton_status === 'idle') this.animations.play('skeleton_walk');
};

function moveSkeleton(Skeleton) {
    if (Skeleton.xSpeed > 0 && Skeleton.x > Skeleton.startX + 100 || Skeleton.xSpeed < 0 && Skeleton.x < Skeleton.startX)
        Skeleton.xSpeed *= -1;
    if (Skeleton.xSpeed > 0) Skeleton.scale.setTo(skeleton_scale, skeleton_scale);
    else if (Skeleton.xSpeed < 0) Skeleton.scale.setTo(-skeleton_scale, skeleton_scale);
}

function atack(Skeleton) {
    if ((player.y > Skeleton.y - 30 && player.y < Skeleton.y + 30 && player.x + 200 > Skeleton.x && player.x - 200 < Skeleton.x && ((Skeleton.scale.x < 0 && player.x < Skeleton.x) || (Skeleton.scale.x > 0 && player.x > Skeleton.x))) || Skeleton.skeleton_status === 'atack') {
        Skeleton.skeleton_status = 'atack';
        Skeleton.animations.play('skeleton_throw');
        Skeleton.body.velocity.x = 0;
        if (Skeleton.animations.currentFrame.name === 'skeleton_throw5') {
            Skeleton.skeleton_status = 'idle';
            Skeleton.body.velocity.x = Skeleton.xSpeed;
        }
    }
}
