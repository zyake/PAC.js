
/**
 * A widget transition manager in the SPA(Single Page Application) model.
 *
 * # Basics
 * Registering widgets into a central repository, the manager will
 * turn on and off the widgets by a widget id.
 * The manager uses template HTML fragments to render the required widget.
 *
 * If a transition request is made, the manager retrieves a widget HTML fragment
 * as a widget template and pass through it into the required widget.
 *
 * # How to use
 * You don't have to use the manager directly,
 * ```
 */
this.TransitionManager = {

    /**
     * Create a TransitionManager object.
     *
     * @param arg The argument. The properties of the argument are following.
     * - containerElem -> Required. The container HTML element.
     * - repository -> Required. The repository to obtain the required widget.
     * - templatePath -> Optional. The root path of the HTML template. The default value is "template/".
     * - templateSuffix -> Optional. The templateSuffix of the HTML element. The default value is ".html".
     * - httpClient -> Optional. The HttpClient object to obtain the HTML template.
     * - errorHandler - > Optional. The error handler callback.
     */
    create : function (arg) {
        Assert.notNullAll(this, [
            [ arg.containerElem, "arg.containerElem" ],
            [ arg.repository, "arg.repository" ]
        ]);
        var manager = Object.create(this, {
            currentId : { value : null, writable : true },
            containerElem : { value : arg.containerElem },
            idToElemMap : { value : [] },
            repository : { value : arg.repository },
            templateRootPath : { value : arg.templatePath ||"template/" },
            templateSuffix : { value : arg.templateSuffix || ".html" },
            httpClient : { value : arg.httpClient || window.HttpClient },
            isTransiting: { value: false, writable: true },
            errorHandler : { value : arg.errorHandler || function () {
            } }
        });
        Object.defineProperties(manager, this.fields || {});
        for ( var key in arg ) {
            manager[key] == null && (manager[key] = arg[key]);
        }
        Object.seal(manager);
        return manager;
    },

    /**
     * Transit current widget to the specified widget.
     *
     * If the specified widget has already been loaded, the transition will be achieved by
     * showing the existing widget.
     * If not, the manager will retrieve the required HTML template through a HTML request asynchronously.
     *
     * @param id The widgetr id.
     */
    transit : function (id) {
        Assert.notNull(this, id, "id");
        if ( this.isTransiting ) {
            return;
        }
        if ( this.idToElemMap[id] != null ) {
            this.doTransit(id, {});
            return;
        }

        this.isTransiting = true;
        var templatePath = this.templateRootPath + id + this.templateSuffix;
        var me = this;
        this.httpClient.send(templatePath, function (event) {
            me.isTransiting = false;
            var xhr = event.target;
            if ( me.httpClient.isSuccess(xhr) ) {
                var newElem = document.createElement("DIV");
                document.getElementById(id) != null  && Assert.doThrow(
                    "duplicated id found!: id=" + id);

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

    /**
     * do transition internally.
     *
     * @param id The widget id.
     * @param newElem The widget template HTML element.
     */
    doTransit : function (id, newElem) {
        Assert.notNullAll(this, [
            [ id, "id" ],
            [ newElem, "newElem" ]
        ]);
        if ( this.currentId != null ) {
            var prevWidgetElem = this.idToElemMap[this.currentId];
            var prevWidget = this.repository.get(this.currentId,
                { elem: prevWidgetElem, parentRepository: this.repository });
            prevWidgetElem.style.display = "none";
        }
        this.currentId = id;
        this.idToElemMap[id].style.display = "block";
        var currentWidget = this.repository.get(id,
            { elem: newElem, parentRepository: this.repository });
        currentWidget.initialize();
    },

    toString : function () {
        return "TransitionManager [ currentId: " + this.currentId + ", idToElemMap: " + this.idToElemMap + " ]";
    }
};

Object.seal(this.TransitionManager);
