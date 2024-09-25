import { Usuario } from './usuario';

export interface Mensaje {
  usuario: Usuario;
  texto: string;
  fechaHora: Date;
}
