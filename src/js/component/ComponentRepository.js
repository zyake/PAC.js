
/**
 *  A central repository to manage components.
 *
 * 	A component can be registered as a factory basis, and
 *	the component will be instantiated when it retrieved at first time.
 *	The component instance will be cached in the repository.
 *
 * If you want to refer to other repository managed components,
 * you can refer to them using a get method in the factory method context.
 *
 * - for example
 * var repository = ComponentRepository.create();
 * repository.defineFactories({
 *   "id": function() { return "ID-1" },
 *   "defaultName": function() { return this.get("id") + "-001" }
 * });
 *
 * // The value "ID-1-001" will be showed.
 * alert(repository.get("defaultName"));
 *
 * The central repository also supports hierarchical event propagating mechanism,
 * which can be used to notify a event data to parent repositories that
 * can manage a whole application configuration.
 */
ComponentRepository = {

    create: function(parent) {
        var repository = Object.create(this, {
            components: { value: {} },
            factories: { value: {} },
            events: { value: {} },
            children: { value: [] },
            routeStack: { value: [] },
            parent: { value: parent }
        });
        repository.initialize();

        return repository;
    },

    initialize: function() {
        this.parent != null && this.parent.children.push(this);
    },

    defineFactories: function(def) {
        for (id in def ) {
            this.addFactory(id, def[id]);
        }
    },

    addFactory: function(id, factory, eventRefs) {
        this.factories[id] != null && this.doThrow("duplicated id: id=" + id);
        this.factories[id] = factory;
        eventRefs && eventRefs.forEach(function(eventRef) {
            this.events[eventRef] || (this.events[eventRef] = []);
            if ( this.events[eventRef].indexOf(id) == -1 ) {
                this.events[eventRef].push(id);
            }
        }, this);
    },

    addEventRef: function(id, eventRef) {
        this.events[eventRef] || (this.events[eventRef] = []);
        this.events[eventRef].push(id);
    },

    removeEventRef: function(id, eventRef) {
        delete this.events[eventRef][id];
    },

    raiseEvent: function(event, caller, args) {
        var noRefsFound = this.events[event] == null;
        if ( noRefsFound ) {
            return;
         }

        var listeners = this.events[event];
        listeners.forEach(function(listenerId) { this.get(listenerId).notify(event, args); }, this);

        var parentShouldBeCalled = this.parent != null && this.parent != caller;
        parentShouldBeCalled && this.parent.raiseEvent(event, this, args);
        this.children.forEach(function(child) { child != caller && child.raiseEvent(event, this, args); }, this);
    },

    get: function(id, arg) {
        var recursiveRefFound = this.routeStack.indexOf(id) > -1;
        recursiveRefFound && this.doThrow("The recursive reference found: route=" + this.routeStack);

        try {
            this.routeStack.push(id);
            if ( this.components[id] != null ) {
                return  this.components[id];
            }

            var targetFactory = this.factories[id];
            if ( targetFactory  != null ) {
                var newComponent = targetFactory.call(this, id, arg);
                this.components[id] = newComponent;
                return newComponent;
            }

            this.parent == null && this.doThrow("target factory not found: id=" + id);
            var component = this.parent.get(id, arg);
            component == null && this.doThrow("target factory not found: id=" + id);

            return component;
        } finally {
            this.routeStack.pop();
        }
    },

    doThrow: function(msg) {
        throw new Error(msg);
    }
};