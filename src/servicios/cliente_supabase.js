import { createClient } from '@supabase/supabase-js';

const URL_SUPABASE = import.meta.env.VITE_SUPABASE_URL ?? '';
const CLAVE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export class ClienteSupabase {
  #cliente;
  #conectado;

  constructor() {
    this.#conectado = Boolean(URL_SUPABASE && CLAVE_ANON);
    this.#cliente = this.#conectado ? createClient(URL_SUPABASE, CLAVE_ANON) : null;
  }

  get conectado() { return this.#conectado; }
  get cliente() { return this.#cliente; }
}
