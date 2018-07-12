const blessed = require('blessed');
const { spawn } = require('child_process');
let config = require('./Config');

class YtPlayer {
	constructor(screen, chat, player) {
		this.chat = chat;
		this.player = player;
		this.screen = screen;
		this.mpv = null;

		this.playing = blessed.text({
			parent: this.screen,
			top: 0,
			left: 0,
			width: this.chat.getWidth() - 1,
			height: 1,
			orientation: 'horizontal'
		});

		this.progressbar = blessed.progressbar({
			parent: this.playing,
			top: 0,
			left: 0,
			width: this.chat.getWidth() - 1,
			height: 1,
			pch: '.',
			orientation: 'horizontal',
			keys: false,
			mouse: false
		});

		this.line = blessed.line({
			parent: this.screen,
			top: 1,
			left: 0,
			width: this.chat.getWidth() - 1,
			height: 1,
			orientation: 'horizontal',
			keys: false,
			mouse: false
		});
	}

	next() {
		this.stop();

		if(this.player.id) {
			let url = 'https://youtu.be/' + this.player.id;
			let params = ['--no-video', url, '--start-time=' + this.player.position];
			this.mpv = spawn('cvlc', params);
			this.mpv.on('error', err => {
				this.chat.print('{red-fg}Erreur de lecture : ' + err);
			});

			let width = ('♫ ' + this.player.title).length;
			this.progressbar.left = width + 1;
			this.progressbar.width = this.chat.getWidth() - width - 2;
			this.progressbar.show();
			this.playing.setText('♫ ' + this.player.title);
			this.playing.show();
			this.line.show();
			this.update();
		}
	}

	/**
	 * Arrête la lecture
	 */
	stop() {
		if(this.mpv) {
			this.mpv.kill('SIGTERM');
			this.mpv = null;
		}

		this.progressbar.reset();
		this.progressbar.hide();
		this.playing.hide();
		this.line.hide();
		this.screen.render();
	}

	update() {
		this.progressbar.setProgress(this.player.position / this.player.duration * 100);
		this.player.position++;
		this.screen.render();
	}
}

module.exports = YtPlayer;
