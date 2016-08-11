import Entity from './Entity';
import Maths from './Maths';
import Vector from './Vector';

class MetronomeMarker extends Entity {
	constructor(alpha = 1) {
		super(new Vector(64, 64));
		this.width = 30;
		this.alpha = alpha;
	}

	update(delta) {
		super.update(delta);
		this.position.x += delta * 2;
	}

	render(canvas, ctx, camera) {
		super.render(canvas, ctx, camera);
		ctx.fillStyle = '#000000';
		ctx.globalAlpha = this.alpha;
		this.width = Maths.lerp(this.width, 0.25, 10);
		ctx.fillRect(
			this.position.x-this.width*0.5, 
			this.position.y-this.width*0.5, 
			this.width, 
			this.width
		);
		ctx.globalAlpha = 1;
	}
}

export default MetronomeMarker;