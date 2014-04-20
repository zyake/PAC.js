
/**
 *  An abstraction of a whole application
 *
 * # Basics
 * It can accommodate all widgets that consist of a SPA(Single Page  Application).
 *
 * You can register widget definitions as follows.
 * ```javascript
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
 * ```
 *
 * # How to use
 * An "Application" instance uses single "container" element to maintain widgets.
 * So, all of widgets that were loaded will be stored in the "container" element.
 * For example...
 * ```html
 * <!-- An application container element  -->
 * <div id="appContainer">
 *     <!-- The loaded "search" widget-->
 *     <div id="search">...</div>
 *     <!-- The loaded "setting" widget -->
 *     <div id="setting">...</div>
 * </div>
 * ```
 *
 * By starting an "Application" instance, each widget can be accessed by a hash URL.
 * For example...
 * - http://apphost/webapp#widget1 -> widget1
 * - http://apphost/webapp#widget2 -> widget2
 *
 * If a hash url has been already specified, it is used for navigation.
 */
this.Application = {

    /**
     * Create an Application object.
     *
     * @param arg The argument. The properties of the argument are following.
     * - id -> Required. The object id.
     * - appElem -> Required. The application container HTML element.
     * - widgetDef-> Required. The widget definition object.
     */
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

    /**
     * Initialize the Application object.
     * All of widget definitions will be registered.
     *
     * @param appElem The HTML container element.
     * @param widgetDef The Widget definition.
     */
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

    /**
     * Start the Application object specifying th initial widget id.
     * If current URL already has a hash URL, then the initial widget id will be ignored and
     * the current hash URL is used as widget id instead.
     *
     * @param initWidgetId The initial widget id.
     */
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

Object.seal(this.Application);
