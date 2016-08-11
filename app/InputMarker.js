import Entity from './Entity';
import Vector from './Vector';
import Maths from './Maths';

class InputMarker extends Entity {
	constructor(colour) {
		super(new Vector(64, 64+15));
		this.width = 30;
		this.colour = colour;
	}

	update(delta) {
		super.update(delta);
		this.position.x += delta * 2;
	}

	render(canvas, ctx, camera) {
		super.render(canvas, ctx, camera);
		ctx.fillStyle = this.colour;
		this.width = Maths.lerp(this.width, 0.25, 10);
		ctx.fillRect(this.position.x, this.position.y, this.width, this.width);
	}
}

export default InputMarker;