import WorkerGenerator from './WorkerGenerator';

function RhythmWorkerGenerator(barTime, beatCount) {
	var worker = WorkerGenerator(function(barTime, beatCount) {
		var counter = 0;
		var beatListeners = [];

		var barTime;
		var beatCount;
		var beatTime;

		onmessage = function(e) {
			var m = e.data;

	    	switch(m.type) {
	    		case 'queue':
	    			playRhythm(m.data);
	    			break;
	    		case 'timing':
	    			barTime = m.data.barTime;
	    			beatCount = m.data.beatCount;
	    			beatTime = barTime / beatCount;
	    			loop();
	    			break;
	    		case 'input':
	    			console.log(m.data);
	    			break;
	    		default:
	    			console.log(m);
	    	}
	    }

	    //Input detection now.
	    //Just like playRhythm, should be able to listen for multiple rhythms at once.
	    //So, perhaps
	    	//Beats
	    	//OnCorrect()
	    	//OnIncorrect()
	    //Now that beats actually have a time, we don't need to wait for them to play to figure out
	    //if they hit or not.

	    //Should be able to call this function to add multiple rhythms.
	    //e.g. one for the metronome, one for a rhythm puzzle, etc.
	    var playRhythm = function(r) {
	    	var nextBarCounter = (Math.floor(counter / beatCount) + 1) * beatCount;
	    	for (var i = 0; i < r.beats.length; i++) {
	    		var beat = r.beats[i];
	    		var promise = new Promise(function(resolve, reject) {
	    			//Create the beat listener.
	    			var loop = (r.loop && i == r.beats.length - 1);
	    			beatListeners.push({
	    				alive: true,
	    				time: nextBarCounter + beat,
	    				callback: function(hit) {
	    					if (hit) {
	    						resolve(loop);
	    					} else {
	    						reject();
	    					}
	    				}
	    			});
	    		});

	    		promise.then(function(loop) {
	    			postMessage({type: 'event', data: 'beat'});
	    			if (loop) {
	    				playRhythm(r);
	    			}
	    		}, function() {
	    			console.log("I'd be pretty surprised if this was being called.");
	    		});
	    	}
	    }

	    var lastBeatTime;
	    var onBeat = function(c) {
	    	lastBeatTime = performance.now();

	    	for (var i = 0; i < beatListeners.length; i++) {
	    		if (beatListeners[i].time == c) {
	    			beatListeners[i].callback(true);
	    			beatListeners[i].alive = false;
	    		} else if (beatListeners[i].time < c) {
	    			beatListeners[i].callback(false);
	    			beatListeners[i].alive = false;
	    		}
	    	}

	    	for (var i = beatListeners.length - 1; i >= 0; i--) {
	    		if (!beatListeners[i].alive) {

	    		}
	    	}
	    }
 
	    //Long-running work here
	    var lts = performance.now();
	    var elapsed = 0;

	    postMessage({type: 'event', data: 'started'});

	    this.pdown = false;
	    this.qdown = false;

	    var loop = () => {
	    	elapsed += performance.now() - lts;

	    	if (elapsed >= beatTime) {
	    		counter++;
	    		onBeat(counter);
	    		elapsed -= beatTime - (elapsed - beatTime);
	    	}

	    	lts = performance.now();

			setTimeout(loop, 0);
	    };
	});

	worker.postMessage({
		type: 'timing',
		data: {
			barTime: barTime,
			beatCount: beatCount
		}
	});

	return worker;
}

export default RhythmWorkerGenerator;