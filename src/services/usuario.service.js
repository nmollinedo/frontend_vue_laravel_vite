import { Api } from "./ApiService";

export default {
    index: () => {
        return Api().get("/usuario");
    },
    store: (datos) => {
        return Api().post("/usuario", datos);
    },
    show: (id) => {
        return Api().get(`/usuario/${id}`);
    },
    update: (id, datos) => {
        return Api().put(`/usuario/${id}`, datos);
    },
    destroy: (id) => {
        return Api().delete(`/usuario/${id}`);
    },
    asignarPersona: (datos) => {
        return Api().post(`/usuario/asignar-persona`, datos);
    }
}