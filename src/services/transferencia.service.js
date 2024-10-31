import { Api } from "./ApiService";

export default {
    index: (id) => {
        return Api().get(`/listar-transferencia/${id}`);
    },
    store: (datos) => {
        return Api().post("/registrar-transferencia", datos);
    },
    show: (id) => {
        return Api().get(`/transferencia/${id}`);
    },
    update: (id, datos) => {
        return Api().put(`/transferencia/${id}`, datos);
    },
    destroy: (id) => {
        return Api().delete(`/eliminar-transferencia/${id}`);
    },
    actualizarTranferencia: (id,datos) => {
        return Api().post(`/modificar-transferencia/${id}`, datos);
    },
    guardarProblematica: (id,datos) => {
        return Api().post(`/guardar-problematica/${id}`, datos);
    },
    guardarLocalizacion: (id,datos) => {
        return Api().post(`/guardar-localizacion/${id}`, datos);
    },
    activarCierre: (id) => {
        return Api().get(`/activar-cierre/${id}`);
    },
    cierreFormulario: (id) => {
        return Api().get(`/cierre-formulario/${id}`); 
    },
    filtrarTransferencia: (entidadId,estado_id) => {
        return Api().get(`/filtrar-transferencia/${entidadId}/${estado_id}`); //filtrar-transferencia
    },
    listarTrafrenciaFormulario: (id) => {
        return Api().get(`/listar-transferencia-formulario/${id}`);
    },
    guardarPunto: (id) => {
        return Api().post(`/guardar-punto/${id}`);
    }
}