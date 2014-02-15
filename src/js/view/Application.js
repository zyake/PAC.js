
/**
 *  A abstraction of a whole application
 *
 * It can accommodate all widgets that consist of a SPA(Single Page  Application).
 * By starting a "Application" instance, Each widget can be accessed by a hash URL.
 * - for example
 * http://apphost/webapp#widget1 -> widget1
 * http://apphost/webapp#widget2 -> widget2
 */
Application = {

   create: function(id, appElem, widgetDef) {
        Assert.notNullAll(this, [ [ id, "id" ], [appElem, "appElem" ], [ widgetDef, "widgetDef" ] ]);
        var app = Object.create(this, {
            id: { value: id },
            centralRepository: { value: ComponentRepository.create("applicationRepository") },
            transitionManager: { value: null, writable: true }
        });
        Object.seal(app);
        app.initialize(appElem, widgetDef);

        return app;
   },

    initialize: function(appElem, widgetDef) {
        Assert.notNullAll(this, [ [appElem, "appElem" ], [ widgetDef, "widgetDef" ] ]);
        this.centralRepository.defineFactories(widgetDef);
        this.transitionManager = TransitionManager.create(appElem, this.centralRepository);
    },

    start: function(initWidgetId) {
        Assert.notNull(this, initWidgetId, "initWidgetId");
        var me = this;
        window.addEventListener("hashchange", function(event) {
            var hashIndex = event.newURL.lastIndexOf("#");
            var newWidgetId = event.newURL.substring(hashIndex + 1);
             me.transitionManager.transit(newWidgetId);
        });
        this.transitionManager.transit(initWidgetId);
    }
};