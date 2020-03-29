#!/usr/bin/env node
const blessed = require("blessed");
const SkyChat = require("node-skychat");

const Config = require("./Config");
const ChatWindow = require("./ChatWindow");
const FormConnexion = require("./FormConnexion");
const YtPlayer = require("./YtPlayer");

if (!Config.url) {
	console.error("Veuillez renseigner l'URL du skychat dans config.json.");
	Config.save();
	process.exit(1);
}

// Initialisation du screen
let screen = blessed.screen({
	autoPadding: true,
	smartCSR: true,
	fullUnicode: true,
	title: "skychat-curses"
});

let chat, player;

// Touches de sortie
screen.key(["escape", "q", "C-c"], (ch, key) => {
	player.stop();
	return process.exit(0);
});

// Création et affichage du formulaire de connexion
let connexion = new FormConnexion(screen, init_skychat);
screen.render();

var logged = false;

// Events du skychat
function init_skychat(config) {
	SkyChat.init({
		username: config.username,
		password: config.password,
		url: config.url
	});

	SkyChat.on("log_once", log => {
		if (logged) return;
		logged = true;
		if (log.error) {
			screen.destroy();
			console.log("Erreur de connection : " + log.error);
			process.exit(1);
		}

		connexion.destroy();
		chat = new ChatWindow(screen, SkyChat);
		SkyChat.on("list", list => chat.updateUserList(list));
		SkyChat.on("newmessage", msg => chat.printMessage(msg));
		SkyChat.on("room_name", name => chat.updateTitle(name));
		SkyChat.on("user_join", user => {
			chat.print(`{${user.color}-fg}${user.pseudo} a rejoint la room.`);
			screen.render();
		});
		SkyChat.on("user_leave", user => {
			chat.print(`{${user.color}-fg}${user.pseudo} a quitté la room.`);
			screen.render();
		});

		player = new YtPlayer(screen, chat, SkyChat.player);
		SkyChat.on("curses_skip", () => player.stop());
		SkyChat.on("player_next", () => player.next());
		setInterval(() => player.update(), 1000);

		SkyChat.send("/gethistory");
	});
}
