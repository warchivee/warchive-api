export interface KakaoToken {
  access_token: string;
  token_type: TokenType;
  refresh_token: string;
  expires_in: number;
  refresh_token_expires_in: number;
}

export type TokenType = 'bearer';
