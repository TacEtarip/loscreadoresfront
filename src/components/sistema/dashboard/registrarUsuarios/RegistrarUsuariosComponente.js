import React, {useState, useEffect} from 'react';
import { Row, Col, Container, Card, Tabs, Tab, Form, InputGroup, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaEye, FaRegCopy } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { useRef } from 'react';
import { usuarioExiste, validarDNI, registrar } from '../../util/callsRegistroAPI';
import { getDepartamentos, getDistritos, getProvincias } from '../../util/helpersAPI'


const usuarioSchema = yup.object().shape({ 
    usuario: yup.string().trim().matches(/^[a-z0-9]+$/i, 'Numeros o letras').min(4, 'Minimo 4 caracteres').max(15, 'Maximo 15 caracteres')
    .required('Campo Obligatorio'),
    esAdmin: yup.boolean().required(),
    password: yup.string().trim().min(6, 'Minimo 6 caracteres').max(15, 'Maximo 15 caracteres')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]+$/g, 'Numeros y letras, minimo una mayuscula')
    .required('Campo Obligatorio')
 });

 const d = new Date();
 const year = d.getFullYear();
 const mes = d.getMonth();
 const dia = d.getDay();


 const personaSchema = yup.object().shape({ 
    dni: yup.string().trim().matches(/^[0-9]+$/i, 'No debe tener letras').min(8, 'DNI invalido').max(8, 'DNI invalido')
    .required('Campo Obligatorio'), 
    nombre: yup.string().trim(), 
    apellido: yup.string().trim(), 
    apellidoDos: yup.string(),
    fechaNacimiento:  yup.date('Fecha Invalida').min(new Date(year - 80, mes, dia), 'Fecha Invalida').max(new Date(year - 18, mes, dia), 'Fecha Invalida')
    .required('Campo Obligatorio'),
 });

 const contactoSchema = yup.object().shape({ 
    departamento: yup.string().trim().matches(/^[0-9]+$/i, 'No debe tener letras').min(2).max(2)
    .required('Campo Obligatorio'),
    provincia: yup.string().trim().matches(/^[0-9]+$/i, 'No debe tener letras').min(4).max(4)
    .required('Campo Obligatorio'),  
    distrito: yup.string().trim().matches(/^[0-9]+$/i, 'No debe tener letras').min(6).max(6)
    .required('Campo Obligatorio'), 
    direccionLineaUno: yup.string().trim().matches(/^[a-zA-Z0-9\s,'-.]*$/i, 'Direccion incorrecta').min(3).max(100)
    .required('Campo Obligatorio'),
    direccionLineaDos: yup.string().trim().matches(/^[a-zA-Z0-9\s,'-.]*$/i, 'Direccion incorrecta').min(3).max(100),
    codigoPostal: yup.string().trim().matches(/^[0-9a-z]+$/i, 'Codigo Invalido').max(15),
    email:  yup.string().email('Correo Invalido').trim().max(255).required('Campo Obligatorio'),
    celular: yup.string().matches(/^[0-9]+$/i, 'Celular Invalido').required('Campo Obligatorio')
 });

const RegistrarUsuariosComponente = () => {
    const [visible, setVisible] = useState(false);

    const [etapa, setEtapa] = useState(0);

    const [registrando, setRegistrando] = useState(false);
    const [usuario, setUsuario] = useState({codUsuario: 0, username: '', esAdmin: false})

    const pasarEtapa = () => {
        if (usuarioFormik.isValid) {
            setEtapa(etapa + 1)
        }
    };

    const usuarioFormik = useFormik({
        validateOnChange: true,
        validationSchema: usuarioSchema,
        initialValues: {
            usuario: '',
            password: '',
            esAdmin: false
        },
        onSubmit: () => pasarEtapa()
    });

    const personalFormik = useFormik({
        validationSchema: personaSchema,
        initialValues: {
            dni: '',
            nombre: '',
            apellido: '',
            apellidoDos: '',
            fechaNacimiento: '',
        },
        onSubmit: () => pasarEtapa()
    });

    const contactoFormik = useFormik({
        validationSchema: contactoSchema,
        initialValues: {
            departamento: '',
            provincia: '',  
            distrito: '', 
            direccionLineaUno: '',
            direccionLineaDos: '',
            codigoPostal: '',
            email:  '',
            celular: ''
        },
        onSubmit: () => pasarEtapa()
    });
    
    const {estado:estadoUsuario, value$:usuario$, setEstadoF:setEstadoUsuario} =
    useAutoRXJS(usuarioFormik.values.usuario, usuarioFormik.errors.usuario, usuarioFormik.touched.usuario);

    useEffect(() => {
        if (estadoUsuario === 'validando') {
            usuarioExiste(usuario$.current.value).subscribe(res => {
                if (res.error) {
                    alert(res.error)
                    setEstadoUsuario('pre');
                } else {
                    if(!res.response.existe){
                        setEstadoUsuario('validado');
                    } else {
                        setEstadoUsuario('invalido');
                    }
                }
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [estadoUsuario])

    const {estado:estadoDNI, value$:dni$, setEstadoF:setEstadoDNI} =
    useAutoRXJS(personalFormik.values.dni, personalFormik.errors.dni, personalFormik.touched.dni);


    useEffect(() => {
        if (dni$.current.value.length !== 8) {
            setEstadoDNI('pre');
        } else 
        if (estadoDNI === 'validando') {
            validarDNI(dni$.current.value).subscribe(res => {
                if (res.error) {
                    alert(res.error)
                    setEstadoUsuario('pre');
                } else {
                    if(res.response.success){
                        setEstadoDNI('validado');
                        const arraynombre = res.response.nombre.split(' ');
                        personalFormik.setFieldValue('apellido', arraynombre.shift());
                        personalFormik.setFieldValue('apellidoDos', arraynombre.shift());
                        personalFormik.setFieldValue('nombre', arraynombre.join(' '));
                    } else {
                        setEstadoDNI('invalido');
                        personalFormik.setFieldValue('apellido', '');
                        personalFormik.setFieldValue('apellidoDos', '');
                        personalFormik.setFieldValue('nombre', '');
                    }
                }

            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [estadoDNI])

    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);

    useEffect(() => {
        getDepartamentos().subscribe(res => {
            if (res.error) {
                alert(res.error)
            } else {
                setDepartamentos(res)
            }
        });
    }, []);

    useEffect(() => {
        setProvincias([]);
        contactoFormik.setFieldValue('provincia', '');
        if (contactoFormik.values.departamento !== '') {
            getProvincias(contactoFormik.values.departamento).subscribe(res => {
                if (res.error) {
                    alert(res.error)
                }
                else {
                    setProvincias(res.response)
                }
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contactoFormik.values.departamento]);

    useEffect(() => {
        setDistritos([]);
        if (contactoFormik.values.provincia !== '') {
            getDistritos(contactoFormik.values.provincia).subscribe(res => {
                if (res.error) {
                    alert(res.error)
                }
                else {
                    setDistritos(res.response)
                }
            });
        }
    }, [contactoFormik.values.provincia]);

    const autoGenerarPassword = () => {
        var length = 6,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        retVal += 'Ab3'
        usuarioFormik.setFieldValue('password', retVal);
    };

    const registrarUsuario = () => {
        setRegistrando(true);
        registrar(usuarioFormik.values.password, usuarioFormik.values.esAdmin, usuarioFormik.values.usuario, 
            contactoFormik.values.distrito, contactoFormik.values.celular,contactoFormik.values.direccionLineaUno, contactoFormik.values.direccionLineaDos || null, contactoFormik.values.codigoPostal, contactoFormik.values.email,
            personalFormik.values.dni, personalFormik.values.nombre, personalFormik.values.apellido, personalFormik.values.apellidoDos, personalFormik.values.fechaNacimiento
            ).subscribe(res => {
            setRegistrando(false);
            if (res.error) {
                alert(res.error);
            }
            else {
                setEtapa(4);
                setUsuario(res.response);
                contactoFormik.resetForm();
                usuarioFormik.resetForm();
                personalFormik.resetForm();
            }
        });
    };

    return (
        <Container>
            <Card className="card-contenedora">
                <Card.Header>
                    <h1>Registro De Usuario</h1>
                </Card.Header>
                <Card.Body>
                    <Tabs onSelect={(e) => {setEtapa(parseInt(e))}} transition={true} activeKey={etapa} className="mb-3">
                        <Tab disabled={registrando} eventKey={0} title="Datos de usuario">
                            <Form  onSubmit={usuarioFormik.handleSubmit} noValidate>
                                <Row >
                                    <Form.Group as={Col} lg="6">
                                        <Form.Label>Ingresa el usuario</Form.Label>
                                        <Form.Control
                                            disabled={estadoUsuario === 'validando'}
                                            autoComplete="off" 
                                            type="text"
                                            name="usuario"
                                            placeholder="Usuario"
                                            onBlur={usuarioFormik.handleBlur}
                                            value={usuarioFormik.values.usuario}
                                            onChange={usuarioFormik.handleChange}
                                            isValid={!usuarioFormik.errors.usuario && usuarioFormik.touched.usuario && estadoUsuario === 'validado'}  
                                            isInvalid={(!!usuarioFormik.errors.usuario && usuarioFormik.touched.usuario) || estadoUsuario === 'invalido'}  
                                        />
                               <Form.Control.Feedback type="invalid">{usuarioFormik.errors.usuario ? usuarioFormik.errors.usuario : 'El usuario ya existe'}</Form.Control.Feedback>
                               <Form.Text id="usuarioGuia" muted>
                                   Letras o numeros. Minimo 4 caracteres, maximo 15.
                               </Form.Text>
                                   </Form.Group>
                                   <Form.Group as={Col} lg="6">
                                       <Form.Label>Ingresa su contraseña</Form.Label>
                                       <InputGroup  hasValidation>
                                           <Button onClick={autoGenerarPassword}  variant="outline-secondary">
                                               Auto Generar
                                           </Button>
                                           <Form.Control
                                                autoComplete="off" 
                                               type={visible ? 'text' : 'password'}
                                               name="password"
                                               placeholder="Contraseña"

                                                onBlur={usuarioFormik.handleBlur}
                                                value={usuarioFormik.values.password}
                                                onChange={usuarioFormik.handleChange}
                                                isInvalid={(!!usuarioFormik.errors.password && usuarioFormik.touched.password)}  
                                            />
                                            <Button onClick={ () => setVisible(!visible)} variant="outline-secondary">
                                                <FaEye></FaEye>
                                            </Button>
                                            <Form.Control.Feedback type="invalid">{usuarioFormik.errors.password}</Form.Control.Feedback>
                                        </InputGroup>
                                        <Form.Text muted>
                                            Por lo menos un numero, una letra minuscula y otra mayuscula. Minimo 6 caracteres, maximo 15.
                                        </Form.Text> 
                                    </Form.Group>
                                    <Form.Group className="g-4">
                                       <Form.Check
                                        inline
                                        label="Es Administrador"
                                        name="esAdmin"
                                        type={'checkbox'}
                                        onBlur={usuarioFormik.handleBlur}
                                        onChange={usuarioFormik.handleChange}
                                        value={usuarioFormik.values.esAdmin}
                                    />
                                    <Form.Text muted>
                                            Selecciona si el usuario tendra permisos de administrador.
                                        </Form.Text> 
                                    </Form.Group>
                                </Row>
                                <Row className="botones">
                                    <Col xs="auto">                                
                                        <Button disabled={!usuarioFormik.isValid || !(estadoUsuario === 'validado')} variant="primary" type="submit">
                                            Siguiente
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Tab>
                        <Tab disabled={!usuarioFormik.isValid || !(estadoUsuario === 'validado') || registrando}  eventKey={1} title="Datos personales">
                            <Form onSubmit={personalFormik.handleSubmit} noValidate>
                                <Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Ingresa el DNI</Form.Label>
                                        <Form.Control 
                                            autoComplete="off"
                                            type="text"
                                            name="dni"
                                            placeholder="DNI..."

                                            disabled={estadoDNI === 'validando'}
                                            onBlur={personalFormik.handleBlur}
                                            onChange={personalFormik.handleChange}
                                            value={personalFormik.values.dni}
                                            isValid={!personalFormik.errors.dni && personalFormik.touched.dni && estadoDNI === 'validado'}
                                            isInvalid={(!!personalFormik.errors.dni && personalFormik.touched.dni || estadoDNI === 'invalido')}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {personalFormik.errors.dni ? personalFormik.errors.dni : 'DNI no encontrado'}
                                        </Form.Control.Feedback>
                                        <Form.Text muted>
                                            DNI del usuario a registrar.
                                        </Form.Text> 
                                    </Form.Group>
                                </Row>
                                <Row className="row-espacio">
                                <Form.Group as={Col} lg="6">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            name="nombre"
                                            placeholder="Nombre..."

                                            value={personalFormik.values.nombre}

                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} lg="6">
                                        <Form.Label>Primer apellido</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            name="apellido"
                                            placeholder="Primer Apellido..."
                                            
                                            value={personalFormik.values.apellido}
                                            readOnly
                                        />
                                    </Form.Group>
                                    
                                </Row>
                                <Row className="row-espacio">
                                        <Form.Group as={Col} lg="6">
                                        <Form.Label>Segundo apellido</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            name="apellidoDos"
                                            placeholder="Segundo Apellido..."

                                            value={personalFormik.values.apellidoDos}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} lg="6">
                                        <Form.Label>Fecha de nacimiento</Form.Label>
                                        <Form.Control 
                                            autoComplete="off"
                                            type="date"
                                            name="fechaNacimiento"
                                            placeholder="Fecha de nacimiento..."

                                            min={`${(year-80).toString()}-${(mes+1).toString().length === 1 ? '0' + (mes+1).toString() : (mes+1).toString()}-${(dia).toString().length === 1 ? '0' + (dia).toString() : (dia).toString()}`}
                                            max={`${(year-18).toString()}-${(mes+1).toString().length === 1 ? '0' + (mes+1).toString() : (mes+1).toString()}-${(dia).toString().length === 1 ? '0' + (dia).toString() : (dia).toString()}`}

                                            onBlur={personalFormik.handleBlur}
                                            onChange={personalFormik.handleChange}
                                            value={personalFormik.values.fechaNacimiento}
                                            isInvalid={(!!personalFormik.errors.fechaNacimiento && personalFormik.touched.fechaNacimiento)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {personalFormik.errors.fechaNacimiento}
                                        </Form.Control.Feedback>
                                        <Form.Text muted>
                                            Fecha de nacimiento del usuario a registrar, almenos debe tener 18 años.
                                        </Form.Text> 
                                    </Form.Group>
                                </Row>
                                <Row className="botones">
                                    <Col xs="auto">                                
                                        <Button disabled={!personalFormik.isValid || !(estadoDNI === 'validado')} variant="primary" type="submit">
                                            Siguiente
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Tab>
                        <Tab disabled={(!usuarioFormik.isValid || !(estadoUsuario === 'validado' || registrando)) || 
                        (!personalFormik.isValid || !(estadoDNI === 'validado'))}
                        eventKey={2} title="Datos de contacto">
                            <Form onSubmit={contactoFormik.handleSubmit} noValidate>
                                <Row>
                                    <Form.Group as={Col} sm="4">
                                        <Form.Label>Departamento</Form.Label>
                                        <Form.Select
                                            name="departamento"
                                            onBlur={personalFormik.handleBlur}
                                            onChange={contactoFormik.handleChange}
                                            value={contactoFormik.values.departamento}
                                            isInvalid={(!!contactoFormik.errors.departamento && contactoFormik.touched.departamento)}
                                        >
                                            <option value=''>Seleccionar Departamento</option>
                                            {
                                                departamentos.map((d, iterator) => {
                                                    return (<option key={iterator} value={d.codDepartamento}>{d.nombre}</option>)
                                                })
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group as={Col} sm="4">
                                        <Form.Label>Provincia</Form.Label>
                                        <Form.Select
                                            disabled={provincias.length === 0}

                                            name="provincia"
                                            
                                            onBlur={personalFormik.handleBlur}
                                            onChange={contactoFormik.handleChange}
                                            value={contactoFormik.values.provincia}
                                            isInvalid={(!!contactoFormik.errors.provincia && contactoFormik.touched.provincia)}
                                        >
                                            <option value=''>Seleccionar Provincia</option>
                                            {
                                                provincias.map((p, iterator) => {
                                                    return (<option key={iterator} value={p.codProvincia}>{p.nombre}</option>)
                                                })
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group as={Col} sm="4">
                                        <Form.Label>Distrito</Form.Label>
                                        <Form.Select
                                            name="distrito"
                                            disabled={distritos.length === 0}
                                            
                                            onBlur={personalFormik.handleBlur}
                                            onChange={contactoFormik.handleChange}
                                            value={contactoFormik.values.distrito}
                                            isInvalid={(!!contactoFormik.errors.distrito && contactoFormik.touched.distrito)}
                                        >
                                            <option value=''>Seleccionar Distrito</option>
                                            {
                                                distritos.map((d, iterator) => {
                                                    return (<option key={iterator} value={d.codDistrito}>{d.nombre}</option>)
                                                })
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                </Row>
                                <Row className="row-espacio">
                                    <Form.Group as={Col} md="5">
                                        <Form.Label>Direccion</Form.Label>
                                        <Form.Control
                                            autoComplete="off"
                                            type="text"
                                            name="direccionLineaUno"
                                            placeholder="Av. ..."

                                            onChange={contactoFormik.handleChange}
                                            onBlur={contactoFormik.handleBlur}
                                            value={contactoFormik.values.direccionLineaUno}
                                            isInvalid={!!contactoFormik.errors.direccionLineaUno && contactoFormik.touched.direccionLineaUno}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {contactoFormik.errors.direccionLineaUno}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} md="5">
                                        <Form.Label>Direccion Linea Dos</Form.Label>
                                        <Form.Control
                                            autoComplete="off"
                                            type="text"
                                            name="direccionLineaDos"
                                            placeholder="Av. ..."

                                            onChange={contactoFormik.handleChange}
                                            onBlur={contactoFormik.handleBlur}
                                            value={contactoFormik.values.direccionLineaDos}
                                            isInvalid={!!contactoFormik.errors.direccionLineaDos && contactoFormik.touched.direccionLineaDos}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {contactoFormik.errors.direccionLineaDos}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} md="2">
                                        <Form.Label>Codigo Postal</Form.Label>
                                        <Form.Control
                                            autoComplete="off"
                                            type="text"
                                            name="codigoPostal"
                                            placeholder="Codigo"

                                            onChange={contactoFormik.handleChange}
                                            onBlur={contactoFormik.handleBlur}
                                            value={contactoFormik.values.codigoPostal}
                                            isInvalid={!!contactoFormik.errors.codigoPostal && contactoFormik.touched.codigoPostal}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {contactoFormik.errors.codigoPostal}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="row-espacio">
                                    <Form.Group as={Col} sm="6">
                                    <Form.Label>Celular</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>+51</InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                name="celular"
                                                placeholder="999999999"

                                                onChange={contactoFormik.handleChange}
                                                onBlur={contactoFormik.handleBlur}
                                                value={contactoFormik.values.celular}
                                                isInvalid={!!contactoFormik.errors.celular && contactoFormik.touched.celular}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {contactoFormik.errors.celular}
                                            </Form.Control.Feedback>     
                                        </InputGroup>

                                    </Form.Group>
                                    <Form.Group as={Col} sm="6">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="email"
                                            placeholder="email@ejemplo.com"

                                            onChange={contactoFormik.handleChange}
                                            onBlur={contactoFormik.handleBlur}
                                            value={contactoFormik.values.email}
                                            isInvalid={!!contactoFormik.errors.email && contactoFormik.touched.email}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {contactoFormik.errors.email}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="botones">
                                    <Col xs="auto">                                
                                        <Button disabled={!contactoFormik.isValid} variant="primary" type="submit">
                                            Siguiente
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Tab>
                        <Tab disabled={(!usuarioFormik.isValid || !(estadoUsuario === 'validado')) || 
                        (!personalFormik.isValid || !(estadoDNI === 'validado')) || !contactoFormik.isValid || registrando} eventKey={3} title="Confirmar">
                            <h3>Verifica los datos</h3>
                            <Form>
                                <Row className="row-espacio">
                                    <Form.Group as={Col} md="6">
                                        <Form.Label>
                                            Usuario
                                        </Form.Label>
                                        <Form.Control readOnly defaultValue={usuarioFormik.values.usuario} />
                                    </Form.Group>
                                    <Form.Group as={Col} md="6">
                                        <Form.Label>
                                            Contraseña
                                        </Form.Label>
                                        <InputGroup>
                                            <OverlayTrigger
                                            placement="bottom"
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={renderTooltip}>
                                                <Button onClick={() =>  navigator.clipboard.writeText(usuarioFormik.values.password)} 
                                                variant="outline-secondary">
                                                    <FaRegCopy></FaRegCopy>
                                            </Button>
                                            </OverlayTrigger>
                                            <Form.Control readOnly type={visible ? 'text' : 'password'}
                                            defaultValue={usuarioFormik.values.password} />
                                            <Button onClick={ () => setVisible(!visible)} variant="outline-secondary">
                                                <FaEye></FaEye>
                                            </Button>
                                        </InputGroup>
                                    </Form.Group>
                                </Row>
                                <Row className="row-espacio">
                                    <Form.Group as={Col} md="6">
                                        <Form.Label>
                                            DNI
                                        </Form.Label>
                                        <Form.Control readOnly defaultValue={personalFormik.values.dni} />
                                    </Form.Group>
                                    <Form.Group as={Col} md="6">
                                        <Form.Label>
                                            Nombre
                                        </Form.Label>
                                        <Form.Control readOnly 
                                        value={personalFormik.values.apellido} />
                                    </Form.Group>
                                </Row>
                                <Row className="row-espacio">
                                    <Form.Group as={Col} md="6">
                                        <Form.Label>
                                            Celular
                                        </Form.Label>
                                        <Form.Control readOnly defaultValue={contactoFormik.values.celular} />
                                    </Form.Group>
                                    <Form.Group as={Col} md="6">
                                        <Form.Label>
                                            Email
                                        </Form.Label>
                                        <Form.Control readOnly 
                                        defaultValue={contactoFormik.values.email} />
                                    </Form.Group>
                                </Row>
                                <Row className="botones">
                                    <Col xs="12">                                
                                        <Button onClick={() => registrarUsuario()}style={{width: '100%'}} variant="primary" type="button">
                                            Registrar
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Tab>
                        <Tab disabled title="Post Registro" eventKey={4}>
                            <h2>Usuario Registrado Con Existo</h2>
                            <h5>Usuario: {usuario.username} como {usuario.esAdmin ? 'Administrador':'Personal'}</h5>
                            <h6>Codigo: #{usuario.codUsuario}</h6>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </Container>
    );
}

const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Copiar
    </Tooltip>
);

const useAutoRXJS = (value, errores, touched) => {
    const value$ = useRef(new BehaviorSubject(value));
    const [estado, setEstado] = useState('pre');

    // const memoValue$ = useMemo(() => function, [value])

    useEffect(() => {
        setEstado('pre');
        if (value !== '' && touched) {
            if (errores === undefined) {
                value$.current.next(value);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, errores, touched]);

    useEffect(() => {
        const subs = value$.current.pipe(debounceTime(900), distinctUntilChanged()).subscribe(res => {
            if (res) {
                setEstado('validando');
            }
        })
        return () => {
            subs.unsubscribe();
        }
    }, [])


    return {estado, value$, setEstadoF: (estado) => setEstado(estado)};
}

export default RegistrarUsuariosComponente;