const celeste = document.getElementById('celeste');
const violeta = document.getElementById('violeta');
const naranja = document.getElementById('naranja');
const verde = document.getElementById('verde');

const btnEmpezar = document.getElementById('btnEmpezar') // 6.- Para poder ocultar el boton, lo primero que debemos hacer es recibir la señal que nos lleve el id
                                                         //  desde btnEmpezar en el html

const ULTIMO_NIVEL = 10

class Juego {               // 3.- Creamos la clase juego con su constructor
    constructor() {
        this.inicializar = this.inicializar.bind(this); // 35.- Colocamos .bind(this) aqui igual que en comentario 23 pero por las funciones ganoElJuego() y perdioElJuego()
        this.inicializar()  // 4.- Iniciamos dentro del constructor
        this.generarSecuencia()  // 7.- Iniciamos el generador de secuencia aleatoria de colores
        setTimeout(this.siguienteNivel, 1000)  // 12.- Iniciamos la funcion que nos hará ir avanzando por los diferentes niveles.
        
    }

    inicializar() {
        this.siguienteNivel = this.siguienteNivel.bind(this)
        this.elegirColor = this.elegirColor.bind(this); // 23.- .bind(this) debe ser utilizado porque al capturar el evento addEventListener, (linea 77) en 'this.elegirColor' 
                                                        // se hace referencia al boton, al elemento html y no a la clase Juego de la linea 9, y eso debe corregirse
                                                        // atandole al addEventListener la función elegirColor()
        this.interruptorBtnEmpezar();

        this.nivel = 1; // 10.- Con esto más tarde podremos ir añadiendo los niveles de dificultad
        this.colores = { // 11.- Guardamos los colores para poder trabajar con ellos más tarde
            celeste,
            violeta,
            naranja,
            verde
        }
    }

    interruptorBtnEmpezar() { // 5.- Lo primero que va a hacer el juego al iniciar es ocultar el boton de Empezar! añadiendo a todos los elementos de btnEmpezar la clase
                              // .hide o mostrar el botón en caso de que hallamos acabado el juego y tengamos que reempezar
        if (btnEmpezar.classList.contains('hide')) {
            btnEmpezar.classList.remove('hide')
        } else {
            btnEmpezar.classList.add('hide')
        }
    }

    generarSecuencia() {  // 8.- creamos la función que va a generar la secuencia aleatoria, solo que en lugar de colores será de numeros que luego convertiremos en colores
        this.secuencia = new Array(ULTIMO_NIVEL).fill(0).map(n => Math.floor(Math.random() *4))// 9.- Al crear la secuencia indicamos que esta debe tener un total de 10 dígitos.
                                                // Cada uno de esos dígitos va a oscilar entre 0 y 1 (propiedad de Math.random), pero como lo que queremos es que dichos dígitos
                                                // oscilen entre 0 y 4, multiplicamos el valor de Math.random por 4. Como el valor que nos va a dar es decimal, hacemos el 
                                                // redondeo con Math.floor. Esos números van a ser insertados en el array con el método .fill(indispensable para 
                                                // el funcionamiento del .map) y leidos con el método .map
        
    }

    siguienteNivel() {
        this.subnivel = 0
        this.iluminarSecuencia(); // 13.- Invocamos la función iluminarSecuencia(), es decir, cada vez que llegue un nuevo nivel, se va a iluminar la secuencia
        this.agregarEventosClick(); // 21.- Debemos verificar que los botones que pulse el jugador son correctos, asique empezamos agregando eventos a los clicks
    }

    transformarNumeroAColor(numero) { // 15.- Aquí transformamos los números a colores
        switch(numero) {
            case 0:
                return 'celeste';
            case 1:
                return 'violeta';
            case 2:
                return 'naranja';
            case 3:
                return 'verde';
        }
    }

    transformarColorANumero(color) { // 25.- Aquí transformamos los colores a números
        switch(color) {
            case 'celeste':
                return 0;
            case 'violeta':
                return 1;
            case 'naranja':
                return 2;
            case 'verde':
                return 3;
        }
    }

