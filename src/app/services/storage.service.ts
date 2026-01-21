import { Injectable } from '@angular/core';

/**
 * Servicio para manejar el almacenamiento local del juego
 * Gestiona localStorage de forma segura con tipado
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  /**
   * Guarda un valor en localStorage
   */
  set<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Obtiene un valor de localStorage
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue !== undefined ? defaultValue : null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue !== undefined ? defaultValue : null;
    }
  }

  /**
   * Elimina un valor de localStorage
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  /**
   * Limpia todo el localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Verifica si existe una clave
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
