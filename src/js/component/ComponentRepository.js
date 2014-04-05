
/**
 *  A central repository to manage components.
 *
 *  A component can be registered as definition basis, and
 *  the component will be instantiated when it retrieved at first time.
 *  The component instance will be cached in the repository.
 *
 * If you want to refer to other repository managed components,
 * you can refer to them using the "ref" property in the definition.
 *
 * - for example
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
 *
 * The central repository also supports hierarchical event propagating mechanism,
 * which can be used to notify an event data to parent repositories that
 * can manage the whole application configuration.
 */
ComponentRepository = {

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

    addDefinition : function (id, def) {
        Assert.notNullAll(this, [
            [ id, "id" ],
            [ def, "def" ]
        ]);

        var targetRequired = def.target == null;
        if ( targetRequired ) {
            throw new Error(
            "The definition must have a correct target!: id=" + id + ", definition=" + def);
        }

        var isFactoryFunc = def.target instanceof Function;
        if ( isFactoryFunc ) {
            def.target = { create: def.target };
        }

        var isFactoryObject =  def.target instanceof  Object && def.target.create instanceof Function;
        if ( ! isFactoryObject ) {
            throw new Error(
            "The definition must have a correct target!: id=" + id + ", definition=" + def);
        }

        this.definitions[id] = def;

        return this;
    },

    get : function (id, arg /* can be null! */) {
        Assert.notNullAll(this, [
            [ id, "id" ]
        ]);

        var recursiveRefFound = this.routeStack.indexOf(id) > -1;
        recursiveRefFound && this.doThrow("The recursive reference found: route=" + this.routeStack);

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
                if ( isSingleton ) {
                    this.singletons[id] = component;
                }

                return component;
            }

            this.parent == null && this.doThrow("target factory not found: id=" + id);
            var component = this.parent.get(id, arg);
            component == null && this.doThrow("target factory not found: id=" + id);

            return component;
        } finally {
            this.routeStack.pop();
        }
    },

    doThrow : function (msg) {
        Assert.notNull(this, msg, "msg");
        throw new Error(msg);
    },

    toString : function () {
        return "id: " + this.id;
    }
};