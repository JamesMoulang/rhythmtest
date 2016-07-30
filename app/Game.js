class Game {
	constructor(width, height, canvas, ctx, fps) {
		this.canvas = canvas;
		this.ctx = ctx;
		this.fps = fps;
		this.canvas.width = width;
		this.canvas.height = height;

		this.loop();
	}

	loop() {
		this.update();
		this.render();
	}
}

export default Game;