import Cuadricula from './Cuadricula'
import Punto from './Punto'
import Segmento from './Segmento'
import SuperFicha from './SuperFicha'
import Ruta from './Ruta'
import Ficha from './Ficha'
import SistemaVision from './SistemaVision'
import Trayectoria from './Trayectoria'



class SistemaRutaFactory {
    private cuadricula: Cuadricula
    private fichaEnJuego: SuperFicha
    private trayectorias: Trayectoria[]

    constructor(fichaEnJuego: SuperFicha, cuadricula: Cuadricula) {
        this.fichaEnJuego = fichaEnJuego
        this.cuadricula = cuadricula
        this.trayectorias = []
    }

    sistematizar() {
        const sistema: SistemaVision = this.fichaEnJuego.getSistemaVision()
        sistema.toVectorArray().forEach(vector => this.trazarTrayectoria(vector))
    }

    segmentar(fichaEnJuego:SuperFicha,vector: Punto): Segmento[] {
        const segmentos: Segmento[] = []
        let segmento: Segmento
        let fichas: Ficha[] = []
        let origen: Punto = fichaEnJuego.getUbicacion().getPuntoAbstracto()
        fichas = [fichaEnJuego, ...this.get2FichasPosterior(origen, vector)]
        segmento = new Segmento(fichaEnJuego, fichas)
        while (segmento.esValido()) {
            if (segmentos.length > 0 && segmento.esCorto() && !fichaEnJuego.isReina()) {
                break
            }
            segmentos.push(segmento)
            if (segmento.esCorto() && !fichaEnJuego.isReina()) {
                break
            }
            const actual = segmento.getUltimaFicha()
            origen = actual.getUbicacion().getPuntoAbstracto()
            fichas = [actual, ...this.get2FichasPosterior(origen, vector)]
            segmento = new Segmento(fichaEnJuego, fichas)
        }

        return segmentos
    }

    get2FichasPosterior(origen: Punto, vector: Punto) {
        const fichas = []
        let punto = origen
        for (let i = 1; i <= 2; i++) {
            punto = this.getSiguientePunto(punto, vector)
            if (!this.esValidoPunto(punto)) {
                break
            }
            fichas.push(this.cuadricula.fromPunto(punto))
        }
        return fichas
    }

    esValidoPunto(punto: Punto) {
        return (punto.getX() >= 0 && punto.getX() <= 7) && (punto.getY() >= 0 && punto.getY() <= 7)
    }

    getSiguientePunto(origen: Punto, vector: Punto) {
        const x = origen.getX() + vector.getX()
        const y = origen.getY() + vector.getY()
        return new Punto(x, y)
    }

    trazarTrayectoria(vector: Punto) {
        const origen = new Punto(0, 0)
        const segmentos = this.segmentar(this.fichaEnJuego,vector)
        if (segmentos.length > 0) {
            this.trayectorias.push(new Trayectoria(origen, vector, segmentos))
        }

        while (this.hayTrayectoriaTrabajo()) {
            this.determinarPuntosGiro()
        }
    }

    determinarPuntosGiro() {
        const sistema: SistemaVision = this.fichaEnJuego.getSistemaVision()
        const campos = sistema.getCamposVision()
        const elegidas = this.trayectorias.filter(t => t.estaTrabajando())

        for (let trayectoria of elegidas) {
            const segmentos = trayectoria.getSegmentos()
                .filter(s => s.esLargo())
            for (let segmento of segmentos) {
                const final = segmento.getUltimaFicha()
                const vectorSecundario = trayectoria.getVectorSecundario()
                const campo = campos.find(c => c.pertenece(vectorSecundario))
                const adyacente = campo?.getVectorAdyacente(vectorSecundario)
                trayectoria.setPuntoGiro(final.getUbicacion().getPuntoAbstracto())
                if (adyacente) {
                    const fichaEnJuego = this.fichaEnJuego.newInstance()
                    fichaEnJuego.setUbicacion(final.getUbicacion())
                    const segmentos = this.segmentar(fichaEnJuego,adyacente)
                    if (segmentos.length > 0) {
                        const ruta = new Ruta(segmentos)
                        if (ruta.tieneKO()) {
                            this.trayectorias.push(new Trayectoria(vectorSecundario, adyacente, segmentos))
                        }
                    }
                }
            }

            trayectoria.setEstaTrabajando(false)
        }
    }

    hayTrayectoriaTrabajo() {
        return this.trayectorias.filter(t => t.estaTrabajando()).length > 0
    }

    getRutas(): Ruta[] {
        const finales = this.trayectorias.filter(t => this.isTrayectoriaFinal(t))
        .map(t => t.newInstance())
        const origen =  new Punto(0,0)
        const cruzadas:Trayectoria[]   = []
        for (let final of finales) {
            let partes:Trayectoria[] = []
            let vp = final.getVectorPrincipal()  
            let trayectoria = final.newInstance()
            while (vp.toString() !== origen.toString()) {
                partes.push(trayectoria)
                trayectoria = this.trayectorias.find(t => t.getVectorSecundario().toString()===vp.toString())!
                vp = trayectoria.getVectorPrincipal()
            }
            partes.push(trayectoria)
            let segmentos:Segmento[] = []
            for(let t of partes) {
                segmentos = [...t.getSegmentos(), ...segmentos]
            }
            trayectoria.setSegmentos(segmentos)
            cruzadas.push(trayectoria)
        }
        return cruzadas.map(t => new Ruta(t.getSegmentos()))
    }

    isTrayectoriaFinal(trayectoria: Trayectoria) {
        const vector = trayectoria.getVectorSecundario()
        for (let t of this.trayectorias) {
            if (t.getVectorPrincipal().toString() === vector.toString()) {
                return false
            }
        }
        return true
    }

}


export default SistemaRutaFactory