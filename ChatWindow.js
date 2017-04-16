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
			right: this.screen.width > 90 ? 20 : 0,
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
				bg: 'gray',
				hover: {
					bg: 'lightgray'
				}
			}
		});

		this.zoneTexte.key('enter', () => {
			this.skyChat.send(this.zoneTexte.value);
			this.zoneTexte.clearValue();
			this.screen.render();
		});

		this.userList = blessed.list({
			parent: this.screen,
			items: [],
			interactive: false,
			left: this.screen.width - 19,
			right: 0,
			top: 0,
			bottom: 1,
			tags: true,
			visible: this.screen.width > 90
		});

		this.screen.render();

		this.screen.on('resize', () => {
			if(this.screen.width > 90) {
				this.userList.left = this.screen.width - 19;
				this.userList.show();
				this.chat.right = 20;
			} else {
				this.userList.hide();
				this.chat.right = 0;
			}
			this.screen.render();
		});
	}

	/**
	 * Ajoute le texte à la liste de messages
	 */
	print(txt) {
		this.chat.log(txt);
		this.screen.render();
	}

	/**
	 * Ajoute un message à la liste de messages
	 */
	printMessage(msg) {
		let txt = this.skyChat.messageHandler.clean(msg.message);
		this.print('{' + msg.color + '-fg}' + msg.pseudo + '{/}: '
			+ blessed.escape(txt));
	}

	/**
	 * Met à jour la liste d'utilisateurs
	 */
	updateUserList(connected_list) {
		this.userList.clearItems();
		for(let user of connected_list.list) {
			this.userList.addItem('{' + user.color + '-fg}'
				+ user.pseudo + '{/}');
		}
		this.screen.render();
	}

	/**
	 * Met à jour le titre de la fenêtre
	 */
	updateTitle(newTitle) {
		this.screen.title = newTitle;
	}
}

module.exports = ChatWindow;

