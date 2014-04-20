
/**
 * A very simple http client.
 *
 * # Basics
 * You can send HTTP requests and receive HTTP responses by HttpClient.
 * Http request method and request header are configurable.
 *
 * # How to use
 *
 * ```javascript
 * // Send a request.
 * HttpClient.send("/api/customers", loadCallback, { birthday: "1980/1/1" });
 * ```
 */
this.HttpClient = {

    /**
     * Send a HTTP request.
     *
     * @param url The request URL.
     * @param loaded The load callback.
     * @param data The sending data.
     * @param reqCallback The callback for modifying the HTTP request header.
     * @param method The HTTP method(GET, POST,. HEAD etc...)
     * @returns {XMLHttpRequest} The requesting XMLHttpRequest object.
     */
    send : function (url, loaded, data/* can be null! */, reqCallback /* can be null! */, method /* can be null! */) {
        Assert.notNullAll(this, [
            [ url, "url" ],
            [ loaded, "loaded" ]
        ]);
        var method = method || "GET";
        var reqCallback = reqCallback || function () {
            return data;
        }
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", loaded);
        xhr.open(method, url, true);
        xhr.send(reqCallback(data, xhr));

        return xhr;
    },

    /**
     * Check whether the XMLHttpRequest is succeeded or not.
     * @param xhr The target XMLHttpRequest object.
     * @returns {boolean} True if the target is succeeded, false if the target if failed.
     */
    isSuccess : function (xhr) {
        Assert.notNull(this, xhr, "xhr");
        // Status Code = 0 is used for phantomjs testing.
        var isSuccess = xhr.status == 0 || xhr.status == 200;
        return isSuccess;
    }
};

Object.seal(this.HttpClient);