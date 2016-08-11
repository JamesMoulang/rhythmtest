import howler from 'howler';
const Howl = howler.Howl;
import _ from 'underscore';

var Audio = {
	cache: {},
	loadedCount: 0,

	load: function(key, urls) {
		this.loading = true;
		this.loadedCount++;

		if (typeof(urls) === "string") {
			urls = [urls];
		}

		var sound = new Howl({
		  	urls: urls,
		  	onloaderror: function(err) {
				this.cache[key] = null;
				console.warn("Couldn't put sound with url " + urls[0] + " and key " + key);
				this.loadedCount--;
			}.bind(this),
			onload: function() {
				this.loadedCount--;
			}.bind(this)
		});

		if (this.cache[key] != null) {
			console.warn("Already cached a sound with key " + key);
		} else {
			this.cache[key] = sound;
		}
	},

	create: function(key) {
		if (this.cache[key] == null) {
			console.warn("No cached sounds with key " + key);
			return null;
		} else {
			return new Howl({
			  	urls: [this.cache[key]._src]
			});
		}
	},

	isLoaded: function() {
		return this.loadedCount == 0 && this.loading;
	},

	play: function(key) {
		if (this.cache[key] == null) {
			console.warn("Can't find a sound with key " + key);
		} else {
			this.cache[key].play();
		}
	}
};

export default Audio;
