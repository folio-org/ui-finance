/**
 * Tiny synchronous EventEmitter optimized for frequent emits.
 * Listeners are stored per-event; wildcard '*' listeners receive (event, ...args).
 */
export default class Emitter {
  constructor() {
    this.map = new Map();
  }

  on(event, fn) {
    const s = this.map.get(event) || new Set();

    s.add(fn);
    this.map.set(event, s);

    return () => this.off(event, fn);
  }

  off(event, fn) {
    const s = this.map.get(event);

    if (!s) return;
    s.delete(fn);
    if (s.size === 0) this.map.delete(event);
  }

  emit(event, ...args) {
    const s = this.map.get(event);

    console.log('emit', event, args);

    if (s) {
      Array.from(s).forEach(fn => {
        try { fn(...args); } catch (e) {}
      });
    }
    const gw = this.map.get('*');

    if (gw) Array.from(gw).forEach(fn => { try { fn(event, ...args); } catch (e) {} });
  }
}
