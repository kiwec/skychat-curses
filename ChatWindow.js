const blessed = require('blessed');
let config = require('./Config');

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
			bottom: 2,
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

		this.separateur = blessed.line({
			parent: this.screen,
			bottom: 1,
			height: 1,
			left: 0,
			right: 0,
			orientation: 'horizontal',
			type: 'line'
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
			if(this.zoneTexte.value == '/skip') {
				this.skyChat.fire('curses_skip');
				this.zoneTexte.clearValue();
				this.zoneTexte.focus();
				this.screen.render();
				return;
			}

			if(this.zoneTexte.value.indexOf('/player ') == 0) {
				if(this.zoneTexte.value == '/player off') {
					config.player = 'disabled';
					config.save();
					this.print('Player desactive.');
					this.skyChat.fire('curses_skip');
				} else if(this.zoneTexte.value == '/player on') {
					config.player = 'enabled';
					config.save();
					this.print('Player active.');
				}

				this.zoneTexte.clearValue();
				this.zoneTexte.focus();
				this.screen.render();
				return;
			}

			this.skyChat.send(this.zoneTexte.value);
			this.skyChat.sock.emit('mouse_position', {
				x: Math.random(),
				y: Math.random()
			});
			this.skyChat.sock.emit('typing', { currently_typing: true });
			setTimeout(() => {
				this.skyChat.sock.emit(
					'typing',
					{ currently_typing: false }
				);
			}, 200)
			this.zoneTexte.clearValue();
			this.zoneTexte.focus();
			this.screen.render();
		});

		this.userList = blessed.list({
			parent: this.screen,
			items: [],
			interactive: false,
			left: this.screen.width - 19,
			right: 0,
			top: 0,
			bottom: 2,
			tags: true
		});

		if(this.screen.width <= 90) {
			this.userList.hide();
		}

		this.zoneTexte.focus();
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

	clean(txt) {
		txt = this.skyChat.messageHandler.clean(txt);
		txt = blessed.escape(txt);
		return txt;
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
		let citation = msg.message.match(/<bl.*?>(.*?)<\/b.*?e>/);
		if(citation) {
			let user_cite = citation[0].match(/.*?>Par <b>(.*?)<\/b>/);
			citation = this.clean(citation[0].replace(/.*?r>/, ''));
			msg.message = '-> ' + this.clean(msg.message.replace(/.*ote>/, ''));

			let txt = `{${msg.color}-fg}${msg.pseudo}{/}:`;
			txt += ` « ${citation} »`;
			txt += ` - {ul}${user_cite[1]}{/ul}`;
			this.print(txt);
			if(msg.message !== '-> ') this.printMessage(msg);
		} else {
			let txt = this.clean(msg.message);
			let fmt_txt = `{${msg.color}-fg}${msg.pseudo}{/}: ${txt}`;
			if(msg.message_type == 'user_mp') {
				fmt_txt = '{green-fg}[MP] ' + fmt_txt;
			}
			this.print(fmt_txt);
		}
	}

	/**
	 * Met à jour la liste d'utilisateurs
	 */
	updateUserList(connected_list) {
		this.userList.clearItems();
		
		let users = connected_list.sort((a, b) => {
			return a.last_activity - b.last_activity;
		});

		for(let user of users) {
			let str = `{${user.color}-fg}${user.pseudo}{/}`;
			if(user.typing) {
				str = '*' + str;
			}
			this.userList.addItem(str);
		}
		this.screen.render();
	}

	/**
	 * Met à jour le titre de la fenêtre
	 */
	updateTitle(newTitle) {
		this.screen.title = newTitle;
	}

	getWidth() { return this.chat.width; }
}

module.exports = ChatWindow;

