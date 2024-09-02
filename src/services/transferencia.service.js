import { Api } from "./ApiService";

export default {
    index: () => {
        return Api().get("/transferencia");
    },
    store: (datos) => {
        return Api().post("/registrar-transferencia", datos);
    },
    show: (id) => {
        return Api().get(`/transferencia/${id}`);
    },
    update: (id, datos) => {
        return Api().put(`/transferencia/${id}`, datos);
    },
    destroy: (id) => {
        return Api().delete(`/transferencia/${id}`);
    },
    actualizarTranferencia: (id,datos) => {
        return Api().post(`/modificar-transferencia/${id}`, datos);
    },
    guardarProblematica: (id,datos) => {
        return Api().post(`/guardar-problematica/${id}`, datos);
    },
    guardarLocalizacion: (id,datos) => {
        return Api().post(`/guardar-localizacion/${id}`, datos);
    }
}