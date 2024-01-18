export interface ApiResponse<T = any> {
  success: boolean;
  result: T;
}
