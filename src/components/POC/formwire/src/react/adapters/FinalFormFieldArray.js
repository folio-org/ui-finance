import { useMemo } from 'react';

import { uid } from '../../core/utils';
import { useFormEngine } from '../FormContext';

/**
 * FinalFormFieldArray: lightweight helper to manage arrays in the engine.
 * It exposes push/removeAt and renders children with array helpers.
 */
export default function FinalFormFieldArray({ name, children }) {
  const engine = useFormEngine();

  const arr = useMemo(() => engine.get(name) || [], [engine, name]);

  const helpers = useMemo(() => ({
    push: (item) => engine.push(name, item),
    removeAt: (index) => engine.removeAt(name, index),
  }), [engine, name]);

  // Provide stable ids when rendering rows externally
  const items = useMemo(() => arr.map(item => ({ ...item, __id: item.__id || uid() })), [arr]);

  return typeof children === 'function' ? children({ fields: items, meta: {}, helpers }) : null;
}
