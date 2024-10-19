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
    destroy: (transferencia_id,componenete_id) => {
        return Api().delete(`/eliminar-componente/${transferencia_id}/${componenete_id}`);
    }
    ,
    modificarComponente: (id, datos) => {
        return Api().post(`/modificar-componente/${id}`, datos);
    }
}