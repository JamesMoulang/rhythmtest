import Game from './Game';

window.onload = function() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var game = new Game(1024, 768, canvas, ctx, 60);
	game.start();
};