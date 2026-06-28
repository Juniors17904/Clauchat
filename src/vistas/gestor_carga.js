// Gestiona la pantalla de carga inicial (el logo que se ve al abrir la app).
// Mantiene el logo quieto y centrado, y lo desvanece suavemente cuando la
// app ya está montada, evitando el salto de posición al arrancar.
export class GestorCarga {
    #elemento;
    #duracionFade;
    #tiempoMinimo;

    constructor(idElemento = 'splash', duracionFade = 400, tiempoMinimo = 600) {
        this.#elemento = document.getElementById(idElemento);
        this.#duracionFade = duracionFade;
        this.#tiempoMinimo = tiempoMinimo;
    }

    ocultarCuandoListo() {
        if (!this.#elemento) return;
        requestAnimationFrame(() => {
            setTimeout(() => this.#desvanecer(), this.#tiempoMinimo);
        });
    }

    #desvanecer() {
        if (!this.#elemento) return;
        this.#elemento.style.transition = `opacity ${this.#duracionFade}ms ease`;
        this.#elemento.style.opacity = '0';
        setTimeout(() => {
            this.#elemento?.remove();
            this.#elemento = null;
        }, this.#duracionFade);
    }
}
