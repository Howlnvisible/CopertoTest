export type ApiSuccess<T> = {
  data: T;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
  };
};
