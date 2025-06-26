export class LastRecentlyUsed<Value = unknown> extends Map<string, Value> {
    readonly maxSize: number;

    constructor(maxSize: number) {
        super();
        this.maxSize = maxSize;
    }

    override set(key: string, value: Value) {
        if (super.has(key)) super.delete(key);
        
        super.set(key, value);
        
        if (super.size > this.maxSize) {
            this.delete(this.keys().next().value);
        }
        return this;
    }
}

export const promiseCache = /*#__PURE__*/ new LastRecentlyUsed<Promise<unknown>>(8192);

type dedupeOptions = {
  enabled?: boolean
  id?: string
}

export function withDedupe<T>(
  fn: () => Promise<T>,
  { enabled = true, id }: dedupeOptions
): Promise<T> {
  if (!enabled || !id) return fn();

  const cached = promiseCache.get(id);
  if (cached) return cached as Promise<T>;

  const promise = fn();
  promiseCache.set(id, promise);
  
  promise
    .then(() => promiseCache.delete(id))
    .catch(() => promiseCache.delete(id));
  
  return promise;
}
