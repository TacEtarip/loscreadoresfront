import { catchError, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
// eslint-disable-next-line no-undef
const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:2000' : '';

export const usuarioExiste = (username) => {
    return ajax.post(API_URL + '/auth/usuarioExiste', {username})
    .pipe(first(), catchError(err => {
        if (err.response) {
            return of(err.response);
        }
        return of({error: 'No Se Pudo Conectar Con El Servidor'});
    }));
};

export const validarDNI = (dni) => {
    return ajax.post(API_URL + '/auth/validarDNI', {dni})
    .pipe(first(), catchError(err => {
        if (err.response) {
            return of(err.response);
        }
        return of({error: 'No Se Pudo Conectar Con El Servidor'});
    }));
};


export const registrar = 
(contrasena_enviada, esAdmin, username, 
    codDistrito, celular, direccion_linea_uno, direccion_linea_dos, codigo_postal, correo_electronico,
    DNI, nombre, apellido_uno, apellido_dos, fecha_nacimiento) => {
    return ajax.post(API_URL + '/auth/registrar', 
    {usuario: {contrasena_enviada, esAdmin, username}, 
    infoContacto: {codDistrito, celular, direccion_linea_uno, direccion_linea_dos, codigo_postal, correo_electronico},
    personaNatural: {DNI, nombre, apellido_uno, apellido_dos, fecha_nacimiento}})
    .pipe(first(), catchError(err => {
        if (err.response) {
            return of(err.response);
        }
        return of({error: 'No Se Pudo Conectar Con El Servidor'});
    }));
};