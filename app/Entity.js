import Vector from './Vector';

class Entity {
	constructor(position = new Vector(0, 0)) {
		this.position = position;
	}

	update(delta) {

	}

	render(canvas, ctx, camera) {
		
	}
}

export default Entity;