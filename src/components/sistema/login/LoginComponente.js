import React,  { useState } from 'react';
import './login.scss';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../../../assets/images/logo.svg';
import { useAuth } from '../util/loginUtilidades';
import { useInput } from '../util/formUtilidades';
import { Link } from 'react-router-dom';

const LoginComponente = () => {

    const {value:username, bind:bindUsuario, getErrores:usuarioErrores, setFocus:focusUsuario} = 
    useInput('', [{tipo: 'regex', regex: /^[a-z0-9]+$/i}, {tipo: 'requerido'}, {tipo: 'size-minimo', size: 3}, 
    {tipo: 'size-maximo', size: 15}]);
    const {value:password, bind:bindPassword, getErrores:passwordErrores, setFocus:focusPassword} =  
    useInput('', [{tipo: 'regex', regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]+$/g}, {tipo: 'requerido'}, {tipo: 'size-minimo', size: 6},
    {tipo: 'size-maximo', size: 15}]);

    const [visible, setVisible] = useState(true);
    const [ejecutando, setEjecutando] = useState(false);


    const auth = useAuth();

    const manejarSubidaForm = async (event) => {
        event.preventDefault();
        if (usuarioErrores().length !== 0) {
            focusUsuario();
        } else if (passwordErrores().length !== 0) {
            focusPassword();
        } else {
            setEjecutando(true);
            const result = await auth.signin(username.trim(), password.trim());
            if (result.error && result.error !== 0) {
                setEjecutando(false);
                alert(result.message);
            }
        }
    };
    return (
            <div className="login-card">
                <img width="336px" src={logo} className="logo" alt="logo" />
                <form autoComplete="off" onSubmit={manejarSubidaForm}>
                    <div>
                        <label htmlFor="usuario">Usuario</label>
                        <input autoComplete="off" disabled={ejecutando}
                        required={true} placeholder="Tu Usuario" name="usuario" type="text" {...(bindUsuario())} />
                        <h6>Letras o numeros. Minimo 3 caracteres, maximo 15.</h6>
                    </div>
                    <div>
                        <label  htmlFor="contrasena">Contraseña</label>
                        <div className="contrasena-btn">
                            <input autoComplete="off" disabled={ejecutando}
                            required={true} placeholder="Tu Contraseña" name="contrasena" 
                            type={visible ? ('password'):('text')} {...(bindPassword())} />
                            <i onClick={() => setVisible(!visible)}>{visible ? (<FaEye/>) : (<FaEyeSlash/>)}</i>
                        </div>
                        <h6>Por lo menos un numero, una letra minuscula y otra mayuscula. Minimo 6 caracteres, maximo 15.</h6>
                    </div>
                    <input disabled={ejecutando} type="submit" value="Iniciar Sesión"/>
                </form>
                <div className="line"></div>
                <Link to="/sistema/registro">Crear Usuario</Link>
            </div>
    );
};



export default LoginComponente;