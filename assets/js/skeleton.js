var curx;
Skeleton = function(game, x, y, direction, speed) {
    Phaser.Atlas.call(this, game, x, y, "skeleton");
    this.anchor.setTo(0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.xSpeed = direction * speed;
    curx = x;
};

Skeleton.prototype = Object.create(Phaser.Sprite.prototype);
Skeleton.prototype.constructor = Skeleton;

Skeleton.prototype.update = function() {
    game.physics.arcade.collide(this, platformgroup, moveSkeleton);
    this.body.velocity.x = this.xSpeed;
};

function moveSkeleton(Skeleton, platform) {
    if (Skeleton.x > (curx + 300) || Skeleton.x < (curx - 300)) {
        Skeleton.xSpeed *= -1;
    }
}
