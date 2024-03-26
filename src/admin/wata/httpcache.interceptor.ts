import { ExecutionContext, Injectable } from '@nestjs/common';
import { CACHE_KEY_METADATA, CacheInterceptor } from '@nestjs/cache-manager';

export const CACHE_TTL = 0;
export const WATA_CACHEKEY = 'GET_WATA_CACHE';
export const PUBLISH_WATA_CACHEKEY = 'GET_PUBLISH_WATA_CACHE';
export const KEYWORD_CACHEKEY = 'GET_KEYWORD_CACHE';
export const KEYWORDS_CACHEKEY = 'GET_KEYWORDS_CACHE';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const cacheKey = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    if (cacheKey) {
      const request = context.switchToHttp().getRequest();
      return `${cacheKey}-${request._parsedUrl.query}`;
    }
    return super.trackBy(context);
  }
}
