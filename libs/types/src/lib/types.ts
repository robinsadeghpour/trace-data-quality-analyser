export type RequestBody<T> = Omit<T, '_id' | 'created_at' | 'updated_at'>;
