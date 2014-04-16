QUnit.log(function(details) {
  console.log("actual: " + details.actual + ", expected: " + details.expected + ", message: " + details.message);
  console.log(details.source);
});

QUnit.testStart(function( details ) {
    console.log( "Now running: ", details.name );
});

QUnit.testDone(function( details ) {
    console.log( "Finished running: ", details.name, "failed / total: ", details.failed, "/", details.total);
});