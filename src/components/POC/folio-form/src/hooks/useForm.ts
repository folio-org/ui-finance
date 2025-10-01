/**
 * Folio Form - useForm hook
 * 
 * Main hook for form management with uncontrolled inputs
 */

import { useRef, useCallback, useMemo, useEffect, useState } from 'react';
import { FormEngine } from '../core/FormEngine';
import { 
  FieldValues, 
  FieldPath, 
  FieldPathValue, 
  FieldError, 
  UseFormReturn, 
  FormOptions,
  ValidationRules 
} from '../types';

/**
 * Main form hook
 */
export function useForm<T extends FieldValues = FieldValues>(
  options: FormOptions<T> = {}
): UseFormReturn<T> {
  // Create form engine instance
  const engineRef = useRef<FormEngine<T> | null>(null);
  
  if (!engineRef.current) {
    engineRef.current = new FormEngine<T>(options.defaultValues, options);
  }

  const engine = engineRef.current;

  // Form state
  const [formState, setFormState] = useState(() => engine.getFormState());

  // Update form state when engine state changes
  useEffect(() => {
    const unsubscribe = engine.on('change', () => {
      setFormState(engine.getFormState());
    });

    const unsubscribeValidation = engine.on('validation', () => {
      setFormState(engine.getFormState());
    });

    const unsubscribeSubmit = engine.on('submit', () => {
      setFormState(engine.getFormState());
    });

    const unsubscribeReset = engine.on('reset', () => {
      setFormState(engine.getFormState());
    });

    return () => {
      unsubscribe();
      unsubscribeValidation();
      unsubscribeSubmit();
      unsubscribeReset();
    };
  }, [engine]);

  // ============================================================================
  // FIELD METHODS
  // ============================================================================

  const register = useCallback(<K extends FieldPath<T>>(
    name: K,
    rules?: ValidationRules<T>[K]
  ) => {
    return engine.register(name, rules);
  }, [engine]);

  const unregister = useCallback((name: FieldPath<T>) => {
    engine.unregister(name);
  }, [engine]);

  const setValue = useCallback(<K extends FieldPath<T>>(
    name: K,
    value: FieldPathValue<T, K>,
    options: { shouldValidate?: boolean; shouldDirty?: boolean; shouldTouch?: boolean } = {}
  ) => {
    engine.setValue(name, value, options);
  }, [engine]);

  const getValue = useCallback(<K extends FieldPath<T>>(name: K): FieldPathValue<T, K> => {
    return engine.getValue(name);
  }, [engine]);

  const getValues = useCallback(() => {
    return engine.getValues();
  }, [engine]);

  const setError = useCallback((name: FieldPath<T>, error: FieldError) => {
    engine.setError(name, error);
  }, [engine]);

  const clearErrors = useCallback((name?: FieldPath<T> | FieldPath<T>[]) => {
    engine.clearErrors(name);
  }, [engine]);

  const trigger = useCallback(async (name?: FieldPath<T> | FieldPath<T>[]): Promise<boolean> => {
    return engine.trigger(name);
  }, [engine]);

  const reset = useCallback((values?: Partial<T>) => {
    engine.reset(values);
  }, [engine]);

  const handleSubmit = useCallback((onSubmit: (data: T) => void | Promise<void>) => {
    return (e?: React.BaseSyntheticEvent) => {
      if (e) {
        e.preventDefault();
      }
      return engine.handleSubmit(onSubmit);
    };
  }, [engine]);

  const watch = useCallback(<K extends FieldPath<T>>(name?: K | K[]) => {
    return engine.watch(name);
  }, [engine]);

  // ============================================================================
  // FIELD ARRAY METHODS (simplified for now)
  // ============================================================================

  const append = useCallback((value: any) => {
    // TODO: Implement field array append
    console.warn('Field array methods not implemented yet');
  }, []);

  const prepend = useCallback((value: any) => {
    // TODO: Implement field array prepend
    console.warn('Field array methods not implemented yet');
  }, []);

  const insert = useCallback((index: number, value: any) => {
    // TODO: Implement field array insert
    console.warn('Field array methods not implemented yet');
  }, []);

  const swap = useCallback((indexA: number, indexB: number) => {
    // TODO: Implement field array swap
    console.warn('Field array methods not implemented yet');
  }, []);

  const move = useCallback((from: number, to: number) => {
    // TODO: Implement field array move
    console.warn('Field array methods not implemented yet');
  }, []);

  const update = useCallback((index: number, value: any) => {
    // TODO: Implement field array update
    console.warn('Field array methods not implemented yet');
  }, []);

  const remove = useCallback((index: number | number[]) => {
    // TODO: Implement field array remove
    console.warn('Field array methods not implemented yet');
  }, []);

  const replace = useCallback((values: any[]) => {
    // TODO: Implement field array replace
    console.warn('Field array methods not implemented yet');
  }, []);

  // ============================================================================
  // RETURN VALUE
  // ============================================================================

  return useMemo(() => ({
    // Field methods
    register,
    unregister,
    setValue,
    getValue,
    getValues,
    setError,
    clearErrors,
    trigger,
    reset,
    handleSubmit,
    
    // Form state
    formState,
    watch,
    
    // Field array methods
    append,
    prepend,
    insert,
    swap,
    move,
    update,
    remove,
    replace,
  }), [
    register,
    unregister,
    setValue,
    getValue,
    getValues,
    setError,
    clearErrors,
    trigger,
    reset,
    handleSubmit,
    formState,
    watch,
    append,
    prepend,
    insert,
    swap,
    move,
    update,
    remove,
    replace,
  ]);
}
