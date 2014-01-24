/**
 * SPA(Single Page Application)モデルにおける、Widgetの遷移を扱うための管理機構です。
 * 画面の遷移IDを登録することで、その遷移IDに紐づくViewの有効化などを行います。
 * 一度有効化されたViewはキャッシュされ、次回以降はサーバとの通信無しに取得します。
 *
 */
 function TransitionManager(containerElem, repository) {
    this.currentId = "";
    this.containerElem = containerElem;
    this.idToElemMap = [];
    this.isTransiting = false;
    this.repository = repository; /* a ComponentRepository to get components */
    this.templateRootPath = "template/";
    this.suffix = ".html";
 }