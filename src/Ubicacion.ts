import Punto from "./Punto"

class Ubicacion {
    private puntoAbstracto: Punto
    private puntoConcreto: Punto

    constructor(puntoAbstracto: Punto, puntoConcreto: Punto) {
        this.puntoAbstracto = puntoAbstracto
        this.puntoConcreto = puntoConcreto
    }

    setPuntoAbstracto(punto: Punto): void {
        this.puntoAbstracto = punto
    }

    getPuntoAbstracto(): Punto {
        return this.puntoAbstracto
    }

    setPuntoConcreto(punto: Punto): void {
        this.puntoConcreto = punto
    }

    getPuntoConcreto(): Punto {
        return this.puntoConcreto
    }

    newInstance() {
        return new Ubicacion(this.puntoAbstracto, this.puntoConcreto)
    }
}

export default Ubicacion