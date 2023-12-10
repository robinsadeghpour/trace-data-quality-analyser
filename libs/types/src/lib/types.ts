export type RequestBody<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;
