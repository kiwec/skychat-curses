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
		this.liste = [];
		this.to = -1;

		this._initPlayer();
	}

	_initPlayer() {
		this.video = blessed.video({
			parent: this.screen,
			top: 0,
			left: 0,
			width: this.chat.getWidth() - 1,
			height: '50%',
			hidden: true,
		});
	}
	
	addYt(yt_id, yt_length) {
		let url = 'https://www.youtube.com/watch?v=' + yt_id;

		for(let vid of this.liste) {
			// Vidéo déjà dans la liste
			if(vid.url == url) {
				return;
			}
		}

		this.liste.push({
			url: url,
			video_length: yt_length
		});

		if(this.liste.length == 1) {
			this.playNext();
		}
	}

	playNext() {
		if(this.liste.length == 0) {
			this.video.hide();
			return;
		}

		let vid = this.liste.shift();
		exec("youtube-dl -f 'best[height=360]' -g '" + vid.url
			+ "'", (err, stdout, stderr) => {
			if(err) return;
			this.video.file = stdout.split('\n').shift();
			this.video.show();
			this.screen.render();
			this.to = setTimeout(
				() => this.playNext(),
				vid.video_length * 1000
			);
		});
	}

	stop() {
		clearTimeout(this.to);
		this.playNext();
	}
}

module.exports = YtPlayer;

