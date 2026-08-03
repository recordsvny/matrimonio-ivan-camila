// Fecha del matrimonio: 20 de febrero de 2027, 17:00, hora de Chile
const fechaMatrimonio = new Date("2027-02-20T17:00:00-03:00").getTime();

// Apertura de la invitación
const invitationIntro = document.getElementById("invitationIntro");
const abrirInvitacion = document.getElementById("abrirInvitacion");
const musica = document.getElementById("musica");
const btnMusica = document.getElementById("btnMusica");

abrirInvitacion.addEventListener("click", () => {
  musica.volume = 0.55;
  const inicioMusica = musica.play();

  invitationIntro.classList.add("intro-closing");
  document.body.classList.remove("intro-active");

  inicioMusica
    .then(() => {
      btnMusica.textContent = "❚❚ Pausar música";
    })
    .catch(() => {
      btnMusica.textContent = "♫ Reproducir música";
    });

  window.setTimeout(() => {
    invitationIntro.hidden = true;
  }, 850);
});

const elementos = {
  dias: document.getElementById("dias"),
  horas: document.getElementById("horas"),
  minutos: document.getElementById("minutos"),
  segundos: document.getElementById("segundos"),
};

function actualizarContador() {
  const ahora = Date.now();
  const diferencia = fechaMatrimonio - ahora;

  if (diferencia <= 0) {
    elementos.dias.textContent = "000";
    elementos.horas.textContent = "00";
    elementos.minutos.textContent = "00";
    elementos.segundos.textContent = "00";
    return;
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
  const segundos = Math.floor((diferencia / 1000) % 60);

  elementos.dias.textContent = String(dias).padStart(3, "0");
  elementos.horas.textContent = String(horas).padStart(2, "0");
  elementos.minutos.textContent = String(minutos).padStart(2, "0");
  elementos.segundos.textContent = String(segundos).padStart(2, "0");
}

actualizarContador();
setInterval(actualizarContador, 1000);

// Animaciones al hacer scroll
const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((elemento) => observador.observe(elemento));

// Música
btnMusica.addEventListener("click", async () => {
  try {
    if (musica.paused) {
      await musica.play();
      btnMusica.textContent = "❚❚ Pausar música";
    } else {
      musica.pause();
      btnMusica.textContent = "♫ Reproducir música";
    }
  } catch (error) {
    alert("Agrega el archivo music/cancion.mp3 para activar la música.");
  }
});

// Galería ampliada
const lightbox = document.getElementById("lightbox");
const imagenLightbox = document.getElementById("imagenLightbox");
const cerrarLightbox = document.getElementById("cerrarLightbox");

document.querySelectorAll(".gallery-item img").forEach((imagen) => {
  imagen.addEventListener("click", () => {
    imagenLightbox.src = imagen.src;
    imagenLightbox.alt = imagen.alt;
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function cerrarGaleria() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
}

cerrarLightbox.addEventListener("click", cerrarGaleria);

lightbox.addEventListener("click", (evento) => {
  if (evento.target === lightbox) {
    cerrarGaleria();
  }
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") {
    cerrarGaleria();
  }
});

// Copiar datos bancarios en un formato compatible con apps bancarias
const copiarDatos = document.getElementById("copiarDatos");
const copyFeedback = document.getElementById("copyFeedback");

copiarDatos.addEventListener("click", async () => {
  const lineas = [...document.querySelectorAll("#datosTransferencia [data-copy]")]
    .map((elemento) => elemento.dataset.copy);
  const texto = lineas.join("\n");

  try {
    await navigator.clipboard.writeText(texto);
  } catch (error) {
    const areaTemporal = document.createElement("textarea");
    areaTemporal.value = texto;
    areaTemporal.setAttribute("readonly", "");
    areaTemporal.style.position = "fixed";
    areaTemporal.style.opacity = "0";
    document.body.appendChild(areaTemporal);
    areaTemporal.select();
    document.execCommand("copy");
    areaTemporal.remove();
  }

  copiarDatos.classList.add("copied");
  copiarDatos.innerHTML = '<span aria-hidden="true">✓</span> Datos copiados';
  copyFeedback.textContent = "Los datos de transferencia fueron copiados.";

  window.setTimeout(() => {
    copiarDatos.classList.remove("copied");
    copiarDatos.innerHTML = '<span aria-hidden="true">⧉</span> Copiar datos';
    copyFeedback.textContent = "";
  }, 3000);
});
