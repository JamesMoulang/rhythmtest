import WorkerGenerator from './WorkerGenerator';

function RhythmWorkerGenerator() {
	var worker = WorkerGenerator(function() {
		onmessage = function(e) {
	    	console.log(e.data);
	    }

	    //Long-running work here
	    var lts = performance.now();
	    var elapsed = 0;

	    postMessage({type: 'event', data: 'started'});
	    var beatTime = 2000 / 16;

	    this.pdown = false;
	    this.qdown = false;

	    var loop = function() {
	    	elapsed += performance.now() - lts;

	    	if (elapsed >= beatTime) {
	    		postMessage({type: 'event', data: 'beat'});
	    		// console.log(elapsed);
	    		elapsed -= beatTime - (elapsed - beatTime);
	    	}

	    	lts = performance.now();

			setTimeout(loop, 0);
	    };
	    loop();
	});

	return worker;
}

export default RhythmWorkerGenerator;