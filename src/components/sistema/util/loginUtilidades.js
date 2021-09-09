import React, {useState, createContext, useContext} from 'react';
import axios from 'axios';

// eslint-disable-next-line no-undef
const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:2000' : '';

const authContext = createContext();

// eslint-disable-next-line react/prop-types
export const ProvideAuth = ({children}) => {
    const auth = useProvideAuth();
    return (
      <authContext.Provider value={auth}>
        {children}
      </authContext.Provider>
    );
};


const useProvideAuth = () => {
    const [user, setUser] = useState(localStorage.getItem('username') || null);
    const [esAdmin, setEsAdmin] = useState((localStorage.getItem('tipo') === 'Administrador' ? true : false) || null);

    const authAxios = axios.create({
      baseURL: API_URL,
      timeout: 10000, 
    });

    const authAxiosNI = axios.create({
      baseURL: API_URL + '/auth',
      timeout: 10000, 
    });

    const authTokenHandler = request => {
      request.headers.Authorization = 
      `JWT ${localStorage.getItem('token')} ${localStorage.getItem('codUsuario')} ${localStorage.getItem('username')} ${localStorage.getItem('tipo')}`;
      return request;
    }

    const responseHandler = response => {
      return response;
    };

    const errorHandler = error => {
      if (error.response.status === 401 && error.response.data.message === 'BAD USER') {
        signout();
        return Promise.reject(error);
      }
      return Promise.reject(error);
    };

    authAxios.interceptors.request.use(
      (request) => authTokenHandler(request),
      (error) => errorHandler(error)
    );

    authAxios.interceptors.response.use(
      (response) => responseHandler(response),
      (error) => errorHandler(error)
    );

    const signin = async (username, contrasena_enviada) => {
      try {
        const result = await authAxiosNI.post('/login', {
          username, contrasena_enviada
        });
        almacenarLogin(result.data.usuario, result.data.loginToken);
        return {error: undefined, message: 'Usuario Ingresado'}
      } catch (error) {
        if (!error.response) {
          alert(error);
          return { error: 0, message: 'Error Al Tratar De Conectar Al Servidor' };
        }
        return {error: error.response.status, message: error.response.data.message}
      }
    };

    const almacenarLogin  = (usuario, loginToken) => {
        localStorage.setItem('username', usuario.username);
        localStorage.setItem('tipo', usuario.esAdmin ? 'Administrador':'Personal');
        localStorage.setItem('codUsuario', usuario.codUsuario);
        localStorage.setItem('token', loginToken);
        setUser(usuario.username);
        setEsAdmin(usuario.esAdmin);
    };
    

    const signout = () => {
        setUser(null);
        setEsAdmin(null);
        localStorage.clear();
    };
  
    return {
      user,
      esAdmin,
      signin,
      signout,
      authAxios
    };
}

export const useAuth = () => {
    return useContext(authContext);
}
