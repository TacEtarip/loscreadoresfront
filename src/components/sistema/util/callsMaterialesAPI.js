import { useAuth } from './loginUtilidades';

export const useMaterialAPI = () => {
    const auth = useAuth();

    const getTiposMaterial = async () => {
        try {
            const result = await auth.authAxios.get('/materiales/getAllTipos');
            return { error: undefined, message: 'Success', tipos: result.data };
        } catch (error) {
            if (!error.response) {
                alert(error);
                return { error: 0, message: 'Error Al Tratar De Conectar Al Servidor' };
            }
            return {error: error.response.status, message: error.response.data.message}
        }
    };

    const getTipo = async (codTipoMaterial) => {
        try {
            const result = await auth.authAxios.get('/materiales/getTipo/' + codTipoMaterial);
            return { error: undefined, message: 'Success', tipo: result.data };
        } catch (error) {
            if (!error.response) {
                alert(error);
                return { error: 0, message: 'Error Al Tratar De Conectar Al Servidor' };
            }
            return {error: error.response.status, message: error.response.data.message}
        }
    };

    const crearTipoMaterial = async (tipoNombre) => {
        try {
            const result = await auth.authAxios.post('/materiales/crearTipoMaterial', { tipoNombre });
            return { error: undefined, message: 'Success', nuevoTipo: result.data.nuevoTipo };
        } catch (error) {
            if (!error.response) {
                alert(error);
                return { error: 0, message: 'Error Al Tratar De Conectar Al Servidor' };
            }
            return {error: error.response.status, message: error.response.data.message}
        }
    };

    const editarTipoMaterial = async (tipoNombre, codTipoMaterial) => {
        try {
            const result = await auth.authAxios.post('/materiales/editarTipo', {tipoNombre, codTipoMaterial});
            return { error: undefined, message: 'Success', nuevoTipo: result.data.nuevoTipo };
        } catch (error) {
            if (!error.response) {
                alert(error);
                return { error: 0, message: 'Error Al Tratar De Conectar Al Servidor' };
            }
            return {error: error.response.status, message: error.response.data.message}
        }
    };

    const crearSubTipoMaterial = async (subTipoNombre, codTipoMaterial) => {
        try {
            const result = await auth.authAxios.post('/materiales/crearSubTipoMaterial', {subTipoNombre, codTipoMaterial});
            return { error: undefined, message: 'Success', nuevoSubTipo: result.data.nuevoSubTipo };
        } catch (error) {
            if (!error.response) {
                alert(error);
                return { error: 0, message: 'Error Al Tratar De Conectar Al Servidor' };
            }
            return {error: error.response.status, message: error.response.data.message}
        }
       
    };

    const editarSubTipoMaterial = async (subTipoNombre, codSubTipoMaterial) => {
        try {
            const result = await auth.authAxios.post('/materiales/editarSubTipo', {subTipoNombre, codSubTipoMaterial});
            return { error: undefined, message: 'Success', nuevoSubTipo: result.data.nuevoSubTipo };
        } catch (error) {
            if (!error.response) {
                alert(error);
                return { error: 0, message: 'Error Al Tratar De Conectar Al Servidor' };
            }
            return {error: error.response.status, message: error.response.data.message}
        }
    };

    const getSubTipo = async (codSubTipoMaterial) => {
        try {
            const result = await auth.authAxios.get('/materiales/getSubTipo/' + codSubTipoMaterial);
            return { error: undefined, message: 'Success', subTipo: result.data };
        } catch (error) {
            if (!error.response) {
                alert(error);
                return { error: 0, message: 'Error Al Tratar De Conectar Al Servidor' };
            }
            return {error: error.response.status, message: error.response.data.message}
        }
    };

    const crearMaterial = async (nombreMaterial, codSubTipoMaterial, descripcion, unidad_medida, unidad_medida_uso) => {
        try {
            const result = await auth.authAxios.post('/materiales/crearMaterial', 
            {nombreMaterial, codSubTipoMaterial, descripcion, unidad_medida, unidad_medida_uso});
            return { error: undefined, message: 'Success', nuevoMaterial: result.data.nuevoMaterial };
        } catch (error) {
            if (!error.response) {
                alert(error);
                return { error: 0, message: 'Error Al Tratar De Conectar Al Servidor' };
            }
            return {error: error.response.status, message: error.response.data.message}
        }
    };

    const editarMaterial = async (nombreMaterial, codMaterial, descripcion, unidad_medida, unidad_medida_uso) => {
        try {
            const result = await auth.authAxios.post('/materiales/editarMaterial', 
            {nombreMaterial, codMaterial, descripcion, unidad_medida, unidad_medida_uso});
            return { error: undefined, message: 'Success', nuevoMaterial: result.data.nuevoMaterial };
        } catch (error) {
            if (!error.response) {
                alert(error);
                return { error: 0, message: 'Error Al Tratar De Conectar Al Servidor' };
            }
            return {error: error.response.status, message: error.response.data.message}
        }
    };

    const getMaterial = async (codMaterial) => {
        try {
            const result = await auth.authAxios.get('/materiales/getMaterial/' + codMaterial);
            return { error: undefined, message: 'Success', material: result.data };
        } catch (error) {
            if (!error.response) {
                alert(error);
                return { error: 0, message: 'Error Al Tratar De Conectar Al Servidor' };
            }
            return {error: error.response.status, message: error.response.data.message}
        }
    };

    const getVariantesFiltro = async (codMaterial, codColor, codMarca, precioMin, precioMax, texto) => {
        try {
            const result = await auth.authAxios.post( '/materiales/getVariantesMaterialFiltro', 
            {codMaterial, codColor, codMarca, precioMin, precioMax, texto});
            return { error: undefined, message: 'Success', variantes: result.data.variantes };
        } catch (error) {
            if (!error.response) {
                alert(error);
                return { error: 0, message: 'Error Al Tratar De Conectar Al Servidor' };
            }
            return {error: error.response.status, message: error.response.data.message}
        }
    };

    const crearVarianteMaterial = async (nombre, codMaterial, codColor, codMarca, precio_por_unidad, descripcion, nombreColor, hex_code) => {
        try {
            const result = await auth.authAxios.post( '/materiales/crearMaterialDefinido', 
            {nombre, codMaterial, codColor, codMarca, precio_por_unidad, descripcion, nombreColor, hex_code});
            return { error: undefined, message: 'Success', nuevaVariante: result.data.nuevaVariante };
        } catch (error) {
            if (!error.response) {
                alert(error);
                return { error: 0, message: 'Error Al Tratar De Conectar Al Servidor' };
            }
            return {error: error.response.status, message: error.response.data.message}
        }
    };

    const editarVarianteMaterial = async (nombre, codMaterialDefinido, codColor, codMarca, precio_por_unidad, descripcion, nombreColor, hex_code) => {
        try {
            const result = await auth.authAxios.post('/materiales/editarMaterialDefinido', 
            {nombre, codMaterialDefinido, codColor, codMarca, precio_por_unidad, descripcion, nombreColor, hex_code});
            return { error: undefined, message: 'Success', nuevaVariante: result.data.nuevaVariante };
        } catch (error) {
            if (!error.response) {
                alert(error);
                return { error: 0, message: 'Error Al Tratar De Conectar Al Servidor' };
            }
            return {error: error.response.status, message: error.response.data.message}
        }
    };

    const getVariante = async (codVariante) => {
        try {
            const result = await auth.authAxios.get( '/materiales/getMaterialDefinido/' + codVariante);
            return { error: undefined, message: 'Success', variante: result.data };
        } catch (error) {
            if (!error.response) {
                alert(error);
                return { error: 0, message: 'Error Al Tratar De Conectar Al Servidor' };
            }
            return {error: error.response.status, message: error.response.data.message}
        }
    };

    const crearMaterialFisico = async (codMaterialDefinido, cantidad_original, cantidad_gastada, codProveedor, valor, cod_factura, comentario) => {
        try {
            const result = await auth.authAxios.post('/materiales/crearMaterialFisico', 
            {codMaterialDefinido, cantidad_original, cantidad_gastada, codProveedor, valor, cod_factura, comentario});
            return { error: undefined, message: 'Success', nuevoProductoMaterial: result.data.nuevoProductoMaterial };
        } catch (error) {
            if (!error.response) {
                alert(error);
                return { error: 0, message: 'Error Al Tratar De Conectar Al Servidor' };
            }
            return {error: error.response.status, message: error.response.data.message}
        }
    };

    const getMaterialFisicosFiltro = async (codMaterialDefinido, estado, codProveedor, desde_fecha, hasta_fecha) => {
        try {
            const result = await auth.authAxios.post('/materiales/getMaterialFisicosFiltro', 
            { codMaterialDefinido, estado, codProveedor, desde_fecha, hasta_fecha });
            return { error: undefined, message: 'Success', materialesFisicos: result.data.materialesFisicos };
        } catch (error) {
            if (!error.response) {
                alert(error);
                return { error: 0, message: 'Error Al Tratar De Conectar Al Servidor' };
            }
            return {error: error.response.status, message: error.response.data.message}
        }
    };

    return {getTiposMaterial, getTipo, crearTipoMaterial, editarTipoMaterial, crearSubTipoMaterial, editarSubTipoMaterial,
        getSubTipo, crearMaterial, editarMaterial, getMaterial, getVariantesFiltro, crearVarianteMaterial, editarVarianteMaterial,
        getVariante, crearMaterialFisico, getMaterialFisicosFiltro};
}






