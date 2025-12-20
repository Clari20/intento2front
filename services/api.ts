
import { Item, User } from '../types';

const BASE_URL = 'https://final2025python-main.onrender.com';

class APIService {
  private token: string | null = localStorage.getItem('token');
  // Por defecto probamos sin prefijo, ya que muchos backends en Render se despliegan en el root
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
      console.log(`[TechStore API] Ruta base establecida: "${cleanPrefix || '(root)'}"`);
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
    
    // Lista de prefijos para probar si el actual falla con 404
    const prefixes = [this.apiPrefix, '/api/v1', '/api', ''];
    const uniquePrefixes = Array.from(new Set(prefixes));

    for (const pref of uniquePrefixes) {
      const baseUrlWithPref = pref === '' ? BASE_URL : `${BASE_URL}/${this.cleanPath(pref)}`;
      
      // Intentar con y sin barra final (FastAPI es sensible a esto)
      const urls = [
        `${baseUrlWithPref}/${cleanEndpoint}`,
        `${baseUrlWithPref}/${cleanEndpoint}/`
      ];

      for (const url of urls) {
        try {
          const response = await fetch(url, { ...options, headers });
          
          if (response.status !== 404) {
            // Si el servidor responde algo que no es 404, guardamos este prefijo
            this.setPrefix(pref);
            
            if (response.ok) {
              return await response.json();
            }
            
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
          }
        } catch (e: any) {
          // Si es un error de red o 404, seguimos probando
          if (e.message.includes('Error 404') || e.name === 'TypeError') continue;
          throw e;
        }
      }
    }

    throw new Error(`No se pudo encontrar el recurso: ${endpoint}. Verifica la conexión con Render.`);
  }

  async login(formData: FormData) {
    // Aseguramos que grant_type esté presente (estándar OAuth2)
    if (!formData.has('grant_type')) {
      formData.append('grant_type', 'password');
    }

    const loginEndpoints = [
      '/token',
      '/api/v1/login/access-token',
      '/login/access-token',
      '/api/login/access-token',
      '/api/token'
    ];
    
    for (const path of loginEndpoints) {
      try {
        const url = `${BASE_URL}/${this.cleanPath(path)}`;
        console.log(`[TechStore API] Intentando login en: ${url}`);
        
        const response = await fetch(url, { 
          method: 'POST', 
          body: formData 
        });

        if (response.ok) {
          const data = await response.json();
          this.setToken(data.access_token);
          
          // Deducir prefijo del sistema basado en el login exitoso
          let prefix = '';
          if (path.includes('/api/v1')) prefix = '/api/v1';
          else if (path.includes('/api')) prefix = '/api';
          
          this.setPrefix(prefix);
          return data;
        }
        
        if (response.status === 401 || response.status === 422) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.detail || 'Credenciales inválidas o formato incorrecto.');
        }
      } catch (e: any) {
        if (e.message.includes('Credenciales') || e.message.includes('formato')) throw e;
        continue;
      }
    }
    throw new Error('El servicio de autenticación no respondió. Render podría estar reiniciándose.');
  }

  async register(userData: any): Promise<User> {
    const payload = {
      email: userData.username,
      password: userData.password,
      full_name: userData.full_name || userData.username.split('@')[0],
      is_active: true
    };

    return await this.fetchWithAuth('users', { 
      method: 'POST', 
      body: JSON.stringify(payload) 
    });
  }

  async getCurrentUser(): Promise<User> {
    try {
      return await this.fetchWithAuth('users/me');
    } catch (e) {
      // Fallback común en algunas plantillas
      return await this.fetchWithAuth('me');
    }
  }

  async getItems(): Promise<Item[]> {
    try {
      const data = await this.fetchWithAuth('items');
      return Array.isArray(data) ? data : (data.items || []);
    } catch (e: any) {
      console.warn("[TechStore API] Error obteniendo items:", e.message);
      return [];
    }
  }

  async createItem(item: Partial<Item>): Promise<Item> {
    const payload = {
      title: item.title,
      description: item.description,
      price: item.price || 0,
      category: item.category || 'General',
      image_url: item.image_url || '',
      stock_quantity: item.stock_quantity || 0,
      status: 'completed'
    };
    return this.fetchWithAuth('items', { method: 'POST', body: JSON.stringify(payload) });
  }
}

export const api = new APIService();