    iluminarSecuencia() { // 14.- Esta función va a recorrer el array de la secuencia hasta el nivel en el que estemos, de ahí el ciclo for
        for (let i = 0; i < this.nivel; i++) { 
            const color = this.transformarNumeroAColor(this.secuencia[i]) // 16.- Le pasamos el número en el que estamos en cada secuencia para que nos lo indique con [i]
            setTimeout(() => this.iluminarColor(color), 500 * i)  // 17.- pedimos que se ilumine dicho color, pero debe dejar un tiempo al iluminarse cada uno
        }
    }

    iluminarColor(color) {
        this.colores[color].classList.add('light') // 18.- Dentro de los colores guardados (linea 20) le decimos que color queremos y a ese color le añadimos la clase .light
        setTimeout(() => this.apagarColor(color), 350) // 19.- La iluminación solo debe parpadear, por lo que le añadimos un temporizador y decimos que al finalizar el tiempo
                                                       // seleccionado (350 ms) debe ejecutarse la función apagarColor() para que vuelva al color original
    }

    apagarColor(color) {
        this.colores[color].classList.remove('light') // 20.- le quitamos la clase .light a los colores con esta función
    }

    agregarEventosClick() {
        this.colores.celeste.addEventListener('click', this.elegirColor) // 22.- Agregamos un escuchador de eventos en cada uno de los colores
        this.colores.verde.addEventListener('click', this.elegirColor)
        this.colores.violeta.addEventListener('click', this.elegirColor)
        this.colores.naranja.addEventListener('click', this.elegirColor)
    }

    eliminarEventosClick() {
        this.colores.celeste.removeEventListener('click', this.elegirColor)
        this.colores.verde.removeEventListener('click', this.elegirColor)
        this.colores.violeta.removeEventListener('click', this.elegirColor)
        this.colores.naranja.removeEventListener('click', this.elegirColor)
    }

    elegirColor(ev) { // 24.- Utilizamos ev como parametro pues hace refencia a lo captado en el EventListener
        console.log(this)
        const nombreColor = ev.target.dataset.color; // 26.- target.dataset.color hace refencia al contenido del campo color dentro del dataset de cada uno de los botones,
                                                     // campo que creamos nosotros poniendo en el html el atributo data-color (lineas 10, 11, 12 y 13) y que podemos ver si
                                                     // inspeccionamos los botones en el navegador, dentro del atributo target

        const numeroColor = this.transformarColorANumero(nombreColor); // 27.- traducimos de color a número
        this.iluminarColor(nombreColor);                               // 28.- iluminamos el boton pulsado

        if (numeroColor === this.secuencia[this.subnivel]) {     // 29.- Si el boton pulsado es igual al mostrado, el nivel en el que nos encontramos (nivel 0 o subnivel) avanza
            this.subnivel++
            if (this.subnivel === this.nivel) {     // 30.- si avanza el subnivel, avanza el nivel de los colores
                this.nivel++
                this.eliminarEventosClick(); // 31.- eliminamos la posibilidad de hacer click una vez hemos acertado todos los colores
                if (this.nivel === (ULTIMO_NIVEL + 1)) { // 32.- Si el nivel llega a 10, se acaba el juego porque gana el jugador
                    this.ganoElJuego();
                } else { // 33.- Si aun no llega a 10 el nivel significa que el juego aún no ha acabado y debe avanzar al siguiente nivel con un retraso de 1.5 segundos
                    setTimeout(this.siguienteNivel, 1500)
                }
            }
        } else {
            this.perdioElJuego();
        }
    }

    ganoElJuego() {
        swal('Enhorabuena!', 'Superaste el último nivel', 'success') // 34.- Creamos la función de exito y de derrota
        .then(this.inicializar) // esta linea y la linea 139-141 hacen lo mismo solo que esta se puede simplificar porque solo llamamos a una funcion y al ser una
                                // arrow function, nos permite minificarla, quitar los parentesis, las llaves y el =>
    }

    perdioElJuego() {
        swal('Que lastima!', 'No superaste el nivel :(', 'error')
        .then(() => {
            this.eliminarEventosClick();
            this.inicializar()
        })
    }
}

function empezarJuego() {    // 1.- creamos la función que va a ser llamada desde el html al pulsar el boton de inicio
    window.juego = new Juego()  // 2.- para que esto se cree y funciona, debemos crear la clase Juego
}