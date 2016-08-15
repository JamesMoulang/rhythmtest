import _ from 'underscore';
import Vector from './Vector';
import Entity from './Entity';
import WorkerGenerator from './WorkerGenerator';
import RhythmWorkerGenerator from './RhythmWorkerGenerator';
import MetronomeMarker from './MetronomeMarker';
import InputMarker from './InputMarker';
import Audio from './Audio';
import KeyInput from './KeyInput';

const codes = {
	w: 87,
	a: 65,
	s: 83,
	d: 68,
	up: 38,
	p: 80,
	q: 81,
	left: 37,
	down: 40,
	right: 39,
	space: 32
};


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

		this.input = {
			up: new KeyInput(),
			down: new KeyInput(),
			left: new KeyInput(),
			right: new KeyInput(),
			space: new KeyInput(),
			q: new KeyInput(),
			p: new KeyInput(),
			vertical: 0,
			horizontal: 0,
			pointer: {
				world: new Vector(),
				screen: new Vector(),
				down: false,
				movedThisFrame: false,
				clicked: false
			}
		};

		window.onkeydown = this.onkeydown.bind(this);
		window.onkeyup = this.onkeyup.bind(this);

		Audio.load('tom1', '/tom1.wav');
		Audio.load('tom2', '/tom2.wav');
		Audio.load('tick', '/tick.wav');
		Audio.load('Gs3', '/xylophone/Gs3.wav');
		Audio.load('B4', '/xylophone/B4.wav');
		Audio.load('Cs4', '/xylophone/Cs4.wav');
		Audio.load('Ds4', '/xylophone/Ds4.wav');
		Audio.load('Fs4', '/xylophone/Fs4.wav');

		this.loop();
	}

	onkeyup(e) {
		switch(e.keyCode) {
			case codes.q:
				this.input.q.isDown = false;
				break;
			case codes.p:
				this.input.p.isDown = false;
				break;
			case codes.up:
			case codes.w:
				this.input.up.isDown = false;
				this.input.vertical++;
				break;
			case codes.left:
			case codes.a:
				this.input.left.isDown = false;
				this.input.horizontal++;
				break;
			case codes.down:
			case codes.s:
				this.input.down.isDown = false;
				this.input.vertical--;
				break;
			case codes.right:
			case codes.d:
				this.input.right.isDown = false;
				this.input.horizontal--;
				break;
			case codes.space:
				this.input.space.isDown = false;
				break;
			default:
				break;
		}
	}

	onkeydown(e) {
		switch(e.keyCode) {
			case codes.q:
				if (!this.input.q.isDown) {
					this.input.q.clicked = true;
				}
				this.input.q.isDown = true;
				break;
			case codes.p:
				if (!this.input.p.isDown) {
					this.input.p.clicked = true;
				}
				this.input.p.isDown = true;
				break;
			case codes.up:
			case codes.w:
				if (!this.input.up.isDown) {
					this.input.up.clicked = true;
				}
				this.input.up.isDown = true;
				this.input.vertical--;
				break;
			case codes.left:
			case codes.a:
				if (!this.input.left.isDown) {
					this.input.left.clicked = true;
				}
				this.input.left.isDown = true;
				this.input.horizontal--;
				break;
			case codes.down:
			case codes.s:
				if (!this.input.down.isDown) {
					this.input.down.clicked = true;
				}
				this.input.down.isDown = true;
				this.input.vertical++;
				break;
			case codes.right:
			case codes.d:
				if (!this.input.right.isDown) {
					this.input.right.clicked = true;
				}
				this.input.right.isDown = true;
				this.input.horizontal++;
				break;
			case codes.space:
				if (!this.input.space.isDown) {
					this.input.space.clicked = true;
				}
				this.input.space.isDown = true;
				break;
			default:
				break;
		}
	}

	start() {
		this.lastTimestamp = this.timestamp();

		this.worker = RhythmWorkerGenerator(2000, 16);

		this.worker.onmessage = function(event) {
			var type = event.data.type;
			var data = event.data.data;
			if (type == 'event') {
				switch(data) {
					case 'started':
						console.log("STARTED!");
						this.worker.postMessage(
							{
								type: 'queue', 
								data: {
									beats: [0,4,8,10,12],
									loop: true,
									beat: 'tick',
									listen: false
								}
							}
						);
						break;
					case 'beat':
						Audio.play('tick');
						var m = new MetronomeMarker();
						this.entities.push(m);
						break;
					default:

						break;
				}
			}
		}.bind(this);

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
		if (this.input.p.clicked) {
			var m = new InputMarker('#ff0000');
			this.entities.push(m);
			this.worker.postMessage({type: 'input', data: 'p'});
		}

		if (this.input.q.clicked) {
			var m = new InputMarker('#0000ff');
			this.entities.push(m);
			this.worker.postMessage({type: 'input', data: 'q'});
		}

		_.each(this.entities, function(entity) {
			entity.update(this.delta);
		}.bind(this));

		this.input.pointer.movedThisFrame = false;
		this.input.pointer.clicked = false;
		this.input.up.clicked = false;
		this.input.down.clicked = false;
		this.input.left.clicked = false;
		this.input.right.clicked = false;
		this.input.space.clicked = false;
		this.input.q.clicked = false;
		this.input.p.clicked = false;
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