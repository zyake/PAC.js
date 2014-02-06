
/**
 * A widget transition manager in the SPA(Single Page Application) model.
 *
 * Registering widgets into a central repository, the manager will
 * turn on and off the widgets by a widget id.
 */
 TransitionManager = {

    create: function(containerElem, repository, errorHandler) {
        var manager = Object.create(this, {
            currentId: { value: null },
            containerElem: { value: containerElem },
            idToElemMap: { value: [] },
            repository: { value: repository },
            templateRootPath: { value: "template/" },
            templateSuffix: { value: ".html" },
            httpClient: { value: window.HttpClient },
            errorHandler: { value: errorHandler || function() {} }
        });

       return manager;
    },

    transit: function(id) {
         if ( this.isTransiting ) {
             return;
         }
         if ( this.idToElemMap[id] != null ) {
             this.doTransit(id);
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
                 me.doTransit(id, newElem);
             } else {
                 me.errorHandler(xhr);
             }
         });
      },

      doTransit: function(id, newElem) {
           if ( this.currentId != null ) {
               var prevWidgetElem = this.idToElemMap[this.currentId];
               var prevWidget = this.repository.get(this.currentId, prevWidgetElem, this.repository);
               prevWidgetElem.style.display = "none";
           }
           this.currentId = id;
           this.idToElemMap[id].style.display = "block";
           var currentWidget = this.repository.get(id, newElem, this.repository);
           currentWidget.initialize();
      }
 };