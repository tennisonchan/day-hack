class EventEmitter {
  constructor() {
    this.events = {};
  }

  on (eventName, handler) {
    if (this.events[eventName] === undefined) {
      this.events[eventName] = [handler];
    } else {
      this.events[eventName].push(handler);
    }
  }

  emit(eventName) {
    let handlers = this.events[eventName];

    if (!handlers) return;

    let args = [].slice.call(arguments, 1);

    for (let handler of handlers) {
      handler.apply(this, args);
    }
  }

  removeHandler(eventName, handler) {
    let handlers = this.events[eventName];

    if (!handlers) return;

    let i = handlers.indexOf(handler);

    if (i !== -1) {
      handlers.splice(i, 1);
    }
  }

  once (eventName, handler) {
    this.on(eventName, function fn() {
      this.removeHandler(eventName, fn);
      handler.apply(this, [].slice.call(arguments));
    })
  }
}

exports = module.exports = EventEmitter;