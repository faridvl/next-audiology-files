// shared/utils/cookies-manager.ts

export class CookiesManager {
    static setCookie(name: string, value: string, days: number) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    }

    static getCookie(name: string): string | null {
        const cookieName = `${name}=`;
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');

        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i].trim();
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }

        return null;
    }

    static deleteCookie(name: string) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}
