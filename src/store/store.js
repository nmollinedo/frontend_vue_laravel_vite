import { reactive } from 'vue';

// Obtenemos los datos del localStorage (si existen) al cargar la página
const storedEntidadId = localStorage.getItem('entidad_id');
const storedCodigoPresupuestario = localStorage.getItem('codigo_presupuestario');

// Estado reactivo global
export const store = reactive({
  entidad_id: storedEntidadId || null, // Si no hay datos en localStorage, empieza como null
  codigo_presupuestario: storedCodigoPresupuestario || null, // Si no hay datos en localStorage, empieza como null
  

  // Función para actualizar la entidad y guardarla en el localStorage
  setEntidadId(id) {
    this.entidad_id = id;
    localStorage.setItem('entidad_id', id);  // Guardamos en localStorage
  },

    // Función para actualizar la entidad y guardarla en el localStorage
    setCodigoPresupuestario(id) {
        this.codigo_presupuestario = id;
        localStorage.setItem('codigo_presupuestario', id);  // Guardamos en localStorage
      },

  // Función para limpiar el localStorage (ejemplo: cuando el usuario cierra sesión)
  clearEntidadId() {
    this.entidad_id = null;
    localStorage.removeItem('entidad_id');
  }
});
