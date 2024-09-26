import { Api } from "./ApiService";

export default {
    index: () => {
        return Api().get("/listar-tipo");
    },
    store: (datos) => {
        return Api().post(`/tipo-dictamen`, datos);
    },
    show: (id) => {
        return Api().get(`/listar-tipo-dictamen/${id}`);
    },
    update: (id, datos) => {
        return Api().put(`/dictamen/${id}`, datos);
    },
    destroy: (id) => {
        return Api().delete(`/dictamen-eliminar/${id}`);
    },
  
  
}