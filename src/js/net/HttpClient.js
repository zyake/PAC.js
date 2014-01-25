/**
 * VERY simple http client.
 */
 HttpClient = {};
 HttpClient.send = function(url, loaded, data, method) {
    var method = method || "GET";

    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", loaded);
    xhr.open(method, url, true);
    xhr.send(data);

    return xhr;
 };

HttpClient.isSuccess = function(xhr) {
    // Status Code = 0 is used for phantomjs testing.
    var isSuccess = xhr.status == 0 || xhr.status == 200;
    return isSuccess;
}