
/**
 *  An abstraction of a whole application
 *
 * It can accommodate all widgets that consist of a SPA(Single Page  Application).
 *
 * You can register widget definitions as follows.
 * Application.create({
 *  // Specify an application id.
 *  id: "app1",
 *
 *  // Specify a container element.
 *  appElem:  document.querySelector("#appContainer"),
 *
 *  // Specify widget definitions.
 *  widgetDef: {
 *      search: SearchWidget,
 *      settings: SettingsWidget
 *  }
 * });
 *
 * An "Application" instance uses single "container" element to maintain widgets.
 * So, all of widgets that were loaded will be stored in the "container" element.
 * - for example
 * <!-- An application container element  -->
 * <div id="appContainer">
 *     <!-- The loaded "search" widget-->
 *     <div id="search">...</div>
 *     <!-- The loaded "setting" widget -->
 *     <div id="setting">...</div>
 * </div>
 *
 * By starting an "Application" instance, each widget can be accessed by a hash URL.
 * - for example
 * http://apphost/webapp#widget1 -> widget1
 * http://apphost/webapp#widget2 -> widget2
 *
 * If a hash url has been already specified, it is used for navigation.
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
            centralRepository : { value : ComponentRepository.create({id: "applicationRepository" }) },
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
        for ( var key in widgetDef ) {
            this.centralRepository.addDefinition(key, {
                target: widgetDef[key]
            });
        }
        this.transitionManager = TransitionManager.create({
            containerElem: appElem,
            repository: this.centralRepository});
    },

    start : function (initWidgetId) {
        Assert.notNull(this, initWidgetId, "initWidgetId");
        var me = this;
        window.addEventListener("hashchange", function (event) {
            var hashIndex = location.hash.lastIndexOf("#");
            var newWidgetId = location.hash.substring(hashIndex + 1);
            me.transitionManager.transit(newWidgetId);
        });

        var hasHash = location.hash != "";
        hasHash && ( initWidgetId = location.hash.substring(1) );
        this.transitionManager.transit(initWidgetId);
    }
};

Object.seal(Application);