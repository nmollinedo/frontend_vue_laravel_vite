import { Api } from "./ApiService";

export default {
    index: () => {
        return Api().get("/componente");
    },
    store: (datos) => {
        return Api().post("/componente", datos);
    },
    show: (id) => {
        return Api().get(`/componente/${id}`);
    },
    update: (id, datos) => {
        return Api().put(`/componente/${id}`, datos);
    },
    destroy: (id) => {
        return Api().delete(`/componente/${id}`);
    }
}