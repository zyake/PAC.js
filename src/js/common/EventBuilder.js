
/**
 * An event builder object that can define view and model events by fluent interface.
 *
 * # Basics
 * EventBuilder is a convenient object to reference and raise events by its fluent interface.
 * Using EventBuilder, you can eliminate string id literals and shorten lines of code.
 *
 * It has two main functions.
 * - Reference API -> reference the other side object(Presentation -> Abstraction or Abstraction -> Presentation)
 *  - you can start with the "ref" method.
 * - Invocation API -> raise an event
 *  - you can start with the "raise" method.
 *
 * # How to use
 *
 * ## Reference API
 *
 * ```javascript
 *  // create an event builder object.
 * var builder = EventBuilder.create(target);
 *
 *  // refer to other side object and register a callback function.
 *  // If the target is an abstraction object, you should use "onPresentation" instead.
 *  builder.ref().onAbstraction().load(this.load);
 * ```
 *
 * ## Invocation API
 *
 * ```javascript
 *  // create an event builder object.
 * var builder = EventBuilder.create(target);
 *
 * // raise an event with an argument.
 * builder.raise().load({ time: new Date() });
 * ```
 */
this.EventBuilder = {

    REF_INVOKER : {

        target : null,
        id : null,
        builder : null,

        load : function (handler) {
            this.target.control.addEventRef(this.id.load(), this.target);
            this.builder.eventMap[this.id.load()] = handler;
            return this.builder;
        },

        start : function (handler) {
            this.target.control.addEventRef(this.id.start(), this.target);
            this.builder.eventMap[this.id.start()] = handler;
            return this.builder;
        },

        change : function (handler) {
            this.target.control.addEventRef(this.id.change(), this.target);
            this.builder.eventMap[this.id.change()] = handler;
            return this.builder;
        },

        failure : function (handler) {
            this.target.control.addEventRef( this.id.failure(), this.target);
            this.builder.eventMap[this.id.failure()] = handler;
            return this.builder;
        },

        other : function (handler) {
            this.target.control.addEventRef(this.id.other(),  this.target);
            this.builder.eventMap[this.id.other()] = handler;
            return this.builder;
        }
    },

    RAISE_INVOKER : {

        target : null,
        id : null,
        builder : null,

        load : function (args) {
            Assert.notNullAll(this, [
                [ args, "args"]
            ]);
            this.target.control.raiseEvent(this.id.load(), this.target, args);
            return this.builder;
        },

        start : function (args) {
            Assert.notNullAll(this, [
                [ args, "args"]
            ]);
            this.target.control.raiseEvent(this.id.start(), this.target, args);
            return this.builder;
        },

        change : function (args) {
            Assert.notNullAll(this, [
                [ args, "args"]
            ]);
            this.target.control.raiseEvent(this.id.change(), this.target, args);
            return this.builder;
        },

        failure : function (args) {
            Assert.notNullAll(this, [
                [ args, "args"]
            ]);
            this.target.control.raiseEvent(this.id.failure(), this.target, args);
            return this.builder;
        },

        other : function (args) {
            Assert.notNullAll(this, [
                [ args, "args"]
            ]);
            this.target.control.raiseEvent(this.id.other(), this.target, args);
            return this.builder;
        }
    },

    /**
     * Create a new EventBuilder object.
     *
     * @param target The target object(Presentation or AbstractionProxy)
     */
    create : function (target) {
        Assert.notNullAll(this, [
            [ target, "target"]
        ]);
        Assert.notNull(this, target, "target");

        var builder = Object.create(this,
            { target : { value : target }, eventMap : { value : [] } });
        Object.seal(builder);

        return builder;
    },

    /**
     * Start a reference method chain.
     *
     * @returns {{target: *, onAbstraction: onAbstraction, onPresentation: onPresentation, on: on}}
     */
    ref : function () {
        var me = this;
        return {

            target : this.target,

            onAbstraction : function () {
                return Object.create(EventBuilder.REF_INVOKER,
                    { target : { value : this.target }, builder : { value : me },
                        id : { value : Id.onAbstraction(this.target) } });
            },

            onPresentation : function () {
                return Object.create(EventBuilder.REF_INVOKER,
                    { target : { value : this.target }, builder : { value : me },
                        id : { value : Id.onPresentation(this.target) } });
            },

            on : function (event) {
                Assert.notNullAll(this, [
                    [ event, "event"]
                ]);
                return Object.create(EventBuilder.REF_INVOKER,
                    { target : { value : this.target }, builder : { value : me },
                        id : { value : Id.on(event) } });
            }
        };
    },

    /**
     * Start a raise method chain.
     *
     * @returns {EventBuilder.RAISE_INVOKER}
     */
    raise : function () {
        var me = this;
        var raise = Object.create(EventBuilder.RAISE_INVOKER, {
            target : { value : this.target }, builder : { value : me },
            id : { value : Id.onThis(this.target) }
        });
        Object.seal(raise);

        return raise;
    },

    /**
     * Handle events with registered callbacks.
     *
     * @param id The event id.
     * @param arg The argument.
     */
    handle : function (id, arg) {
        if ( this.eventMap[id] != null ) {
            this.eventMap[id].call(this.target, arg, id);
        } else {
            this.eventMap[Id.other()] && this.eventMap[Id.other()].call(this.target, arg, id);
        }
    }
};

Object.seal(this.EventBuilder);
