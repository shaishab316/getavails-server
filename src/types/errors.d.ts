export type TErrorMessage = {
  path: string | number;
  message: string;
};

export type TErrorHandler = {
  success: boolean;
  statusCode: number;
  message: string;
  errorMessages: TErrorMessage[];
};
