import { Api } from "./ApiService";

export default {
    index: () => {
        return Api().get("/dictamen");
    },
    store: (datos) => {
        return Api().post(`/dictamen`, datos);
    },
    show: (id) => {
        return Api().get(`/dictamen-listar/${id}`);
    },
    listarTodo: () => {
        return Api().get(`/dictamen-listar-todo`);
    },
    update: (id, datos) => {
        return Api().put(`/dictamen/${id}`, datos);
    },
    destroy: (id,transferencia_id) => {
        return Api().delete(`/dictamen-eliminar/${id}/${transferencia_id}`);
    },
    guadarForm: (id,datos) => {
        return Api().post(`/guardar-dictamen/${id}`, datos);
    },
    mostrarForm: (id) => {
        return Api().get(`/dictamen-mostrar/${id}`);
    },
    modificarForm: (id,datos) => {
        return Api().post(`/modificar-dictamen/${id}`, datos);
    },
    modificarFecha: (id,datos) => {
        return Api().post(`/modificar-dictamen-fecha/${id}`, datos);
    },
    modificarEditFecha: (id,datos) => {
        return Api().post(`/modificar-edit-fecha/${id}`, datos);
    },
    eliminarCierre: (id,datos) => {
        return Api().post(`/eliminar-cierre/${id}`, datos);
    },
    verificarFormulario: (id,datos) => {
        return Api().get(`/verificar-formulario/${id}`);
    },
    mostrarFormEditFecha: (id) => {
        return Api().get(`/dictamen-mostrar-fecha/${id}`);
    },
    listarFormCosto: (id) => {
        return Api().get(`/listar-formulario-costo/${id}`);
    },
    guardarFormCosto: (datos) => {
        return Api().post(`/guardar-formulario-costo`,datos);
    },
    guardarDictamenCosto: (datos) => {
        return Api().post(`/guardar-dictamen`, datos);
    },
    eliminarDictamenCosto: (transferencia_id,componenete_id) => {
        return Api().delete(`/eliminar-dictamen-costo/${transferencia_id}/${componenete_id}`);
    },
    carrarFormularioCosto: (datos) => {
        return Api().post(`/cerrar-formulario-costo`, datos);
    },
    modificarFormularioCosto: (id,datos) => {
        return Api().post(`/modificar-formulario-costo/${id}`, datos);
    }
  
}