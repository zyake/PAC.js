
Application = {

   create: function(appElem, widgetDef) {
        var app = Object.create(this);
        app.initialize(appElem, widgetDef);

        return app;
   },

    initialize: function(appElem, widgetDef) {
        this.centralRepository = ComponentRepository.create();
        this.centralRepository.defineFactories(widgetDef);
        this.transitionManager = TransitionManager.create(appElem, this.centralRepository);
    },

    start: function(initWidgetId) {
        var me = this;
        window.addEventListener("hashchange", function(event) {
            var hashLocation = event.newURL.lastIndexOf("#");
            var newWidgetId = event.newURL.substring(hashLocation + 1);
             me.transitionManager.transit(newWidgetId);
        });
        this.transitionManager.transit(initWidgetId);
    }
};