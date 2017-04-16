const blessed = require('blessed');
const exec = require('child_process').exec;


/**
 * TODO
 * - Gérer erreurs, mauvaises URL, etc
 * - Ouverture/fermeture du player
 * - Reprise en cours de lecture
 * - mplayer en verbose -> fix ?
 */

class YtPlayer {
	constructor(screen, chat) {
		this.screen = screen;
		this.chat = chat;

		this._initPlayer();
	}

	_initPlayer() {
	
	}

	playYt(url) {
		exec("youtube-dl -f 'best[height=360]' -g '" + url + "'", (err, stdout, stderr) => {
			if(err) return;
			this.playUrl(stdout.split('\n').shift());
		});
	}

	playUrl(url) {
		this.video = blessed.video({
			parent: this.screen,
			top: 0,
			left: 0,
			width: this.chat.getWidth() - 1,
			height: '40%',
			file: url
		});

		this.screen.render();
	}
}

module.exports = YtPlayer;

