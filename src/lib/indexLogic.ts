// Lógica del cliente extraída desde src/pages/index.astro
type Comprador = {
  nombre: string;
  email: string;
  telefono: string;
  compraId?: string;
};

const estado = {
  precioBoleta: 100,
  boletasVendidas: 0,
  totalRecaudado: 0,
  totalParticipantes: 0,
  totalSorteos: 0,
  proximoNumeroBoleta: 1,
};

function generarNumeroBoleta(): string {
  const numero = estado.proximoNumeroBoleta.toString().padStart(6, "0");
  estado.proximoNumeroBoleta++;
  return `BOL-${numero}`;
}

function actualizarEstadisticas() {
  const boletasVendidas = document.getElementById("boletasVendidas");
  const totalRecaudado = document.getElementById("totalRecaudado");
  const totalParticipantes = document.getElementById("totalParticipantes");
  const totalSorteos = document.getElementById("totalSorteos");

  if (boletasVendidas) boletasVendidas.textContent = estado.boletasVendidas.toString();
  if (totalRecaudado) totalRecaudado.textContent = `$${estado.totalRecaudado} USD`;
  if (totalParticipantes) totalParticipantes.textContent = estado.totalParticipantes.toString();
  if (totalSorteos) totalSorteos.textContent = estado.totalSorteos.toString();
}

// Simulaciones / stubs para Firebase (se pueden reemplazar)
async function guardarCompraEnFirebase(datosCompra: any) {
  console.log("Guardando compra en Firebase:", datosCompra);
  return "compra_" + Date.now();
}

async function generarBoletasEnFirebase(
  cantidad: number,
  compraId: string,
  comprador: string,
  email: string,
) {
  console.log(`Generando ${cantidad} boletas en Firebase para compra ${compraId}`);
  return Array.from({ length: cantidad }, () => generarNumeroBoleta());
}

async function realizarSorteoEnFirebase(numeroBoleta: string, ganador: any) {
  console.log(`Realizando sorteo en Firebase para boleta ${numeroBoleta}`);
  return true;
}

async function realizarSorteo(comprador: Comprador) {
  const resultadoSorteo = document.getElementById("resultadoSorteo");
  const ganadorNombre = document.getElementById("ganadorNombre");
  const ganadorBoleta = document.getElementById("ganadorBoleta");
  const ganadorFecha = document.getElementById("ganadorFecha");

  const boletasDisponibles = Array.from({ length: estado.boletasVendidas }, (_, i) => i + 1);
  const indiceGanador = Math.floor(Math.random() * (boletasDisponibles.length || 1));
  const numeroBoletaGanadora = generarNumeroBoleta();

  const resultado = {
    ganador: comprador.nombre,
    email: comprador.email,
    numeroBoleta: numeroBoletaGanadora,
    fecha: new Date().toLocaleString("es-ES"),
    compraId: comprador.compraId,
  };

  await realizarSorteoEnFirebase(numeroBoletaGanadora, resultado);

  estado.totalSorteos++;

  if (ganadorNombre) ganadorNombre.textContent = resultado.ganador;
  if (ganadorBoleta) ganadorBoleta.textContent = `Boleta Ganadora: ${numeroBoletaGanadora}`;
  if (ganadorFecha) ganadorFecha.textContent = resultado.fecha;
  if (resultadoSorteo) resultadoSorteo.classList.remove("hidden");

  actualizarEstadisticas();
}

