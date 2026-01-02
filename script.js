let qrInstance = null;

// Inicialización
window.onload = () => {
    const ahora = new Date();
    
    // Ajustar fecha local inicial
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    
    // Ajustar hora local inicial
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');

    document.getElementById("fechaManual").value = `${anio}-${mes}-${dia}`;
    document.getElementById("horaManual").value = `${horas}:${minutos}:${segundos}`;
    
    // 1. Generar el primer QR
    generarQR();

    // 2. ACTIVAR ESCUCHA EN TIEMPO REAL
    // Seleccionamos todos los inputs y selects dentro del formulario
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        // 'input' se dispara cada vez que el usuario escribe una letra
        // 'change' se dispara cuando cambia una selección o fecha
        input.addEventListener('input', generarQR);
        input.addEventListener('change', generarQR);
    });
};

function generarQR() {
    const container = document.getElementById("qrcode");
    const rawPreview = document.getElementById("rawTextPreview");
    const downloadBtn = document.getElementById("downloadBtn");
    
    // Limpiamos el contenedor del QR para el nuevo renderizado
    container.innerHTML = "";

    const id = document.getElementById("idTramite").value.trim();
    const mat = document.getElementById("matricula").value.trim();
    const nom = document.getElementById("nombreCompleto").value.trim().toUpperCase();
    const nit = document.getElementById("nit").value.trim();
    const cen = document.getElementById("centro").value.trim().toUpperCase();
    const med = document.getElementById("medico").value.trim().toUpperCase();
    const ciu = document.getElementById("ciudad").value.trim().toUpperCase();
    const tipo = document.getElementById("tipoBaja").value;
    
    const fechaInput = document.getElementById("fechaManual").value;
    const horaInput = document.getElementById("horaManual").value;

    // Formato final de la cadena CNS
    const finalString = `${id} | ${mat} | ${nom} | ${nit} | ${cen} | ${med} | ${ciu}, ${fechaInput} ${horaInput} BAJA POR: ${tipo}`;

    // Actualizar la consola en tiempo real
    rawPreview.innerText = finalString;

    // Generar el QR (con corrección de codificación)
    qrInstance = new QRCode(container, {
        text: unescape(encodeURIComponent(finalString)),
        width: 256,
        height: 256,
        colorDark : "#0f172a",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.M
    });

    // Habilitar botón de descarga
    setTimeout(() => {
        downloadBtn.disabled = false;
    }, 50);
}

function descargarQR() {
    const img = document.querySelector("#qrcode img");
    if (!img) return;
    
    const link = document.createElement("a");
    link.href = img.src;
    link.download = `QR_CNS_${document.getElementById("idTramite").value}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}