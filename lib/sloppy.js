/* Domino uses sloppy-mode features (in particular, `with`) for a few
 * minor things.  This file encapsulates all the sloppiness; every
 * other module should be strict. */
/* jshint strict: false */
/* jshint evil: true */
/* jshint -W085 */
function* executionContext(global) {
  with (global) {
    while(true) {
      eval(yield);
    }
  }
}

module.exports = {
  buildExecutionContext(global) {
    var context = executionContext.call({}, global);
    context.next(); // Run to the first yield, so the context is initially ready.
    return context;
  },
  EventHandlerBuilder_build: function build() {
    try {
      with(this.document.defaultView || Object.create(null))
        with(this.document)
          with(this.form)
            with(this.element)
              return eval("(function(event){" + this.body + "})");
    }
    catch (err) {
      return function() { throw err; };
    }
  }
};
