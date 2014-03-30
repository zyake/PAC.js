/**
 * A builder object to create event id.
 *
 * You can build event id that refers to other components in the same control.
  * Using the id object, you can remove string id literal from your code.
 *
 * - for example
 * this.referEvent(this.id, Id.onAbstraction(this).load());
 *
 * In the former example, you can determine the id of the abstraction
 * that resides in the same control on the presentation.
 * And the format of the id string is following.
 * ${WIDGET_ID}.${CONTROL_ID}.[${PRESENTATION_ID} | ${ABSTRACTION_ID}].${ACTION_CODE}
 */
Id = {

    idString: "",

    onAbstraction: function(target) {
      Assert.notNull(this, target, "target");

      var id = Object.create(this, {
        target: { value: target },
        idString: { value: "", writable: true, configurable: true } });

      if ( Presentation.isPrototypeOf(target) ) {
        id.idString = target.control.widget.id;
        id.idString += "." + target.control.id;
        id.idString += "." + target.control.abstraction.id;
      } else if ( AbstractionProxy.isPrototypeOf(target) ) {
        id.idString += target.control.widget.id;
        id.idString += ("." + target.control.id);
        id.idString += ("." + target.control.abstraction.id);
      } else if ( Control.isPrototypeOf(target) ) {
        id.idString = target.widget.id;
        id.idString += ("." + target.id);
        id.idString += ("." + target.abstraction.id);
      } else {
        throw new Error("invalid target:" + target);
      }

      return id;
    },

    onPresentation: function(target) {
      Assert.notNull(this, target, "target");

      var id = Object.create(this, {
        target: { value: target },
        idString: { value: "", writable: true, configurable: true } });
        
      if ( Presentation.isPrototypeOf(target) ) {
        id.idString = target.control.widget.id;
        id.idString += ("." + target.control.id);
        id.idString += ("." + target.control.presentation.id);
      } else if ( AbstractionProxy.isPrototypeOf(target) ) {
        id.idString = target.control.widget.id;
        id.idString += ("." + target.control.id);
        id.idString += ("." + target.control.presentation.id);
      } else if ( Control.isPrototypeOf(target) ) {
        id.idString = target.widget.id;
        id.idString += ("." + target.id);
        id.idString += ("." + target.presentation.id);
      } else {
        throw new Error("invalid target:" + target);
      }
      return id;
    },

    onThis: function(target) {
        Assert.notNull(this, target, "target");

        if ( Presentation.isPrototypeOf(target) ) {
            return Id.onPresentation(target);
        } else if ( AbstractionProxy.isPrototypeOf(target) ) {
            return Id.onAbstraction(target);
        } else {
            throw new Error("invalid target:" + target);
        }
    },

    load: function() {
        return this.idString + ".load";
    },

    failed: function() {
        return this.idString + ".failed";
    },

    start: function() {
        return this.idString + ".start";
    },

    change: function() {
        return this.idString + ".change";
    },

    failure: function() {
        return this.idString + ".failure";
    },

    checkAction: function(target, event) {
        Assert.notNullAll(this, [ [ target, "target" ], [ event, "event" ] ]);
        return target.endWith(event.idString);
    },

    on: function(idStr) {
        Assert.notNull(this, idStr, "idStr");

        var id = Object.create(this, {
        idString: { value: "", writable: true, configurable: true } });
        id.idString = idStr;

        return id;
    },

    getAction: function(event) {
        var separatorIndex = event.lastIndexOf(".");
        if ( separatorIndex < 0 ) {
            throw new Error("separator couldn't find!: event=" + event);
        }
        var action = event.substring(separatorIndex);

        return action;
    },

    toString: function() {
        return "idString: " + this.idString + ", target: " + this.target;
    }
}