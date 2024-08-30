import { Api } from "./ApiService";

export default {
    index: () => {
        return Api().get("/entidad");
    },
    store: (datos) => {
        return Api().post("/entidad", datos);
    },
    show: (id) => {
        return Api().get(`/entidad/${id}`);
    },
    update: (id, datos) => {
        return Api().put(`/entidad/${id}`, datos);
    },
    destroy: (id) => {
        return Api().delete(`/antidad/${id}`);
    },
    asignarUser: (datos) => {
        return Api().post(`/entidad/asignar-user`, datos);
    }
}