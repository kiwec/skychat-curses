const blessed = require('blessed');
const exec = require('child_process').exec;

class YtPlayer {
	constructor(screen, chat) {
		this.screen = screen;
		this.chat = chat;
		this.liste = [];
		this.to = -1;
	}

	/**
	 * Ajoute une vidéo youtube à la playlist
	 *
	 * @args yt_id ID de la vidéo youtube
	 * @args yt_length Longueur en secondes de la vidéo
	 */
	addYt(yt_id, yt_length) {
		if(this.isInPlaylist(yt_id)) return;

		// Obtention de l'URL directe
		let url = 'https://www.youtube.com/watch?v=' + yt_id;
		exec("youtube-dl -f 'best[height=360]' -g '" + url + "'",
			(err, stdout, stderr) => {
				if(err) {
					this.chat.print('{red-fg}Erreur de lecture pour {bold}'
							+ yt_id + '{/bold} : ' + stderr);
					return;
				}

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

	/**
	 * Renvoie true si la vidéo en argument est dans la playlist
	 *
	 * @args yt_id ID de la vidéo youtube
	 */
	isInPlaylist(yt_id) {
		for(let vid of this.liste)
			if(vid.id == yt_id)
				return true;
		return false;
	}

	/**
	 * Renvoie true si la vidéo en argument est en cours lecture
	 *
	 * @args yt_id ID de la vidéo youtube
	 */
	isPlaying(yt_id) {
		if(this.liste.length == 0) return false;
		return this.liste[0].id == yt_id;
	}

	/**
	 * Coupe la vidéo en cours et démarre la suivante
	 */
	playNext() {
		if(this.liste.length == 0) return;

		this.video = blessed.video({
			parent: this.screen,
			top: 0,
			left: 0,
			width: this.chat.getWidth() - 1,
			height: '50%',
			file: this.liste[0].url
		});

		this.screen.render();

		this.to = setTimeout(() => {
			this.stop();
			this.playNext();
		}, this.liste[0].video_length * 1000 + 5000);
	}

	/**
	 * Arrête la lecture
	 */
	stop() {
		clearTimeout(this.to);
		this.liste.shift();

		if(typeof this.video !== 'undefined') {
			this.video.destroy();
			this.screen.render();
		}
	}
}

module.exports = YtPlayer;

