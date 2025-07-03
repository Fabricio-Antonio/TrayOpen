const { app, Tray } = require('electron');

const tray = new Tray();

const contexMenu = Menu.buildFromTemplate([
    { label: 'Item 1', type: 'radio', checked: true },
]);

tray.setContextMenu(contexMenu);
        