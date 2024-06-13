import 'phaser'
import CuadriculaFactory from './CuadriculaFactory'
import Cuadricula from './Cuadricula'
import Ficha from './Ficha'
import EspacioVacio from './EspacioVacio'
import SuperFicha from './SuperFicha'
import Imagen from './Imagen'
import Punto from './Punto'
import Ubicacion from './Ubicacion'
import SistemaRutaFactory from './SistemaRutaFactory'
import Ruta from './Ruta'
import ConfiguracionFicha from './ConfiguracionFicha'
import CapturaCuadricula from './CapturaCuadricula'


class Game extends Phaser.Scene {
    private cuadricula!: Cuadricula
    private extremosRuta: Ficha[]
    private fichaEnJuego!: Ficha
    private rutas: Ruta[]
    private tablero!: Phaser.Physics.Arcade.StaticGroup
    private cartelTurno!: Phaser.Physics.Arcade.StaticGroup
    private movimientoNormal: number
    private pilaCapturaCuadricula: CapturaCuadricula[]

    constructor() {
        super('damas')
        this.extremosRuta = []
        this.rutas = []
        this.movimientoNormal = 0
        this.pilaCapturaCuadricula = []
    }

    create(): void {
        this.add.sprite(0, 75, 'tablero').setOrigin(0)
        const cuadriculaFactory: CuadriculaFactory = new CuadriculaFactory()
        this.cuadricula = cuadriculaFactory.crear()
        this.redibujarTablero()
        this.setFichaEnJuego()
        this.activarFichasEnJuego()
        this.redibujarTurno()

        const botonReintentar = this.add.sprite(600, 120, 'boton-reintentar')
        botonReintentar.setOrigin(1, 0)
        botonReintentar.setInteractive()
        botonReintentar.on('pointerdown', this.reintentar, this)

        const botonDeshacer = this.add.sprite(620, 120, 'boton-deshacer')
        botonDeshacer.setInteractive()
        botonDeshacer.setOrigin(0)
        botonDeshacer.on('pointerdown', this.deshacer, this)
    }

    reintentar(): void {
        const cuadriculaFactory: CuadriculaFactory = new CuadriculaFactory()
        this.cuadricula = cuadriculaFactory.crear()
        this.redibujarTablero()
        this.setFichaEnJuego()
        this.activarFichasEnJuego()
        this.redibujarTurno()
        this.pilaCapturaCuadricula = []
    }

    deshacer(): void {
        if (this.pilaCapturaCuadricula.length === 0) {
            return
        }
        const captura:CapturaCuadricula = this.pilaCapturaCuadricula.pop()!
        this.cuadricula = captura.getCuadricula()
        this.redibujarTablero()
        this.fichaEnJuego = captura.getFicha()
        this.activarFichasEnJuego()
        this.redibujarTurno()
    }

    redibujarTurno(): void {
        if (this.cartelTurno !== void 0) this.cartelTurno.destroy(true)
        this.cartelTurno = this.physics.add.staticGroup()
        this.cartelTurno.create(0, 120 + 13.5, 'titulo-turno').setOrigin(0)
        this.cartelTurno.create(310, 120, this.fichaEnJuego.getNombre()).setOrigin(0)
    }

    redibujarTablero(): void {
        if (this.tablero !== void 0) this.tablero.destroy(true)
        this.tablero = this.physics.add.staticGroup()
        const fichas: Ficha[] = this.cuadricula.toFichas()
        for (let ficha of fichas) {
            if (ficha instanceof EspacioVacio) continue
            const fichaEnJuego: Imagen = new Imagen(this, ficha)
            this.tablero.add(fichaEnJuego, true)
        }
        this.input.off('gameobjectdown')
        this.input.on('gameobjectdown', this.hacerMovimiento, this)
    }

    setFichaEnJuego(): void {
        const manager = this.scene.manager
        const escena: ConfiguracionFicha = manager.getScene('configuracion-ficha') as ConfiguracionFicha
        this.fichaEnJuego = escena.getFicha()
    }

    bloquearTablero(): void {
        this.tablero.getChildren().forEach(imagen => {
            imagen.disableInteractive()
        })
    }

    activarFichasEnJuego(): void {
        this.bloquearTablero()
        this.tablero.getChildren().forEach(img => {
            const imagen = img as Imagen
            if ((this.fichaEnJuego.isFichaRoja() && imagen.toFicha().isFichaRoja())
                || (this.fichaEnJuego.isFichaAmarilla() && imagen.toFicha().isFichaAmarilla())) {
                imagen.setInteractive()
            }
        })
    }

