
/**
 *  A central repository to manage components.
 *
 *  # Basics
 *  A component can be registered as definition basis, and
 *  the component will be instantiated when it retrieved at first time.
 *  The component instance will be cached in the repository.
 *
 * If you want to refer to other repository managed components,
 * you can refer to them using the "ref" property in the definition.
 *
 * - for example
 *
 * ```javascript
 * var repository = ComponentRepository.create({ id: "repository1" });
 * repository
 *  .addDefinition({ id: { target: function() { return "ID-1" } } })
 *  .addDefinition({ defaultName: {
 *          target: function(arg) { return arg.id + "-001" },
 *          ref: { id: "id" }
*    });
 *
 * // The value "ID-1-001" will be showed.
 * alert(repository.get("defaultName"));
 *```
 *
 * # The specification of the component definition
 *
 *```javascript
 * COMPONENT_ID: {
 *  target: TARGET_OBJECT // required. The target object must have a "create" method.
 *  arg: // optional. It is fixed value to pass the "create" method.
 *  { KEY1: VALUE1, KEY2: VALUE2 ... },
 *  ref: // optional. It is used for referring other components. It will be merged into the "arg".
 *  { KEY1: OTHER_COMPONENT_ID1, KEY2: OTHER_COMPONENT_ID2 ... }
 *  scope: request // optional. It specifies component scope. Default is singleton.
 * }
 *```
 * # Managing events
 * The central repository also supports hierarchical event propagating mechanism,
 * which can be used to notify an event data to parent repositories that
 * can manage the whole application configuration.
 */
this.ComponentRepository = {

    /**
     * Create a ComponentRepository object.
     *
     * @param arg The constructor argument. The properties of the argument are following.
     * - id -> Required. The object id.
     * - parent -> Optional. The parent repository. The default value is null.
     */
    create : function (arg) {
        Assert.notNull(this, arg.id, "arg.id");

        var repository = Object.create(this, {
            id : { value : arg.id },
            singletons : { value : {} },
            definitions : { value : {} },
            events : { value : {} },
            children : { value : [] },
            routeStack : { value : [] },
            parent : { value : arg.parent }
        });
        Object.defineProperties(repository, this.fields || {});
        for ( var key in arg ) {
            repository[key] == null && (repository[key] = arg[key]);
        }
        Object.seal(repository);
        repository.initialize();

        return repository;
    },

    initialize : function () {
        this.parent != null && this.parent.children.push(this);
    },

    addEventRef : function (id, listener) {
        Assert.notNullAll(this, [
            [id, "id"],
            [listener, "listener"]
        ]);
        this.events[id] || (this.events[id] = []);
        this.events[id].push(listener);

        return this;
    },

    /**
     * Raise an event.
     * The event will be propagated other components.
     *
     * @param event The raised event.
     * @param caller The event caller.
     * @param arg The event data.
     * @returns {this.ComponentRepository} The repository.
     */
    raiseEvent : function (event, caller, arg /* can be null! */) {
        Assert.notNullAll(this, [
            [ event, "event" ],
            [ caller, "caller" ]
        ]);
        var noRefsFound = this.events[event] == null;
        if ( noRefsFound ) {
            return;
        }

        var listeners = this.events[event];
        for ( var key in listeners ) {
            listeners[key].notify(event, arg);
        }

        var parentShouldBeCalled = this.parent != null && this.parent != caller;
        parentShouldBeCalled && this.parent.raiseEvent(event, this, arg);
        for ( var key in this.children ) {
            this.children[key].raiseEvent(event, this, arg);
        }

        return this;
    },

    /**
     * Add a component definition,
     * The specification of the definition  is written in the top comment.
     *
     * @param id The component id.
     * @param def The definition.
     * @returns {this.ComponentRepository} The repository.
     */
    addDefinition : function (id, def) {
        Assert.notNullAll(this, [
            [ id, "id" ],
            [ def, "def" ]
        ]);

        var targetRequired = def.target == null;
        targetRequired && Assert.doThrow(
            "The definition must have a correct target!: id=" + id + ", definition=" + def);

        var isFactoryFunc = def.target instanceof Function;
        isFactoryFunc && ( def.target = { create: def.target } );

        var isFactoryObject =  def.target instanceof  Object && def.target.create instanceof Function;
        ! isFactoryObject && Assert.doThrow(
            "The definition must have a correct target!: id=" + id + ", definition=" + def);

        this.definitions[id] = def;

        return this;
    },

    /**
     * Get a component that is defined in this repository.
     * If the component is not found and the repository has a parent,
     * the repository will delegate the request to the parent repository.
     *
     * If all of repositories didn't have the required component,
     * the repository will throw an Error.
     *
     * @param id The component id.
     * @param arg The component argument.
     * @returns {*} The component.
     */
    get : function (id, arg /* can be null! */) {
        Assert.notNullAll(this, [
            [ id, "id" ]
        ]);

        var recursiveRefFound = this.routeStack.indexOf(id) > -1;
        recursiveRefFound && Assert.doThrow("The recursive reference found: route=" + this.routeStack);

        try {
            this.routeStack.push(id);
            var def = this.definitions[id];
            if ( def != null ) {
                var isSingleton = def.scope === "singleton" || def.scope == null;
                var useCachedInstance = isSingleton && this.singletons[id] != null;
                if ( useCachedInstance ) {
                    return this.singletons[id];
                }

                var mergedArg = {};
                for ( var key in  def.arg ) {
                    mergedArg[key] = def.arg[key];
                }

                for ( var key in def.ref ) {
                    var refId = def.ref[key];
                    var isComposited = refId instanceof Array;
                    if ( isComposited ) {
                        var compositeRefComponent = [];
                        for ( var innerKey in refId ) {
                            var refComponent = this.get(refId[innerKey]);
                            compositeRefComponent.push(refComponent);
                        }
                        mergedArg[key] = compositeRefComponent;
                    } else {
                        var refComponent = this.get(refId);
                        mergedArg[key] = refComponent;
                    }
                }

                for ( var key in arg ) {
                    var passedArg = arg[key];
                    mergedArg[key] = passedArg;
                }

                mergedArg.id = id;
                var component = def.target.create(mergedArg);
                isSingleton && (this.singletons[id] = component);

                return component;
            }

            this.parent == null && Assert.doThrow("target factory not found: id=" + id);
            var component = this.parent.get(id, arg);
            component == null && Assert.doThrow("target factory not found: id=" + id);

            return component;
        } finally {
            this.routeStack.pop();
        }
    },

    toString : function () {
        return "id: " + this.id;
    }
};

Object.seal(this.ComponentRepository);
