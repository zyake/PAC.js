// imports view/TransitionManager.js
// imports net/HttpClient.js

/**
 * SPA(Single Page Application)モデルにおける、Widgetの遷移を扱うための管理機構です。
 * 画面の遷移IDを登録することで、その遷移IDに紐づくViewの有効化などを行います。
 * 一度有効化されたViewはキャッシュされ、次回以降はサーバとの通信無しに取得します。
 */
 function TransitionManager(containerElem, repository) {
    this.currentId = "";
    this.containerElem = containerElem;
    this.idToElemMap = [];
    this.isTransiting = false;
    this.repository = repository; /* a ComponentRepository to get components */
    this.templateRootPath = "template/";
    this.templateSuffix = ".html";
 }

 TransitionManager.prototype.transit = function(id) {
    if ( this.isTransiting ) {
        return;
    }
    if ( this.idToElemMap[id] != null ) {
        this.doTransit(id);
        return;
    }

    this.isTransiting = true;
    var templatePath = this.templateRootPath + id + this.templateSuffix;
    HttpClient.send(templatePath, function(event) {
        var xhr = event.target;
        if ( HttpClient.isSuccess(xhr) ) {
            this.isTransiting = false;

            var newElem = document.createElement("DIV");
            newElem.id = id;
            newElem.style.display = "none";
            this.idToElemMap[id] = newElem;
            newElem.innerHTML = xhr.responseText;
            this.containerElem.appendChild(newElem);

            this.repository.get(newElem);
            this.doTransit(id);
        }
    });

    var me = this;
    function doTransit(id) {
        if ( me.currentId != null ) {
            me.idToElemMap[me.currentId].style.display = "none";
        }
        me.idToElemMap[id].style.display = "block";
    }
 }