import 'phaser'

class MenuPrincipal extends Phaser.Scene {

    constructor() {
        super('menu-principal')
    }

    preload(): void {
        const progress: Phaser.GameObjects.Graphics = this.add.graphics()
        this.load.setPath('/')
        this.load.on('progress', (value: number) => {
            progress.clear()
            progress.fillStyle(0x00ff34, 1)
            progress.fillRect(0, 270, 1024 * value, 60)
        })

        this.load.on('complete', () => progress.destroy())

        this.load.image('ficha-amarilla', 'ficha-amarilla.png')
        this.load.image('ficha-espacio', 'ficha-espacio.png')
        this.load.image('ficha-roja', 'ficha-roja.png')
        this.load.image('ficha-reina-roja', 'ficha-reina-roja.png')
        this.load.image('ficha-reina-amarilla', 'ficha-reina-amarilla.png')        
        this.load.image('tablero', 'tablero.png')
        this.load.image('ficha-espacio-activo', 'ficha-espacio-activo.png')

        this.load.image('menu-principal', 'menu-principal.png')
        this.load.image('fondo-config', 'fondo-config.png')
        this.load.image('boton-play', 'boton-play.png')
        this.load.image('boton-ayuda', 'boton-ayuda.png')
        this.load.image('boton-reintentar', 'boton-reintentar.png')
        this.load.image('boton-deshacer', 'boton-deshacer.png')

        this.load.image('titulo-turno', 'titulo-turno.png')
        this.load.image('rotulo-ganador', 'rotulo-ganador.png')
        this.load.image('rotulo-empate', 'rotulo-empate.png')
        this.load.image('boton-atras', 'boton-atras.png')
        this.load.image('boton-siguiente', 'boton-siguiente.png')
    }

    create(): void {
        const ancho: number = Number(this.game.config.width) / 2
        const altura: number = 400
        const fondo = this.add.sprite(0, 0, 'menu-principal')
        fondo.setOrigin(0)
        this.children.sendToBack(fondo)

        const botonPlay = this.add.sprite(ancho - 10, altura, 'boton-play')
        botonPlay.setOrigin(1, 0)
        botonPlay.setInteractive()
        botonPlay.on('pointerdown', this.iniciarJuego, this)

        const botonAyuda = this.add.sprite(ancho + 10, altura, 'boton-ayuda')
        botonAyuda.setInteractive()
        botonAyuda.setOrigin(0)
        botonAyuda.on('pointerdown', this.configurarFicha, this)
    }

    iniciarJuego(): void {
        this.scene.start('damas')
    }

    configurarFicha():void {
        this.scene.start('configuracion-ficha')
    }

}

export default MenuPrincipal