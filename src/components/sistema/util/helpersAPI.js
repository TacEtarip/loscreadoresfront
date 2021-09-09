import { catchError, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
// eslint-disable-next-line no-undef
const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:2000' : '';

export const getDepartamentos = () => {
    return ajax.getJSON(API_URL + '/helper/getDepartamentos')
    .pipe(first(), catchError(err => {
        if (err.response) {
            return of(err.response);
        }
        return of({error: 'No Se Pudo Conectar Con El Servidor'});
    }));
};

export const getUnidadesDeMedida = () => {
    return ajax.getJSON(API_URL + '/helper/getUnidadesDeMedida')
    .pipe(first(), catchError(err => {
        if (err.response) {
            return of(err.response);
        }
        return of({error: 'No Se Pudo Conectar Con El Servidor'});
    }));
};

export const getProvincias = (codDepartamento) => {
    return ajax.post(API_URL + '/helper/getProvincias', {codDepartamento})
    .pipe(first(), catchError(err => {
        if (err.response) {
            return of(err.response);
        }
        return of({error: 'No Se Pudo Conectar Con El Servidor'});
    }));
};

export const getDistritos = (codProvincia) => {
    return ajax.post(API_URL + '/helper/getDistritos', {codProvincia})
    .pipe(first(), catchError(err => {
        if (err.response) {
            return of(err.response);
        }
        return of({error: 'No Se Pudo Conectar Con El Servidor'});
    }));
};

export const getColores = () => {
    return ajax.getJSON(API_URL + '/helper/getColores')
    .pipe(first(), catchError(err => {
        if (err.response) {
            return of(err.response);
        }
        return of({error: 'No Se Pudo Conectar Con El Servidor'});
    }));
};

export const getMarcas = () => {
    return ajax.getJSON(API_URL + '/helper/getMarcas')
    .pipe(first(), catchError(err => {
        if (err.response) {
            return of(err.response);
        }
        return of({error: 'No Se Pudo Conectar Con El Servidor'});
    }));
};

export const getProveedores = () => {
    return ajax.getJSON(API_URL + '/helper/getProveedores')
    .pipe(first(), catchError(err => {
        if (err.response) {
            return of(err.response);
        }
        return of({error: 'No Se Pudo Conectar Con El Servidor'});
    }));
};