    hacerMovimiento(_:any, imagen: Imagen) {
        if (!(imagen instanceof Imagen)) {
            return
        }
        this.extremosRuta.push(imagen.toFicha())
        if (this.inicioMovimiento()) {
            this.iniciarMovimiento()
        } else if (this.finalizoMovimiento()) {
            this.finalizarMovimiento()
        }
    }

    inicioMovimiento(): boolean {
        return this.extremosRuta.length === 1
    }

    finalizoMovimiento(): boolean {
        return this.extremosRuta.length === 2
    }

    iniciarMovimiento() {
        const [origen] = this.extremosRuta
        const ficha: SuperFicha = origen as SuperFicha
        this.sistematizarRuta(ficha)
        if (this.rutas.length === 0) {
            this.extremosRuta = []
            return
        }

        this.marcarEspaciosDisponibles()
        this.activarFichasEnJuego()
        this.habilitarRutasDisponible()
    }

    finalizarMovimiento() {
        const [origen, destino] = this.extremosRuta
        const puntoOrigen = origen.getUbicacion().getPuntoAbstracto()
        const puntoDestino = destino.getUbicacion().getPuntoAbstracto()
        if (puntoOrigen.toString() === puntoDestino.toString()) {
            this.desmarcarEspaciosDisponibles()
            this.redibujarTablero()
            this.activarFichasEnJuego()
            this.extremosRuta = []
            this.rutas = []
            return
        } else if (!destino.isEspacio()) {
            this.desmarcarEspaciosDisponibles()
            this.extremosRuta =[]
            this.extremosRuta.push(destino)
            this.rutas = []

            const ficha: SuperFicha = destino as SuperFicha
            this.sistematizarRuta(ficha)
            if (this.rutas.length === 0) {
                this.extremosRuta = []
                this.rutas = []
                this.redibujarTablero()
                this.activarFichasEnJuego()
                return
            }

            this.marcarEspaciosDisponibles()
            this.activarFichasEnJuego()
            this.habilitarRutasDisponible()
            this.redibujarTablero()
            return
        }

        this.desmarcarEspaciosDisponibles()

        const cuadricula:Cuadricula = this.cuadricula.newInstance()
        const captura:CapturaCuadricula = new CapturaCuadricula(cuadricula, this.fichaEnJuego)
        this.pilaCapturaCuadricula.push(captura)

        const ruta = this.determinarRuta()
        if (ruta.tieneKO()) {
            this.movimientoConKO()
            this.movimientoNormal = 0
        } else {
            this.intercambiarExtremosRuta()
            this.movimientoNormal++
        }

        this.coronarFichaEnJuego()
        this.redibujarTablero()
        this.intercambiarFichaEnJuego()
        this.activarFichasEnJuego()
        this.redibujarTurno()
        this.extremosRuta = []
        this.rutas = []
        this.cerrarJuego()
    }

    intercambiarFichaEnJuego(): void {
        if (this.fichaEnJuego.isFichaRoja()) {
            this.fichaEnJuego = new Ficha(1, 'ficha-amarilla')
        } else if (this.fichaEnJuego.isFichaAmarilla()) {
            this.fichaEnJuego = new Ficha(3, 'ficha-roja')
        }
    }

    cerrarJuego(): void {
        if (this.hayGanador() || this.movimientoNormal === 25) {
            const ancho: number = Number(this.game.config.width) * .5
            const altura: number = Number(this.game.config.height) * .5
            if (this.hayGanador()) {
                this.add.sprite(ancho, altura, 'rotulo-ganador').setOrigin(.5)
            } else {
                this.add.sprite(ancho, altura, 'rotulo-empate').setOrigin(.5)
            }

            this.time.addEvent({ delay: 5000, callback: this.irMenuPrincipal, callbackScope: this })
        }
    }

    hayGanador(): boolean {
        const amarillas = this.cuadricula.fromId(1)
        const rojas = this.cuadricula.fromId(3)
        const total = amarillas.length + rojas.length
        return total === amarillas.length || total === rojas.length
            || this.estaInmovilFichaEnJuego()
    }

    estaInmovilFichaEnJuego(): boolean {
        const fichasEnJuego = this.cuadricula.fromId(this.fichaEnJuego.getId())
        let bloqueos: number = 0
        for (let ficha of fichasEnJuego) {
            const fichaEnJuego: SuperFicha = ficha as SuperFicha
            this.sistematizarRuta(fichaEnJuego)
            if (this.rutas.length === 0) {
                bloqueos++
            }
            this.rutas = []
        }
        return bloqueos === fichasEnJuego.length        
    }

