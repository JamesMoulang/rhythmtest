function WorkerGenerator(func) {
	var blobURL = URL.createObjectURL( new Blob([ '(',

		func.toString(),

		')()' ], { type: 'application/javascript' } )
	);

	var worker = new Worker( blobURL );

	return worker;
}

export default WorkerGenerator;