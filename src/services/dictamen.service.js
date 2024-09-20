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
    update: (id, datos) => {
        return Api().put(`/dictamen/${id}`, datos);
    },
    destroy: (id) => {
        return Api().delete(`/dictamen-eliminar/${id}`);
    },
    guadarForm: (id,datos) => {
        return Api().post(`/guardar-dictamen/${id}`, datos);
    },
  
}