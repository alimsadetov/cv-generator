export interface HttpExceptionMessage {
  statusCode: number;
  field: string | string[];
  message: string;
  error: string;
}