export default function initSorteo() {
  const formCompra = document.getElementById("formCompra") as HTMLFormElement | null;
  const cantidadInput = document.getElementById("cantidad") as HTMLInputElement | null;
  const metodoPagoInputs = document.querySelectorAll('input[name="metodoPago"]') as NodeListOf<HTMLInputElement> | null;
  const infoTarjeta = document.getElementById("infoTarjeta") as HTMLDivElement | null;
  const resumenCantidad = document.getElementById("resumenCantidad") as HTMLElement | null;
  const resumenSubtotal = document.getElementById("resumenSubtotal") as HTMLElement | null;
  const resumenTotal = document.getElementById("resumenTotal") as HTMLElement | null;

  const confirmacionCompra = document.getElementById("confirmacionCompra") as HTMLDivElement | null;
  const numeroBoleta = document.getElementById("numeroBoleta") as HTMLElement | null;
  const btnCerrarConfirmacion = document.getElementById("btnCerrarConfirmacion") as HTMLButtonElement | null;

  const btnCerrarResultado = document.getElementById("btnCerrarResultado") as HTMLButtonElement | null;
  const resultadoSorteo = document.getElementById("resultadoSorteo") as HTMLDivElement | null;

  // Eventos y comportamientos
  if (cantidadInput && resumenCantidad && resumenSubtotal && resumenTotal) {
    cantidadInput.addEventListener("input", () => {
      const cantidad = parseInt(cantidadInput.value) || 1;
      const subtotal = cantidad * estado.precioBoleta;

      resumenCantidad.textContent = `Cantidad: ${cantidad} boleta${cantidad > 1 ? "s" : ""}`;
      resumenSubtotal.textContent = `$${subtotal} USD`;
      resumenTotal.textContent = `$${subtotal} USD`;
    });
  }

  if (metodoPagoInputs && infoTarjeta) {
    metodoPagoInputs.forEach((input) => {
      input.addEventListener("change", () => {
        if (input.value === "tarjeta") {
          infoTarjeta.classList.remove("hidden");
        } else {
          infoTarjeta.classList.add("hidden");
        }
      });
    });
  }

  const numeroTarjetaInput = document.getElementById("numeroTarjeta") as HTMLInputElement | null;
  if (numeroTarjetaInput) {
    numeroTarjetaInput.addEventListener("input", (e) => {
      let value = (e.target as HTMLInputElement).value.replace(/\s/g, "");
      value = value.match(/.{1,4}/g)?.join(" ") || value;
      (e.target as HTMLInputElement).value = value;
    });
  }

  const fechaVencimientoInput = document.getElementById("fechaVencimiento") as HTMLInputElement | null;
  if (fechaVencimientoInput) {
    fechaVencimientoInput.addEventListener("input", (e) => {
      let value = (e.target as HTMLInputElement).value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2, 4);
      }
      (e.target as HTMLInputElement).value = value;
    });
  }

  if (formCompra) {
    formCompra.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(formCompra);
      const datosCompra: any = {
        nombre: formData.get("nombre") as string,
        email: formData.get("email") as string,
        telefono: formData.get("telefono") as string,
        cantidad: parseInt(formData.get("cantidad") as string),
        metodoPago: formData.get("metodoPago") as string,
        total: parseInt(formData.get("cantidad") as string) * estado.precioBoleta,
        fecha: new Date().toISOString(),
        pagado: true,
      };

      if (datosCompra.metodoPago === "tarjeta") {
        const numeroTarjeta = formData.get("numeroTarjeta") as string;
        const fechaVencimiento = formData.get("fechaVencimiento") as string;
        const nombreTarjeta = formData.get("nombreTarjeta") as string;
        const cvv = formData.get("cvv") as string;

        if (!numeroTarjeta || !fechaVencimiento || !nombreTarjeta || !cvv) {
          alert("Por favor, completa toda la información de la tarjeta.");
          return;
        }
      }

      const btnComprar = document.getElementById("btnComprar") as HTMLButtonElement | null;
      const initialBtnContent = btnComprar?.innerHTML ?? "";
      const spinnerSvg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6 animate-spin inline-block mr-2 align-middle" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V2Z" opacity=".4"/><path fill="currentColor" d="M12 2v2a8 8 0 0 0-8 8H2a10 10 0 0 1 10-10Z"/></svg>';
      if (btnComprar) {
        btnComprar.disabled = true;
        btnComprar.innerHTML = spinnerSvg + " Procesando compra...";
      }

      try {
        const compraId = await guardarCompraEnFirebase(datosCompra);

        const boletas = await generarBoletasEnFirebase(
          datosCompra.cantidad,
          compraId,
          datosCompra.nombre,
          datosCompra.email,
        );

        estado.boletasVendidas += datosCompra.cantidad;
        estado.totalRecaudado += datosCompra.total;
        estado.totalParticipantes++;

        if (numeroBoleta) numeroBoleta.textContent = boletas[0];
        if (confirmacionCompra) confirmacionCompra.classList.remove("hidden");
        formCompra.reset();
        if (infoTarjeta) infoTarjeta.classList.add("hidden");

        actualizarEstadisticas();

        await realizarSorteo({
          nombre: datosCompra.nombre,
          email: datosCompra.email,
          telefono: datosCompra.telefono,
          compraId: compraId,
        });
      } catch (error) {
        console.error("Error al procesar la compra:", error);
        alert("Hubo un error al procesar tu compra. Por favor, intenta de nuevo.");
      } finally {
        if (btnComprar && initialBtnContent) {
          btnComprar.disabled = false;
          btnComprar.innerHTML = initialBtnContent;
        }
      }
    });
  }

  if (btnCerrarConfirmacion) {
    btnCerrarConfirmacion.addEventListener("click", () => {
      if (confirmacionCompra) confirmacionCompra.classList.add("hidden");
    });
  }

  if (btnCerrarResultado && resultadoSorteo) {
    btnCerrarResultado.addEventListener("click", () => {
      resultadoSorteo.classList.add("hidden");
    });
  }

  const formContacto = document.getElementById("formContacto") as HTMLFormElement | null;
  if (formContacto) {
    formContacto.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(formContacto);
      const datosContacto = {
        nombre: formData.get("nombre") as string,
        email: formData.get("email") as string,
        asunto: formData.get("asunto") as string,
        mensaje: formData.get("mensaje") as string,
        fecha: new Date().toISOString(),
      };

      console.log("Mensaje de contacto:", datosContacto);
      alert("¡Gracias por contactarnos! Te responderemos pronto.");
      formContacto.reset();
    });
  }

  actualizarEstadisticas();
}

export { estado, generarNumeroBoleta, actualizarEstadisticas };
