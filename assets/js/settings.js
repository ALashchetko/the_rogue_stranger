const Settings = {
    preload: function() {
        game.load.image('back', 'assets/images/back.png');
        game.load.image('a_button', 'assets/images/Settings/a_button.png');
        game.load.image('d_button', 'assets/images/Settings/d_button.png');
        game.load.image('k_button', 'assets/images/Settings/k_button.png');
        game.load.image('esc_button', 'assets/images/Settings/esc_button.png');
        game.load.image('arrows', 'assets/images/Settings/arrows.png');
        game.load.image('space', 'assets/images/Settings/space.png');
    },
    create: function() {
        const background = game.add.sprite(0, 0, 'back1')
        background.scale.setTo(1.2, 1.2);
        const style = {
            font: "bold 55px Algerian",
            fill: 'chocolate',
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        const controls = game.add.text(320, 80, "CONTROLS", style);
        controls.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
        controls.anchor.setTo(0.5, 0.5);
        controller('a_button', 'Atack', 75, 180);
        controller('d_button', 'Shield', 170, 180);
        controller('k_button', 'Suicide', 280, 180);
        controller('esc_button', 'Menu', 380, 180);
        controller('arrows', 'Move', 520, 180);
        controller('space', 'Jump', 320, 300);

        const back = this.add.button(315, 410, 'back', this.menu, this);
        back.anchor.setTo(0.5, 0.5);
        back.scale.setTo(0.2, 0.2);
    },
    menu: function() {
        this.state.start('Menu');
    }
}

function controller(button, message, x, y) {
    const style = {
        font: "bold 14px Press Start 2P",
        fill: 'white',
        boundsAlignH: "center",
        boundsAlignV: "middle"
    };
    const text = game.add.text(x, y - 40, message, style);
    text.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
    text.anchor.setTo(0.5, 0.5);
    const image = game.add.sprite(x, y, button);
    image.scale.setTo(0.5, 0.5);
    image.anchor.setTo(0.5, 0.5);
}
