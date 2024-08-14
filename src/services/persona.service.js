import { Api } from "./ApiService";

export default {
    index: () => {
        return Api().get("/persona");
    },
    store: (datos) => {
        return Api().post("/persona", datos);
    },
    show: (id) => {
        return Api().get(`/persona/${id}`);
    },
    update: (id, datos) => {
        return Api().put(`/persona/${id}`, datos);
    },
    destroy: (id) => {
        return Api().delete(`/persona/${id}`);
    },
    asignarUser: (datos) => {
        return Api().post(`/persona/asignar-user`, datos);
    }
}