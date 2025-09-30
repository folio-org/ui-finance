import Emitter from './Emitter';
import { getByPath, deepEqual, setByPath } from './utils';

/**
 * FormEngine: core mutable store for values, meta and validators.
 * Emits events on path changes: 'change:field.path', 'error:field.path', array events etc.
 */
export default class FormEngine {
  constructor(initialValues = {}) {
    this.values = initialValues;
    this.touched = new Set();
    this.active = null;
    this.errors = {};
    this.emitter = new Emitter();
    this.validators = new Map();
  }

  getValues() { return this.values; }

  get(path) { return getByPath(this.values, path); }

  set(path, value, opts = {}) {
    setByPath(this.values, path, value);

    if (!opts.silent) {
      this.emitter.emit(`change:${path}`, value, this.values);
      this.emitter.emit('change', path, value, this.values);
    }
    const vlist = this.validators.get(path);

    if (vlist) {
      for (const v of vlist) {
        try {
          const res = v(value, this.values);

          this.errors[path] = res;
          this.emitter.emit(`error:${path}`, res);
        } catch (e) {
          this.errors[path] = e;
          this.emitter.emit(`error:${path}`, e);
        }
      }
    }
  }

  subscribe(pathOrStar, cb) {
    if (pathOrStar === '*') return this.emitter.on('*', cb);

    return this.emitter.on(`change:${pathOrStar}`, cb);
  }

  subscribeMeta(path, cb) {
    return this.emitter.on(`error:${path}`, cb);
  }

  /**
   * subscribeSelector(selector, cb)
   *
   * Run selector(values) on each change and call cb(next, meta) only when output changes.
   * This is efficient for expensive selectors because comparison happens inside engine.
   */
  subscribeSelector(selector, cb) {
    // selector: (values) => any
    let last = selector(this.getValues());
    const wrapped = (evt, path, values) => {
      try {
        const next = selector(values);

        if (!deepEqual(next, last)) {
          last = next;
          cb(next, { evt, path, values });
        }
      } catch (e) {
        // swallow or rethrow in dev
        console.error('selector error', e);
      }
    };
    const unsub = this.subscribe('*', wrapped);

    // call immediately with current
    cb(last, { evt: 'init', path: null, values: this.getValues() });

    return unsub;
  }

  registerValidator(path, fn) {
    const list = this.validators.get(path) || [];

    list.push(fn);
    this.validators.set(path, list);

    return () => {
      const l = this.validators.get(path) || [];

      this.validators.set(path, l.filter(x => x !== fn));
    };
  }

  touch(path) {
    this.touched.add(path);
    this.emitter.emit(`touch:${path}`, true);
  }

  isTouched(path) { return this.touched.has(path); }

  focus(path) {
    this.active = path;
    this.emitter.emit('focus', path);
  }

  blur() {
    const prev = this.active;

    this.active = null;
    this.emitter.emit('blur', prev);
  }

  push(path, item) {
    const arr = this.get(path) || [];

    arr.push(item);
    this.set(path, arr);
    this.emitter.emit(`array:${path}`, arr);
  }

  removeAt(path, index) {
    const arr = this.get(path) || [];

    arr.splice(index, 1);
    this.set(path, arr);
    this.emitter.emit(`array:${path}`, arr);
  }
}
