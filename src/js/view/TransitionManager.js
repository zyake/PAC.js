
/**
 * A widget transition manager in the SPA(Single Page Application) model.
 *
 * Registering widgets into a central repository, the manager will
 * turn on and off the widgets by a widget id.
 */
 function TransitionManager(containerElem, repository, errorHandler) {
    this.currentId = null;
    this.containerElem = containerElem;
    this.idToElemMap = [];
    this.isTransiting = false;
    this.repository = repository; // A ComponentRepository to get components
    this.templateRootPath = "template/";
    this.templateSuffix = ".html";
    this.httpClient = HttpClient;
    this.errorHandler = errorHandler || function() {};
 }

 TransitionManager.prototype = {

     transit: function(id) {
         if ( this.isTransiting ) {
             return;
         }
         if ( this.idToElemMap[id] != null ) {
             doTransit(id);
             return;
         }

         this.isTransiting = true;
         var templatePath = this.templateRootPath + id + this.templateSuffix;
         var me = this;
         this.httpClient.send(templatePath, function(event) {
             me.isTransiting = false;
             var xhr = event.target;
             if ( me.httpClient.isSuccess(xhr) ) {
                 var newElem = document.createElement("DIV");
                 if ( document.getElementById(id) != null ) {
                     throw new Error("duplicated id found!: id=" + id);
                 }
                 newElem.id = id;
                 newElem.style.display = "none";
                 newElem.innerHTML = xhr.responseText;

                 me.idToElemMap[id] = newElem;
                 me.containerElem.appendChild(newElem);
                 doTransit(id, newElem);
             } else {
                 this.errorHandler(xhr);
             }
         });

         function doTransit(id, newElem) {
             if ( me.currentId != null ) {
                 var prevWidgetElem = me.idToElemMap[me.currentId];
                 var prevWidget = me.repository.get(me.currentId, prevWidgetElem, this.repository);
                 prevWidget.finish && prevWidget.finish();
                 prevWidgetElem.style.display = "none";
             }
             me.currentId = id;
             me.idToElemMap[id].style.display = "block";
             var currentWidget = me.repository.get(id, newElem, this.repository);
             currentWidget.initialize && currentWidget.initialize();
         }
      },
 };