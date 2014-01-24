test("isSuccess_SuccessCode0", function() {
    ok(HttpClient.isSuccess({ status: 0 }));
});

test("isSuccess_SuccessCode200", function() {
    ok(HttpClient.isSuccess({ status: 200 }));
});

test("isSuccess_FailureCode", function() {
    ok(! HttpClient.isSuccess({ status: 400 }));
});

asyncTest('getSuccess', function() {
   var xhr = HttpClient.send("resources/Test.txt", function(event) {
    start();
    equal("hogehoge", event.target.responseText);
   });
});
