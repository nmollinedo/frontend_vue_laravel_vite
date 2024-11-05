import { Api } from "./ApiService";

export default {
    reporte: (id) => {
        //return Api().get("/reporte");
        return Api().get(`/reporte/${id}`, { responseType: 'blob' }); // Asegúrate de usar 'blob' para manejar PDF
    }
   
}