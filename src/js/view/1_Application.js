/**
 *  An abstraction of a whole application
 *
 * It can accommodate all widgets that consist of a SPA(Single Page  Application).
 * By starting an "Application" instance, Each widget can be accessed by a hash URL.
 * - for example
 * http://apphost/webapp#widget1 -> widget1
 * http://apphost/webapp#widget2 -> widget2
 */
Application = {

    create : function (arg) {
        Assert.notNullAll(this, [
            [ arg.id, "arg.id" ],
            [ arg.appElem, "arg.appElem" ],
            [ arg.widgetDef, "arg.widgetDef" ]
        ]);
        var app = Object.create(this, {
            id : { value : arg.id },
            centralRepository : { value : ComponentRepository.create("applicationRepository") },
            transitionManager : { value : null, writable : true }
        });
        Object.defineProperties(app, this.fields || {});
        Object.seal(app);
        app.initialize(arg.appElem, arg.widgetDef);

        return app;
    },

    initialize : function (appElem, widgetDef) {
        Assert.notNullAll(this, [
            [appElem, "appElem" ],
            [ widgetDef, "widgetDef" ]
        ]);
        this.centralRepository.defineFactories(widgetDef);
        this.transitionManager = TransitionManager.create(appElem, this.centralRepository);
    },

    start : function (initWidgetId) {
        Assert.notNull(this, initWidgetId, "initWidgetId");
        var me = this;
        window.addEventListener("hashchange", function (event) {
            var hashIndex = event.newURL.lastIndexOf("#");
            var newWidgetId = event.newURL.substring(hashIndex + 1);
            me.transitionManager.transit(newWidgetId);
        });
        var hasHash = location.hash != "";
        if ( hasHash ) {
            initWidgetId = location.hash.substring(1);
        }
        this.transitionManager.transit(initWidgetId);
    }
};