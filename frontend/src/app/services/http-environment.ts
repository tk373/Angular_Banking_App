import { HttpHeaders } from '@angular/common/http';

export function getHeaders(token?: string, hasBody = true) {
  const httpHeaders: Record<string, string> = { };

  if (hasBody) { httpHeaders ['Content-Type'] = 'application/json'; }
  if (token) { httpHeaders['Authorization'] = `Bearer ${token}`; }

  return {
    headers: new HttpHeaders(httpHeaders)
  };
}

export function getServerUrl(path: string) {
  // should be placed in the environment file
  return `http://localhost:3000${path}`;
}