    determinarRuta(): Ruta {
        const [, destino] = this.extremosRuta
        const punto = destino.getUbicacion().getPuntoAbstracto()
        for (let ruta of this.rutas) {
            if (this.pertenece(punto, ruta)) {
                return ruta
            }
        }
        throw new TypeError
    }

    pertenece(punto: Punto, ruta: Ruta): boolean {
        const espacios = ruta.getFichasEspacio()
        for (let e of espacios) {
            const puntoEspacio = e.getUbicacion().getPuntoAbstracto()
            if (puntoEspacio.toString() === punto.toString()) {
                return true
            }
        }
        return false
    }

    marcarEspaciosDisponibles(): void {
        this.rutas.reduce((lista: Ficha[], actual: Ruta) => {
            lista = [...lista, ...actual.getFichasEspacio()]
            return lista
        }, []).map(espacio => espacio.newInstance())
            .forEach(espacio => {
                espacio.setNombre('ficha-espacio-activo')
                this.cuadricula.actualizar(espacio)
            })
        this.redibujarTablero()
        this.bloquearTablero()
    }

    desmarcarEspaciosDisponibles(): void {
        this.rutas.reduce((lista: Ficha[], actual: Ruta) => {
            lista = [...lista, ...actual.getFichasEspacio()]
            return lista
        }, []).map(espacio => espacio.newInstance())
            .forEach(espacio => {
                espacio.setNombre('ficha-espacio')
                this.cuadricula.actualizar(espacio)
            })
    }

    sistematizarRuta(ficha: SuperFicha): void {
        const sistemaRutaFactory = new SistemaRutaFactory(ficha, this.cuadricula)
        sistemaRutaFactory.sistematizar()
        this.rutas = sistemaRutaFactory.getRutas()
    }

    habilitarRutasDisponible(): void {
        const espacios = this.rutas.reduce((lista: Ficha[], actual: Ruta) => {
            if (!lista.find((ficha: Ficha) => actual.getFichaEnJuego().getId() === ficha.getId())) {
                lista = [...lista, actual.getFichaEnJuego()]
            }
            lista = [...lista, ...actual.getEspaciosFinal()]
            return lista
        }, [])

        this.tablero.getChildren().filter(imagen => this.corresponde(imagen as Imagen, espacios))
            .forEach(imagen => imagen.setInteractive())
    }

    corresponde(imagen: Imagen, espacios: Ficha[]): boolean {
        const ubicacion = imagen.toFicha().getUbicacion()
        const punto = ubicacion.getPuntoAbstracto()
        for (let espacio of espacios) {
            const ubicacionEspacio = espacio.getUbicacion()
            const puntoEspacio = ubicacionEspacio.getPuntoAbstracto()
            if (punto.toString() === puntoEspacio.toString()) {
                return true
            }
        }
        return false
    }

    coronarFichaEnJuego(): void {
        const [_, destino] = this.extremosRuta
        const ubicacion: Ubicacion = destino.getUbicacion()
        const punto: Punto = ubicacion.getPuntoAbstracto()
        const ficha: SuperFicha = this.cuadricula.fromPunto(punto) as SuperFicha
        const llegoAlExtremoArriba = ficha.isFichaRoja() && punto.getX() === 0 && !ficha.isReina()
        const llegoAlExtremoAbajo = ficha.isFichaAmarilla() && punto.getX() === 7 && !ficha.isReina()
        if (llegoAlExtremoArriba || llegoAlExtremoAbajo) {
            ficha.transformar()
            this.cuadricula.actualizar(ficha)
        }
    }

    intercambiarExtremosRuta(): void {
        let [origen, destino] = this.extremosRuta
        const superFicha = (origen as SuperFicha).newInstance()
        destino = destino.newInstance()
        const ubicacionOrigen = superFicha.getUbicacion()
        const ubicacionDestino = destino.getUbicacion()
        superFicha.setUbicacion(ubicacionDestino)
        destino.setUbicacion(ubicacionOrigen)
        this.cuadricula.actualizar(superFicha)
        this.cuadricula.actualizar(destino)
    }

    movimientoConKO(): void {
        const ruta = this.determinarRuta()
        for (let ficha of ruta.getFichasRival()) {
            const ubicacion = ficha.getUbicacion()
            const espacio = new Ficha(0, 'ficha-espacio', ubicacion)
            this.cuadricula.actualizar(espacio)
        }
        this.intercambiarExtremosRuta()
    }

    irMenuPrincipal(): void {
        this.extremosRuta = []
        this.rutas = []
        this.movimientoNormal = 0
        this.scene.start('menu-principal')
    }

}

export default Game