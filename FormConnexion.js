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
			this.form.destroy();
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
				focus: {
					bg: 'lightgray'
				},
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
				focus: {
					bg: 'lightgray'
				},
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
	}

	/**
	 * Initialise le bouton envoyer
	 */
	_initButtons() {
		this.btnConnexion = blessed.button({
			parent: this.form,
			mouse: true,
			keys: true,
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
};

module.exports = FormConnexion;
