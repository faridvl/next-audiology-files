if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const isObfuscated = (error: unknown): boolean => {
    if (!error || typeof error !== 'object') return false;
    const stack = (error as Error).stack ?? '';
    const message = (error as Error).message ?? '';
    return stack.includes('_0x') || message.includes('_0x');
  };

  // window.onerror — errores síncronos
  const originalOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (isObfuscated(error) || String(message).includes('_0x')) return true;
    return originalOnError ? originalOnError.apply(window, [message, source, lineno, colno, error]) : false;
  };

  // unhandledrejection — promesas rechazadas (Next.js dev overlay las escucha aquí)
  window.addEventListener('unhandledrejection', (event) => {
    if (isObfuscated(event.reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true); // capture: true para interceptar antes que el handler de Next.js

  // error event — algunos navegadores lo disparan en lugar de onerror
  window.addEventListener('error', (event) => {
    if (isObfuscated(event.error) || String(event.message).includes('_0x')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
}
