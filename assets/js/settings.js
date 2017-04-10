const style = {
    font: "bold 14px Press Start 2P",
    fill: 'white',
    boundsAlignH: "center",
    boundsAlignV: "middle"
};
const Settings = {
    preload: function () {
        game.load.image('back','assets/images/back.png');
        game.load.image('a_button','assets/images/Settings/a_button.png');
        game.load.image('d_button','assets/images/Settings/d_button.png');
        game.load.image('k_button','assets/images/Settings/k_button.png');
        game.load.image('esc_button','assets/images/Settings/esc_button.png');
        game.load.image('arrows','assets/images/Settings/arrows.png');
        game.load.image('space','assets/images/Settings/space.png');
    },
    create: function () {
        const Background = this.add.graphics(0, 0);
        Background.beginFill(0x53BECE, 1);
        Background.drawRect(0, 0, 800, 640);
        Background.endFill();

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
    menu: function () {
        this.state.start('Menu');
    }
}

function controller(button, message, x, y) {
    const text = game.add.text(x, y - 40, message, style);
    text.setShadow(1, 1, 'rgba(0,0,0,0.5)', 2);
    text.anchor.setTo(0.5, 0.5);
    const image = game.add.sprite(x, y, button);
    image.scale.setTo(0.5, 0.5);
    image.anchor.setTo(0.5, 0.5);
}
