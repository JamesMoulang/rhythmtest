import Vector from './Vector';

class KeyInput {
	constructor() {
		this.down = false;
		this.clicked = false;
		this.world = new Vector();
		this.screen = new Vector();
	}
}

export default KeyInput;