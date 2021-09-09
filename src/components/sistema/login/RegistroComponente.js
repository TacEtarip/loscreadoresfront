import React, {useState} from 'react';
import './login.scss';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { useAuth } from '../util/loginUtilidades';
// import { first } from 'rxjs';
import { useInput } from '../util/formUtilidades';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';

const RegistroComponente = () => {
    const {bind:bindUsuario, getErrores:usuarioErrores, setFocus:focusUsuario} = 
    useInput('', [{tipo: 'regex', regex: /^[a-z0-9]+$/i}, 
    {tipo: 'requerido'}, {tipo: 'size-minimo', size: 3}, 
    {tipo: 'size-maximo', size: 15}]);

    const {value:password, bind:bindPassword, getErrores:passwordErrores, setFocus:focusPassword} =  
    useInput('', [{tipo: 'regex', regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]+$/g}, 
    {tipo: 'requerido'}, {tipo: 'size-minimo', size: 6},
    {tipo: 'size-maximo', size: 15}]);

    const {value:passwordRepeat, bind:bindPasswordRepeat, getErrores:passwordRepeatErrores, setFocus:focusPasswordRepeat} = 
    useInput('', [{tipo: 'regex', regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]+$/g}, 
    {tipo: 'requerido'}, {tipo: 'size-minimo', size: 6},
    {tipo: 'size-maximo', size: 15}]);

    const {bind:bindDNI, getErrores:dniErrores, setFocus:focusDNI} = 
    useInput('', [{tipo: 'regex', regex: /^[0-9]+$/i}, {tipo: 'size-minimo', size: 8}, {tipo: 'size-maximo', size: 9},
    {tipo: 'requerido'}]);

    const {bind:bindNombre, getErrores:nombreErrores, setFocus:focusNombre} = 
    useInput('', [{tipo: 'regex', regex: /^[a-z ]+$/i}, 
    {tipo: 'requerido'}, {tipo: 'size-minimo', size: 2}, 
    {tipo: 'size-maximo', size: 60}]);

    const {bind:bindApellido, getErrores:apellidoErrores, setFocus:focusApellido} = 
    useInput('', [{tipo: 'regex', regex: /^[a-z]+$/i}, 
    {tipo: 'requerido'}, {tipo: 'size-minimo', size: 2}, 
    {tipo: 'size-maximo', size: 60}]);

    const {bind:bindApellidoDos, getErrores:apellidoDosErrores, setFocus:focusApellidoDos} = 
    useInput('', [{tipo: 'regex', regex: /^[a-z]+$/i}, 
    {tipo: 'requerido'}, {tipo: 'size-minimo', size: 2}, 
    {tipo: 'size-maximo', size: 60}]);

    const {bind:bindTipo} = useInput(false);

    const [visible, setVisible] = useState(true);
    const [visibleR, setVisibleR] = useState(true);
    const [etapa, setEtapa] = useState(0);

    const [startDate, setStartDate] = useState(null);

    const manejarEtapaCero = (event) => {
        event.preventDefault();
        if (usuarioErrores().length !== 0) {
            focusUsuario();
        } else if (passwordErrores().length !== 0) {
            focusPassword();
        } else if (passwordRepeatErrores().length !== 0 || (passwordRepeat !== password)) {
            focusPasswordRepeat();
        } 
        else {
            setEtapa(1);
        }
    };

    const manejarEtapaUno = (event) => {
        event.preventDefault();
        if (dniErrores().length !== 0) {
            focusDNI();
        } else if (nombreErrores().length !== 0) {
            focusNombre();
        } else if (apellidoErrores().length !== 0) {
            focusApellido();
        } else if (apellidoDosErrores().length !== 0) {
            focusApellidoDos();
        } 
        else if (startDate === null) {
            // focusPasswordRepeat();
        }
        else {
            setEtapa(2);
        }
    };

    return(
        <div className="login-card">
            <h5>Registro</h5>
            {
                etapa === 0 ? (
                    <form onSubmit={manejarEtapaCero}>
                        <div>
                            <label htmlFor="tipo">Tipo de usuario</label>
                            <select {...(bindTipo())} name="tipo">
                                <option value={false}>Personal</option>
                                <option value={true}>Administrador</option>
                            </select>
                            <h6>Que tipo de usuario quieres solicitar.</h6>
                        </div>
                        <div>
                        <label  htmlFor="usuario">Usuario</label>
                            <input 
                                    required={true} placeholder="Tu Usuario..." name="usuario" 
                                    type="text" {...(bindUsuario())} />
                        <h6>Letras o numeros. Minimo 3 caracteres, maximo 15.</h6>
                        </div>
                        <div>
                        <label  htmlFor="contrasena">Contraseña</label>
                            <div className="contrasena-btn">
                                <input 
                                required={true} placeholder="Tu Contraseña..." name="contrasena" 
                                type={visible ? ('password'):('text')} {...(bindPassword())} />
                                <i onClick={() => setVisible(!visible)}>{visible ? (<FaEye/>) : (<FaEyeSlash/>)}</i>
                            </div>
                        <h6>Por lo menos un numero, una letra minuscula y otra mayuscula. Minimo 6 caracteres, maximo 15.</h6>
                        </div>
                            <div>
                            <label  htmlFor="contrasena-repedita">Repite tu contraseña</label>
                                <div className="contrasena-btn">
                                    <input 
                                    required={true} placeholder="Contraseña..." name="contrasena-repedita" 
                                    type={visibleR ? ('password'):('text')} {...(bindPasswordRepeat())} />
                                    <i onClick={() => setVisibleR(!visibleR)}>{visibleR ? (<FaEye/>) : (<FaEyeSlash/>)}</i>
                                </div>
                                <h6>Tiene que coincidir con la contraseña dada.</h6>
                        </div>
                        <input type="submit" value="Siguiente"/>
                    </form>
                ) : etapa === 1 ? 
                (<div>
                    <form onSubmit={manejarEtapaUno}>
                        <div>
                            <label  htmlFor="DNI">DNI</label>
                                <input 
                                    required={true} placeholder="Tu DNI..." name="DNI" 
                                    type="text" {...(bindDNI())} />
                        </div>
                        <div>
                            <label  htmlFor="nombre">Nombre</label>
                                <input 
                                    required={true} placeholder="Tu Nombre..." name="nombre" 
                                    type="text" {...(bindNombre())} />
                        </div>
                        <div>
                            <label  htmlFor="apellido">Primer Apellido</label>
                                <input 
                                    required={true} placeholder="Tu Primer Apellido..." name="apellido" 
                                    type="text" {...(bindApellido())} />
                        </div>
                        <div>
                            <label  htmlFor="sApellido">Segundo Apellido</label>
                                <input 
                                    required={true} placeholder="Tu Segundo Apellido..." name="sApellido" 
                                    type="text" {...(bindApellidoDos())} />
                        </div>
                        <div>
                            <label>Fecha De Nacimiento</label>
                            <DatePicker minDate={new Date(1950, 0, 1)} maxDate={new Date()}
                            placeholderText="Tu fecha de nacimiento..."
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            selected={startDate} onChange={(date) => setStartDate(date)} />
                        </div>
                        <input type="submit" value="Siguiente"/>
                    </form>
                </div>) : 
                null
            }
            
        </div>
    )
}

export default RegistroComponente;