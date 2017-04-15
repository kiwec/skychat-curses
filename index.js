const blessed = require('blessed');
const ChatWindow = require('./ChatWindow');
const FormConnexion = require('./FormConnexion');
const SkyChat = require('node-redsky');

// Initialisation du screen
let screen = blessed.screen({
	autoPadding: true,
	smartCSR: true,
	fullUnicode: true,
	title: 'redsky-curses'
});

// Touches de sortie
screen.key(['escape', 'q', 'C-c'], (ch, key) => {
	return process.exit(0);
});

// Création et affichage du formulaire de connexion
let connexion = new FormConnexion(screen, init_skychat);
screen.render();

// Events du skychat
function init_skychat(config) {
	SkyChat.init({
		username: config.username,
		password: config.password
	});

	SkyChat.on('log_once', (log) => {
		if(log.error) {
			screen.destroy();
			console.log('Erreur de connection : ' + log.error);
			process.exit(1);
		}

		connexion.destroy();
		let chat = new ChatWindow(screen, SkyChat);
		SkyChat.on('message', (msg) => chat.printMessage(msg));
		SkyChat.on('newmessage', (msg) => chat.printMessage(msg));
	});
}
