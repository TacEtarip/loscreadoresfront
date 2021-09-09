import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import { Container } from 'react-bootstrap';
import MaterialesPresentacionComponente from './MaterialesPresentacionComponente'
import MaterialesTipoComponente from './MaterialesTipoComponente'
import MaterialesSubTipoComponente from './MaterialesSubTipoComponente';
import MaterialesComponente from './MaterialesComponente';
import VariantesMaterialesComponentes from './VariantesMaterialesComponentes';
import './materiales.scss';

const MaterialesMainComponente = () =>{
    let {codTipoMaterial, codSubTipoMaterial, codMaterial, codMaterialDefinido } = useParams();

    useEffect(() => {
    }, [codTipoMaterial, codSubTipoMaterial, codMaterial]);

    return (
        <Container>
            {(codTipoMaterial === undefined) ? 
                (<MaterialesPresentacionComponente/>) :
            (codSubTipoMaterial === undefined ? 
                (<MaterialesTipoComponente codTipoMaterial={codTipoMaterial}/>):
            (codMaterial === undefined) ? 
                (<MaterialesSubTipoComponente codTipoMaterial={codTipoMaterial} codSubTipoMaterial={codSubTipoMaterial}/>):
            (codMaterialDefinido === undefined) ? (<MaterialesComponente codMaterial={codMaterial} codTipoMaterial={codTipoMaterial} codSubTipoMaterial={codSubTipoMaterial}/>)
            :(<VariantesMaterialesComponentes codMaterialDefinido={codMaterialDefinido}
                codMaterial={codMaterial} codTipoMaterial={codTipoMaterial} codSubTipoMaterial={codSubTipoMaterial}/>))
            }
        </Container>
        );
}; 

export default MaterialesMainComponente;