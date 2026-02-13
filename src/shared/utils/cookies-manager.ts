import Cookies from 'js-cookie';
import { GetServerSidePropsContext, NextPageContext } from 'next';

const TOKEN_KEY = 'SESSION_ACCESS_TOKEN';

export class CookiesManager {
  /**
   * Lado del Cliente: Guarda el token por 1 hora
   */
  static setSessionToken(token: string) {
    // expires: 1/24 significa 1 hora (js-cookie usa días por defecto)
    Cookies.set(TOKEN_KEY, token, {
      expires: 1 / 24,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  /**
   * Lado del Servidor y Cliente: Obtiene el token
   */
  static getAccessToken(context?: GetServerSidePropsContext | NextPageContext): string | undefined {
    // Si estamos en el SERVIDOR (SSR)
    if (context?.req?.headers?.cookie) {
      const cookieHeader = context.req.headers.cookie;
      const cookies = Object.fromEntries(cookieHeader.split('; ').map((c) => c.split('=')));
      return cookies[TOKEN_KEY];
    }

    // Si estamos en el CLIENTE (Navegador)
    return Cookies.get(TOKEN_KEY);
  }

  /**
   * Borra la sesión
   */
  static clearAll() {
    Cookies.remove(TOKEN_KEY, { path: '/' });
  }
}
