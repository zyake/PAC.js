QUnit.log(function(details) {
    if ( ! details.result ) {
      console.log(details.message);
    }
});

QUnit.testStart(function( details ) {
    console.log( "Now running: ", details.name );
});

QUnit.testDone(function( details ) {
    console.log( "Finished running: ", details.name, "failed / total: ", details.failed, "/", details.total);
});