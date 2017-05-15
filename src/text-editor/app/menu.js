const { Menu } = require('electron');

const template = [
    {
        label: 'Super Awesome',
        submenu: [{
            label: 'Mega Great',
            click() { console.log('YOU CLICKED ME!!!!') },
            accelerator: 'CommandOrControl+L'
        }]
    }
];

if (process.platform === 'darwin') {
    template.unshift({
        label: 'No one will see me'
    });
}

const applicationMenu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(applicationMenu);

