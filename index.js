const blessed = require('blessed');
const SkyChat = require('node-skychat').init(require('./Config'));

SkyChat.on('log', () => {
	let screen = blessed.screen({
		smartCSR: true
	});

	screen.title = 'test';
	screen.key(['escape', 'q', 'C-c'], (ch, key) => {
		return process.exit(0);
	});

	screen.render();
});
