const blessed = require('blessed');

/**
 * Formulaire de connexion
 * Demande nom d'utilisateur et mot de passe
 * Renvoie le résultat en callback
 */
class FormConnexion {
	constructor(screen, callback) {
		this.screen = screen;
		this.callback = callback;

		this._initForm();
		this._initFields();
		this._initButtons();

		this.form.focusNext();
	}

	/**
	 * Initialise le Formulaire
	 */
	_initForm() {
		this.form = blessed.form({
			parent: this.screen,
			border: 'line',
			mouse: true,
			keys: true,
			left: 'center',
			top: 'center',
			width: 50,
			height: 9,
			label: ' Connexion ',
		});

		this.form.on('submit', (data) => {
			this._showLoading();
			this.screen.render();
			this.callback(data);
		});
	}

	/**
	 * Initialise les champs de texte
	 */
	_initFields() {
		this.username = blessed.textbox({
			parent: this.form,
			inputOnFocus: true,
			mouse: true,
			height: 1,
			width: 20,
			left: 20,
			top: 1,
			name: 'username',
			style: {
				bg: 'gray',
				hover: {
					bg: 'lightgray'
				}
			}
		});

		this.txtUsername = blessed.text({
			parent: this.form,
			top: 1,
			left: 11,
			content: 'Pseudo : '
		});

		this.password = blessed.textbox({
			parent: this.form,
			inputOnFocus: true,
			mouse: true,
			height: 1,
			width: 20,
			left: 20,
			top: 3,
			censor: true,
			name: 'password',
			style: {
				bg: 'gray',
				hover: {
					bg: 'lightgray'
				}
			}
		});

		this.txtPassword = blessed.text({
			parent: this.form,
			top: 3,
			left: 5,
			content: 'Mot de passe : '
		});

		this.username.key('enter', () => this.form.submit());
		this.password.key('enter', () => this.form.submit());
	}

	/**
	 * Initialise le bouton envoyer
	 */
	_initButtons() {
		this.btnConnexion = blessed.button({
			parent: this.form,
			mouse: true,
			shrink: true,
			padding: {
				left: 1,
				right: 1
			},
			left: 'center',
			top: 5,
			name: 'btnsubmit',
			content: 'Se connecter',
			style: {
				bg: 'gray',
				focus: {
					bg: 'lightgray'
				},
				hover: {
					bg: 'lightgray'
				}
			}
		});

		this.btnConnexion.on('press', () => {
			this.form.submit();
		});
	}

	/**
	 * Détruit les éléments du formulaire et affiche un message de chargement
	 */
	_showLoading() {
		this.username.destroy();
		this.txtUsername.destroy();
		this.password.destroy();
		this.txtPassword.destroy();
		this.btnConnexion.destroy();

		this.txtConnexion = blessed.loading({
			parent: this.form,
			height: 'shrink',
			width: 1,
			top: 'center',
			left: 'center'
		});

		this.txtConnexion.load('');
	}

	/**
	 * Détruit l'écran de connexion
	 */
	destroy() {
		this.txtConnexion.stop();
		this.txtConnexion.destroy();
		this.form.destroy();
		this.screen.render();
	}
};

module.exports = FormConnexion;
