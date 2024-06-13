import Ficha from "./Ficha"
import FichaFactory from "./FichaFactory"


class Imagen extends Phaser.GameObjects.Sprite implements FichaFactory {
    private ficha: Ficha

    constructor(scene: Phaser.Scene, ficha:Ficha) {
        const ubicacion = ficha.getUbicacion()
        const concreto = ubicacion.getPuntoConcreto()
        super(scene, concreto.getX(), concreto.getY(), ficha.getNombre())
        this.setOrigin(.5)
        this.setInteractive()
        this.ficha = ficha
    }

    toFicha(): Ficha {
        return this.ficha
    }
}

export default Imagen