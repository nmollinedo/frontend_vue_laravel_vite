import axios from "axios";

const url_base = "http://127.0.0.1:8000/api";

export function Api(){
    let token = localStorage.getItem("access_token");

    const api = axios.create({
        baseURL: url_base,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+token
        }
    });

    // interceptor (errores 401, 403)
    api.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if(error.response.status == 401) {
                console.log("INTERCEPTOR *******");
                localStorage.removeItem("access_token");
                
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }
    )


    return api;
}