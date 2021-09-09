import {useRef, useState, useMemo, useEffect} from 'react';

export const useInput = (defValue, reglasExternas = []) => {
    const [value, setValue] = useState(defValue);
    const [reglas, setReglas] = useState(reglasExternas);
    const errors = [];
    const [contadorM, setContadorM] = useState(0);
    const inputRef = useRef();

    useEffect(() => {
        setContadorM(c => c + 1);
    }, [value]);

   function getErrores() {
        reglas.forEach(regla => {
            switch (regla.tipo) {
                case 'regex':
                    if (!(errors.indexOf('regex') === -1)) {
                        errors.splice(errors.indexOf('regex'), 1);
                    }
                    errors.splice(errors.indexOf('regex'), 1);
                    if (!value.match(regla.regex) && !(value === '')) {
                        errors.push('regex');
                    }
                    break;
                case 'requerido':
                    if (!(errors.indexOf('requerido') === -1)) {
                        errors.splice(errors.indexOf('requerido'), 1);
                    }
                    if (value === '') {
                        errors.push('requerido');
                    }
                    break;
                case 'size-minimo':
                        if (!(errors.indexOf('size-minimo') === -1)) {
                            errors.splice(errors.indexOf('size-minimo'), 1);
                        }
                        if (value !== '' && value.length < regla.size) {
                            errors.push('size-minimo');
                        }
                        break;
                case 'size-maximo':
                        if (!(errors.indexOf('size-maximo') === -1)) {
                            errors.splice(errors.indexOf('size-maximo'), 1);
                        }
                        if (value.length >= regla.size) {
                            errors.push('size-maximo');
                        }
                        break;
                default:
                    break;
            }
        });
        return errors;
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const errores = useMemo(() => getErrores(value, reglas), [value, reglas]);

    const addRegla = (regla) => {
        const reglasTemporal = reglas;
        reglasTemporal.push(regla);
        setReglas(reglasTemporal)
    }

    const reset = () => {
        setValue(defValue)
    }

    const clear = () => {
        setValue('')
    };

    const setFocus = () => {
        inputRef.current.focus();
    }

    const bind = () => {
        return { className: ((errores.length !== 0 && contadorM > 1)? 'error-input': ''), 
        value, ref: inputRef, onChange: (event) => { setValue(event.target.value); }}
    };

    return {
        value,
        reset,
        clear,
        bind,
        addRegla,
        getErrores,
        setFocus
    }
};