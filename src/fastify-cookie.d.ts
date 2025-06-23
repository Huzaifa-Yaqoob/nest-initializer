import 'fastify';

declare module 'fastify' {
  interface FastifyReply {
    /**
     * Sets a cookie on the response.
     */
    setCookie(
      name: string,
      value: string,
      options?: FastifyCookieOptions,
    ): this;

    /**
     * Clears a cookie on the response.
     */
    clearCookie(name: string, options?: FastifyCookieOptions): this;
  }

  interface FastifyRequest {
    /**
     * Parsed cookies from the request.
     */
    cookies: {
      [cookieName: string]: string;
    };
  }

  interface FastifyCookieOptions {
    domain?: string;
    encode?: (value: string) => string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
    secure?: boolean;
    signed?: boolean;
  }
}
