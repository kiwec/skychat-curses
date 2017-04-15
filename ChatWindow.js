const blessed = require('blessed');

/**
 * Fenêtre de chat
 * Comprend les messages mais aussi la liste d'utilisateurs
 */
class ChatWindow {
	constructor(screen, skychat) {
		this.screen = screen;
		this.skyChat = skychat;

		this._initWindow();
	}

	/**
	 * Initialise la fenêtre
	 */
	_initWindow() {
		this.chat = blessed.log({
			parent: this.screen,
			top: 0,
			left: 0,
			bottom: 1,
			right: 0,
			tags: true,
			keys: true,
			mouse: true,
			scrollback: 256,
			scrollbar: {
				ch: ' ',
				track: {
					bg: 'gray'
				},
				style: {
					inverse: true
				}
			}
		});

		this.zoneTexte = blessed.textbox({
			parent: this.screen,
			inputOnFocus: true,
			mouse: true,
			height: 1,
			bottom: 0,
			left: 0,
			right: 0,
			style: {
				focus: {
					bg: 'gray'
				},
				hover: {
					bg: 'gray'
				}
			}
		});

		this.zoneTexte.key('enter', () => {
			this.skyChat.send(this.zoneTexte.value);
			this.zoneTexte.clearValue();
		});

		this.screen.render();
	}

	/**
	 * Ajoute un message à la liste de messages
	 */
	printMessage(msg) {
		let txt = this.skyChat.messageHandler.clean(msg.message);
		this.chat.log('{' + msg.color + '-fg}' + msg.pseudo + '{/}: '
			+ blessed.escape(txt));
		this.screen.render();
	}

	/**
	 * Met à jour la liste d'utilisateurs
	 */
	updateUserList() {
		// TODO
	}

	/**
	 * Met à jour le titre de la fenêtre
	 */
	updateTitle(newTitle) {
		this.screen.title = newTitle;
	}
}

module.exports = ChatWindow;

