import { Api } from "./ApiService";

export default {
    index: () => {
        return Api().get("/departamento");
    },
    store: (datos) => {
        return Api().post("/plan", datos);
    },
    show: (id) => {
        return Api().get(`/plan/${id}`);
    },
    update: (id, datos) => {
        return Api().put(`/plan/${id}`, datos);
    },
    destroy: (id) => {
        return Api().delete(`/plan/${id}`);
    },
    asignarUser: (datos) => {
        return Api().post(`/plan/asignar-user`, datos);
    }
}