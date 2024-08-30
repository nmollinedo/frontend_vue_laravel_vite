import { Api } from "./ApiService";

export default {
    index: () => {
        return Api().get("/area");
    },
    store: (datos) => {
        return Api().post("/area", datos);
    },
    show: (id) => {
        return Api().get(`/area/${id}`);
    },
    update: (id, datos) => {
        return Api().put(`/area/${id}`, datos);
    },
    destroy: (id) => {
        return Api().delete(`/area/${id}`);
    },
    asignarUser: (datos) => {
        return Api().post(`/area/asignar-user`, datos);
    }
}