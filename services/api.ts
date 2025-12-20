
import { Item, User } from '../types';

const BASE_URL = 'https://final2025python-main.onrender.com';

class APIService {
  private token: string | null = localStorage.getItem('token');
  private apiPrefix: string = localStorage.getItem('api_prefix') || '';

  setToken(token: string) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  setPrefix(prefix: string) {
    const cleanPrefix = prefix === '/' ? '' : prefix.replace(/\/+$/, '');
    if (this.apiPrefix !== cleanPrefix) {
      this.apiPrefix = cleanPrefix;
      localStorage.setItem('api_prefix', cleanPrefix);
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('api_prefix');
    this.apiPrefix = '';
  }

  private cleanPath(path: string) {
    return path.replace(/^\/+/, '').replace(/\/+$/, '');
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const activeToken = this.getToken();
    const headers = new Headers(options.headers);
    
    if (activeToken) {
      headers.set('Authorization', `Bearer ${activeToken}`);
    }
    
    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const cleanEndpoint = this.cleanPath(endpoint);
    const prefixes = [this.apiPrefix, '/api/v1', '/api', ''];
    const uniquePrefixes = Array.from(new Set(prefixes));

    for (const pref of uniquePrefixes) {
      const baseUrlWithPref = pref === '' ? BASE_URL : `${BASE_URL}/${this.cleanPath(pref)}`;
      const urls = [`${baseUrlWithPref}/${cleanEndpoint}/`, `${baseUrlWithPref}/${cleanEndpoint}`];

      for (const url of urls) {
        try {
          const response = await fetch(url, { ...options, headers });
          
          if (response.status !== 404) {
            this.setPrefix(pref);
            if (response.ok) return await response.json();
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Error ${response.status}`);
          }
        } catch (e: any) {
          if (e.name === 'TypeError') {
            // Este error ocurre cuando el navegador bloquea la petición (CORS) o el servidor está caído
            console.error("[CORS/Network Error] La petición fue bloqueada o el servidor no responde.");
            throw new Error("ERROR DE CONEXIÓN: Verifica que el backend tenga habilitado CORS (CORSMiddleware) y que el servidor de Render esté encendido.");
          }
          if (e.message.includes('Error 404')) continue;
          throw e;
        }
      }
    }
    throw new Error(`Ruta no encontrada: ${endpoint}. Revisa los logs de Render.`);
  }

  async login(formData: FormData) {
    if (!formData.has('grant_type')) formData.append('grant_type', 'password');

    // Intentamos despertar al servidor primero con una petición simple
    try { await fetch(BASE_URL, { mode: 'no-cors' }); } catch (e) {}

    const loginEndpoints = ['/token', '/api/v1/login/access-token', '/login/access-token'];
    
    for (const path of loginEndpoints) {
      try {
        const url = `${BASE_URL}/${this.cleanPath(path)}`;
        const response = await fetch(url, { method: 'POST', body: formData });

        if (response.ok) {
          const data = await response.json();
          this.setToken(data.access_token);
          this.setPrefix(path.includes('/api/v1') ? '/api/v1' : '');
          return data;
        }
        if (response.status === 401) throw new Error('Usuario o contraseña incorrectos.');
      } catch (e: any) {
        if (e.message.includes('Usuario') || e.message.includes('contraseña')) throw e;
        if (e.name === 'TypeError') throw new Error("BLOQUEO DE CORS: El servidor rechazó la conexión. Debes configurar CORSMiddleware en Python.");
        continue;
      }
    }
    throw new Error('El backend de Render no responde. Puede que esté arrancando o necesite configuración CORS.');
  }

  async register(userData: any): Promise<User> {
    return await this.fetchWithAuth('users', { 
      method: 'POST', 
      body: JSON.stringify({
        email: userData.username,
        password: userData.password,
        full_name: userData.full_name || userData.username.split('@')[0],
        is_active: true
      }) 
    });
  }

  async getCurrentUser(): Promise<User> {
    try { return await this.fetchWithAuth('users/me'); } 
    catch { return await this.fetchWithAuth('me'); }
  }

  async getItems(): Promise<Item[]> {
    try {
      const data = await this.fetchWithAuth('items');
      return Array.isArray(data) ? data : (data.items || []);
    } catch { return []; }
  }

  async createItem(item: Partial<Item>): Promise<Item> {
    return this.fetchWithAuth('items', { 
      method: 'POST', 
      body: JSON.stringify({
        title: item.title,
        description: item.description,
        price: item.price || 0,
        category: item.category || 'General',
        image_url: item.image_url || '',
        stock_quantity: item.stock_quantity || 0,
        status: 'completed'
      }) 
    });
  }
}

export const api = new APIService();
