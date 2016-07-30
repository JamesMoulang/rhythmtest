import _ from 'underscore';
import Vector from './Vector';
import Entity from './Entity';

class Game {
	constructor(width, height, canvas, ctx, fps) {
		this.canvas = canvas;
		this.ctx = ctx;
		this.fps = fps;
		this.idealFrameTime = 1000 / this.fps;
		this.canvas.width = width;
		this.canvas.height = height;
		this.entities = [];
		this.delta = 1;

		this.loop();
	}

	start() {
		var e = (new Entity(new Vector(100, 100)));
		e.update = function(delta) {
			this.position.x += delta;
		}
		e.render = function(canvas, ctx) {
			ctx.fillStyle = '0x000000';
			ctx.fillRect(this.position.x, this.position.y, 10, 10);
		}
		this.entities.push(e);

		this.lastTimestamp = this.timestamp();
		this.loop();
	}

	loop() {
		var lastFrameTimeElapsed = this.timestamp() - this.lastTimestamp;
		this.delta = lastFrameTimeElapsed / this.idealFrameTime;
		this.update();
		this.render();
		this.lastTimestamp = this.timestamp();
		if (lastFrameTimeElapsed < this.idealFrameTime) {
			setTimeout(this.loop.bind(this), this.idealFrameTime - lastFrameTimeElapsed);
		} else {
			this.loop();
		}
	}

	//Game stuff, not rhythm. Can run slower than rhythm.
	update() {
		_.each(this.entities, function(entity) {
			entity.update(this.delta);
		}.bind(this));
	}

	//Render stuff.
	render() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		_.each(this.entities, function(entity) {
			entity.render(this.canvas, this.ctx);
		}.bind(this));
	}

	timestamp() {
		return performance.now();
	}
}

export default Game;