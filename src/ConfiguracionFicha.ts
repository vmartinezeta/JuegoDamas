import 'phaser'
import Ficha from './Ficha'

class ConfiguracionFicha extends Phaser.Scene {

    private cartelFicha: Phaser.GameObjects.Sprite | null
    private ficha: Ficha

    constructor() {
        super('configuracion-ficha')
        this.ficha = new Ficha(3, 'ficha-roja')
        this.cartelFicha = null
    }

    getFicha(): Ficha {
        return this.ficha
    }

    create(): void {
        const fondo = this.add.sprite(0, 0, 'fondo-config')
        fondo.setOrigin(0)

        const botonAtras = this.add.sprite(300, 380, 'boton-atras')
        botonAtras.setOrigin(.5)
        botonAtras.setInteractive()
        botonAtras.on('pointerdown', this.cambiarFicha, this)

        this.cartelFicha = this.add.sprite(400, 380, this.ficha.getNombre())

        const botonSiguiente = this.add.sprite(500, 380, 'boton-siguiente')
        botonSiguiente.setOrigin(.5)
        botonSiguiente.setInteractive()
        botonSiguiente.on('pointerdown', this.cambiarFicha, this)

        const botonPlay = this.add.sprite(410, 500, 'boton-play')
        botonPlay.setOrigin(.5)
        botonPlay.setInteractive()
        botonPlay.on('pointerdown', this.iniciarJuego, this)
    }

    iniciarJuego(): void {
        this.scene.start('damas')
    }

    cambiarFicha(): void {
        if (this.cartelFicha !== null) {
            this.cartelFicha.destroy()
        }

        if (this.ficha.isFichaRoja()) {
            this.ficha = new Ficha(1, 'ficha-amarilla')
        } else if (this.ficha.isFichaAmarilla()) {
            this.ficha = new Ficha(3, 'ficha-roja')
        }

        this.cartelFicha = this.add.sprite(400, 380, this.ficha.getNombre())
    }

}

export default ConfiguracionFicha