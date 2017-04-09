var scale = 0.7;
Skeleton = function(game, x, y, direction, speed) {
    Phaser.Sprite.call(this, game, x, y, "skeleton");
    this.animations.add('skeleton_walk', Phaser.Animation.generateFrameNames('skeleton_walk', 0, 5), 8, true);
    this.animations.add('skeleton_throw', Phaser.Animation.generateFrameNames('skeleton_throw', 0, 5), 8, true);
    this.scale.setTo(scale, scale);
    this.anchor.setTo(0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.xSpeed = direction * speed;
    this.startx = x;
    this.body.gravity.y = 250;
};

Skeleton.prototype = Object.create(Phaser.Sprite.prototype);
Skeleton.prototype.constructor = Skeleton;

Skeleton.prototype.update = function() {
    game.physics.arcade.collide(this, layer, moveSkeleton);
    this.body.velocity.x = this.xSpeed;
    this.animations.play('skeleton_walk');
};

function moveSkeleton(Skeleton) {
    if (Skeleton.xSpeed > 0 && Skeleton.x > (Skeleton.startx + 100) || Skeleton.xSpeed < 0 && Skeleton.x < (Skeleton.startx))
        Skeleton.xSpeed *= -1;
    if (Skeleton.xSpeed > 0) Skeleton.scale.setTo(scale, scale);
    else if (Skeleton.xSpeed < 0) Skeleton.scale.setTo(-scale, scale);
}
