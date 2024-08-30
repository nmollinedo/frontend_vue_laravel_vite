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
    destroy: (id) => {
        return Api().delete(`/programa/${id}`);
    },
    asignarUser: (datos) => {
        return Api().post(`/programa/asignar-user`, datos);
    }
}