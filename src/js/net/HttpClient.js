
/**
 * VERY simple http client.
 */
 HttpClient = {

     send: function(url, loaded, data/* can be null! */, reqCallback /* can be null! */, method /* can be null! */) {
         Assert.notNullAll([ [ url, "url" ], [ loaded, "loaded" ] ]);
         var method = method || "GET";
         var reqCallback = reqCallback || function() { return data; }
         var xhr = new XMLHttpRequest();
         xhr.addEventListener("load", loaded);
         xhr.open(method, url, true);
         xhr.send(reqCallback(data, xhr));

         return xhr;
      },

     isSuccess: function(xhr) {
        Assert.notNull(xhr, "xhr");
         // Status Code = 0 is used for phantomjs testing.
         var isSuccess = xhr.status == 0 || xhr.status == 200;
         return isSuccess;
     }
 };