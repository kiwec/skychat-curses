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
		for(let vid of this.liste) {
			// Vidéo déjà dans la liste
			if(vid.yt_id == yt_id) {
				return;
			}
		}

		let url = 'https://www.youtube.com/watch?v=' + yt_id;
		exec("youtube-dl -f 'best[height=360]' -g '" + url + "'",
			(err, stdout, stderr) => {
				if(err) return;
				this.liste.push({
					id: yt_id,
					url: stdout.split('\n').shift(),
					video_length: yt_length
				});

				if(this.liste.length == 1) {
					this.playNext();
				}
		});
	}

	playNext() {
		clearTimeout(this.to);
		if(this.liste.length == 0) {
			this.video.hide();
			return;
		}

		let vid = this.liste.shift();
		this.video.file = vid.url;
		this.video.show();
		this.to = setTimeout(() => this.playNext(), vid.video_length * 1000);
	}

	stop() {
		clearTimeout(this.to);
	}
}

module.exports = YtPlayer;

