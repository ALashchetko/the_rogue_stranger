const Settings = {
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
        controller('a_button', 'Atack\n(hold)', 95, 180);
        controller('d_button', 'Shield\n(hold)', 190, 180);
        controller('k_button', 'Suicide', 300, 180);
        controller('esc_button', 'Menu', 390, 180);
        controller('c_button', 'Additional \n\t\tWeapon', 510, 180);
        controller('arrows', 'Move', 440, 300);
        controller('space', 'Jump', 200, 300);

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
