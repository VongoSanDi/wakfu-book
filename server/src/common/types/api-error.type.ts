export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
  parameters?: { [key: string]: any };
  stackLocation?: string;
}
