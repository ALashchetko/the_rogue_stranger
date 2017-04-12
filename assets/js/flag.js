let rectangle, heart_text_tmp, heart_tmp, dagger_text_tmp, dagger_tmp,
    next_level_text_tmp, coin_tmp1, coin_tmp2, addLife_button, addWeapon_button,
    nextLevel_button, next_level = false;

const style_tmp = {
    font: "bold 16px Press Start 2P",
    fill: "white"
}

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
    if (player.y === this.y && player.x + 20 > this.x && player.x - 20 < this.x) endOfLevel();
};

function endOfLevel() {
    game.paused = true;
    rectangle = game.add.sprite(320, 240, 'rectangle');
    rectangle.anchor.setTo(0.5, 0.5);

    heart_text_tmp = game.add.text(240, 197, "+1\t\t\t\t50", style_tmp);
    heart_text_tmp.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    heart_text_tmp.anchor.setTo(0.5, 0.5);
    heart_text_tmp.visible = true;

    heart_tmp = game.add.sprite(230, 195, 'heart');
    heart_tmp.anchor.setTo(0.5, 0.5);
    heart_tmp.scale.setTo(0.2, 0.2);

    dagger_text_tmp = game.add.text(272, 237, "25", style_tmp);
    dagger_text_tmp.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    dagger_text_tmp.visible = true;

    dagger_tmp = game.add.sprite(230, 245, 'dagger_on_ground');
    dagger_tmp.anchor.setTo(0.5, 0.5);
    dagger_tmp.scale.setTo(1.5, 1.5);

    coin_tmp1 = game.add.sprite(320, 195, 'coin_counter');
    coin_tmp1.scale.setTo(0.1, 0.1);
    coin_tmp1.anchor.setTo(0.5, 0.5);

    coin_tmp2 = game.add.sprite(320, 245, 'coin_counter');
    coin_tmp2.scale.setTo(0.1, 0.1);
    coin_tmp2.anchor.setTo(0.5, 0.5);

    next_level_text_tmp = game.add.text(200, 285, "Next level", style_tmp);
    next_level_text_tmp.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    next_level_text_tmp.visible = true;

    addLife_button = game.add.button(400, 190, 'check_mark', () => {
        if (coinsCount >= 50 && countOflifes < 5) {
            coinsCount -= 50;
            countOflifes++;
            coinsCounterText.setText(':' + coinsCount);
            lifes.removeAll();
            initLife(countOflifes);
        }
    }, this);
    addLife_button.anchor.setTo(0.5, 0.5);
    addLife_button.scale.setTo(0.2, 0.2);

    addWeapon_button = game.add.button(400, 240, 'check_mark', () => {
        if (coinsCount >= 25 && add_weapon != true) {
            coinsCount -= 25;
            coinsCounterText.setText(':' + coinsCount);
            add_weapon = true;
            additionalWeaponIcon = game.add.sprite(15, screenHeight - 50, 'dagger_on_ground');
            additionalWeaponIcon.scale.setTo(1.5, 1.5);
            additionalWeaponIcon.fixedToCamera = true;
        }
    }, this);
    addWeapon_button.anchor.setTo(0.5, 0.5);
    addWeapon_button.scale.setTo(0.2, 0.2);

    nextLevel_button = game.add.button(400, 290, 'check_mark', () => {
        next_level = true;
        unpause();
    }, this);
    nextLevel_button.anchor.setTo(0.5, 0.5);
    nextLevel_button.scale.setTo(0.2, 0.2);

    game.input.onDown.add(unpause, self);

}


function unpause() {
    if (game.pause || next_level) {
        rectangle.destroy();
        addLife_button.destroy();
        addWeapon_button.destroy();
        nextLevel_button.destroy();
        coin_tmp1.destroy();
        coin_tmp2.destroy();
        heart_tmp.destroy();
        dagger_tmp.destroy();
        heart_text_tmp.visible = false;
        dagger_text_tmp.visible = false;
        next_level_text_tmp.visible = false;
        restart();
        game.paused = false;
        next_level = false;
    }
}
