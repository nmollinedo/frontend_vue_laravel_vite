import { Api } from "./ApiService";

export default {
    index: () => {
        return Api().get("/programa");
    },
    store: (datos) => {
        return Api().post("/programa", datos);
    },
    show: (id) => {
        return Api().get(`/programa/${id}`);
    },
    update: (id, datos) => {
        return Api().put(`/programa/${id}`, datos);
    },
    eliminarPlanPrograma: (id) => {
        return Api().delete(`/eliminar-plan-programa/${id}`);
    },
    asignarUser: (datos) => {
        return Api().post(`/programa/asignar-user`, datos);
    },
    listarPlanPrograma: () => {
        return Api().get("/plan-programa");
    },
    guardarPlanPrograma: (datos) => {
        return Api().post("/guardar-plan-programa", datos);
    },
    modificarPlanPrograma: (id,datos) => {
        return Api().post(`/modificar-plan-programa/${id}`, datos);
    }
}