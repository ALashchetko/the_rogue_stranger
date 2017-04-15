let status = 'idle';
let start = {
    x: 50,
    y: 250
};
const Player = function(game) {
    Phaser.Sprite.call(this, game, 0, 0, "knight");
    this.animations.add('knight_walk', Phaser.Animation.generateFrameNames('knight_walk', 0, 7), 8, true);
    this.animations.add('knight_idle', Phaser.Animation.generateFrameNames('knight_idle', 0, 3), 4, true);
    this.animations.add('knight_slash', Phaser.Animation.generateFrameNames('knight_slash', 0, 9), 20, true);
    this.animations.add('knight_block', Phaser.Animation.generateFrameNames('knight_block', 0, 6), 20, true);
    this.animations.add('knight_hit', Phaser.Animation.generateFrameNames('knight_death', 0, 2), 10, true);
    this.animations.add('knight_death', Phaser.Animation.generateFrameNames('knight_death', 0, 8), 6, true);
    game.physics.enable(this);
    this.body.gravity.y = 300;
    this.body.bounce.y = 0.1;
    this.anchor.setTo(0.5, 0.5);
    this.x = start.x;
    this.y = start.y;
    game.camera.follow(this, Phaser.Camera.FOLLOW_PLATFORMER);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    game.physics.arcade.collide(this, causticLayer, getDamageFromTile);
    game.physics.arcade.collide(this, layer);
    game.physics.arcade.overlap(this, coins, getCoin, null, this);
    game.physics.arcade.overlap(this, potionsHealth, addLife, null, this);
    game.physics.arcade.overlap(this, checkpoints, setCheckpointCoor, null, this);
    game.physics.arcade.overlap(this, daggers, getAdditionalWeapon, null, this);
    game.physics.arcade.overlap(this, water, getDamageFromTile, null, this);
    if (!game.physics.arcade.overlap(this, ladders, onLadder, null, this))
        player.body.gravity.y = 300;
    this.body.velocity.x = 0;
    getDamageFromTouch();
    death();
    if (cursors.left.isDown && status === 'idle' && this.x > 25) {
        this.body.velocity.x = -100;
        this.scale.setTo(-1, 1);
        this.animations.play('knight_walk');
    } else if (cursors.right.isDown && status === 'idle') {
        this.body.velocity.x = 100;
        this.scale.setTo(1, 1);
        this.animations.play('knight_walk');
    } else if (actionKeys.slash.isDown && status === 'idle') {
        this.animations.play('knight_slash');
        if (this.animations.currentFrame.name === 'knight_slash7')
            getSlash();
    } else if (actionKeys.block.isDown && status === 'idle') {
        this.animations.play('knight_block');
        if (this.animations.currentFrame.name === 'knight_block6')
            this.animations.paused = true;
    } else if (actionKeys.additionalWeapon.isDown && status === 'idle') {
        throwAdditionalWeapon();
    } else if (actionKeys.death.isDown || status === 'hit') {
        status = 'hit';
        this.animations.play('knight_hit');
        if (this.animations.currentFrame.name === 'knight_death2')
            getDamage();
    } else if (status === 'idle') {
        this.animations.play('knight_idle');
    }
    if (actionKeys.jumpKey.isDown && this.body.onFloor() && status === 'idle') {
        this.body.velocity.y = -175;
        jumpSound.play();
    }
    if (this.x < 25) this.x = 25;
};

function onLadder(player, ladder) {
    if (cursors.up.isDown) {
        player.body.velocity.y = -100;
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 100;
    } else {
        player.body.velocity.y = 0;
        player.body.gravity.y = 0;
    }
}

function getDamageFromTile() {
    player.x = checkpointCoor.x;
    player.y = checkpointCoor.y;
    status = 'hit';
}

function getDamage() {
    getDamageSound.play();
    let life = lifes.getChildAt(lifes.countLiving() - 1);
    if (!lifes.countLiving()) death();
    else {
        life.kill();
        status = 'idle';
    }
}

function death() {
    if (!lifes.countLiving()) {
        gameMusic.stop();
        status = 'death';
        player.animations.play('knight_death');
        if (player.animations.currentFrame.name === 'knight_death8') {
            if (!gameOverSound.isPlaying)
                gameOverSound.play();
            player.kill();
            gameOver.visible = true;
            game.input.onTap.addOnce(restart, this);
        }
    }
}

function getDamageFromTouch() {
    const x_range = 10,
        y_range = 15,
        hitSpeed = 500;
    const touch = (i, scale) => {
        return scale ?
            player.world.x < enemy.children[i].world.x &&
            player.world.x + x_range >= enemy.children[i].world.x &&
            player.world.y + y_range >= enemy.children[i].world.y &&
            player.world.y - (y_range + 5) <= enemy.children[i].world.y :
            player.world.x > enemy.children[i].world.x &&
            player.world.x - x_range <= enemy.children[i].world.x &&
            player.world.y + y_range >= enemy.children[i].world.y &&
            player.world.y - (y_range + 5) <= enemy.children[i].world.y;
    };
    for (let i = 0; i < enemy.countLiving(); i++) {
        if ((player.scale.x > 0 && touch(i, true)) || (player.scale.x < 0 && touch(i, false))) {
            if (player.animations.currentFrame.name != 'knight_block6') status = 'hit';
            else shieldSound.play();
            if (player.scale.x > 0) enemy.children[i].scale.x < 0 ? player.body.velocity.x = -hitSpeed * 2.5 : player.body.velocity.x = -hitSpeed;
            else enemy.children[i].scale.x < 0 ? player.body.velocity.x = hitSpeed : player.body.velocity.x = hitSpeed * 2.5;
        }
    }
}

function getSlash() {
    slashWithoutTargetSound.play();
    const x_range = 40,
        y_range = 15;
    const hit = (i, scale) => {
        return scale ?
            player.world.x < enemy.children[i].world.x &&
            player.world.x + x_range >= enemy.children[i].world.x &&
            player.world.y + y_range > enemy.children[i].world.y &&
            player.world.y - (y_range + 5) < enemy.children[i].world.y :
            player.world.x > enemy.children[i].world.x &&
            player.world.x - x_range <= enemy.children[i].world.x &&
            player.world.y + y_range > enemy.children[i].world.y &&
            player.world.y - (y_range + 5) < enemy.children[i].world.y;
    };
    for (let i = 0; i < enemy.countLiving(); i++) {
        if ((player.scale.x > 0 && hit(i, true)) || (player.scale.x < 0 && hit(i, false))) {
            slashOnTargetSound.play();
            enemy.getChildAt(i).destroy();
        }
    }
}
