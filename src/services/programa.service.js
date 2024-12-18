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
    guardarPlanesProgramas: (datos) => {
        return Api().post("/guardar-planes-programas", datos);
    },
    modificarPlanPrograma: (id,datos) => {
        return Api().post(`/modificar-plan-programa/${id}`, datos);
    },
    listarPrograma: (entidad_id,id) => {
        return Api().get(`/listar-programa/${entidad_id}/${id}`);
    },
    listarRelPlanPrograma: (id) => {
        return Api().get(`/rel-plan-programa/${id}`);
    },
    eliminarRelPlanPrograma: (id) => {
        return Api().delete(`/eliminar-rel-plan-programa/${id}`);
    }


}