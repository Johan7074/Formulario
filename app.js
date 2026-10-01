const detallesProblema = {
    ambiental: ["Contaminación de cuerpo de agua", "Acumulación masiva de basura", "Tala de árboles no autorizada"],
    infraestructura: ["Vía en mal estado/Huecos", "Falta de señalización", "Iluminación defectuosa en ruta"],
    software: ["El mapa no carga", "La ruta calculada es incorrecta", "Error al iniciar sesión"]
};

const selectTipo = document.getElementById('tipo_problema');
const selectDetalle = document.getElementById('detalle_problema');
const textareaSugerencias = document.getElementById('sugerencias');
const contadorText = document.getElementById('contador');
const mensajeDiv = document.getElementById('mensajeSistema');

selectTipo.addEventListener('change', function() {
    const tipoSeleccionado = this.value;
    selectDetalle.innerHTML = '<option value="" disabled selected>Selecciona el detalle...</option>';

    if (tipoSeleccionado) {
        selectDetalle.disabled = false;
        detallesProblema[tipoSeleccionado].forEach(detalle => {
            const opcion = document.createElement('option');
            opcion.value = detalle;
            opcion.textContent = detalle;
            selectDetalle.appendChild(opcion);
        });
    }
});

textareaSugerencias.addEventListener('input', function() {
    contadorText.textContent = this.value.length;
});

let temporizadorMensaje;

function mostrarMensaje(texto, tipo) {
    clearTimeout(temporizadorMensaje);
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `mensaje-sistema ${tipo}`;

    temporizadorMensaje = setTimeout(() => {
        mensajeDiv.className = 'oculto';
    }, 5000);
}

document.getElementById('formularioEcoRuta').addEventListener('submit', async function(evento) {
    evento.preventDefault();

    const boton = document.getElementById('btnEnviar');
    boton.disabled = true;
    boton.textContent = 'Enviando reporte...';

    const formData = new FormData(this);
    const direccion = `${formData.get('tipo_via')} ${formData.get('numero_via')} # ${formData.get('numero_cruce')} - ${formData.get('numero_placa')}`;
    formData.append('direccion_completa', direccion);

    try {
        const respuesta = await fetch('https://formspree.io/f/mbglervb', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (respuesta.ok) {
            mostrarMensaje('¡Reporte enviado exitosamente a la base de EcoRuta!', 'exito');
            this.reset();
            selectDetalle.disabled = true;
            contadorText.textContent = '0';
        } else {
            mostrarMensaje('Hubo un error al comunicarse con el servidor.', 'error');
        }
    } catch (error) {
        mostrarMensaje('Fallo de red. Verifica tu conexión a internet.', 'error');
    } finally {
        boton.disabled = false;
        boton.textContent = 'Enviar Reporte';
    }
});