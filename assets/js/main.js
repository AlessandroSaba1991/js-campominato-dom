/* 
Consegna
Copiamo la griglia fatta ieri nella nuova repo e aggiungiamo la logica del gioco
(attenzione: non bisogna copiare tutta la cartella dell'esercizio ma solo l'index.html, e le cartelle js/ css/ con i relativi script e fogli di stile, per evitare problemi con l'inizializzazione di git).
L'utente indica un livello di difficoltà in base al quale viene generata una griglia di gioco quadrata, in cui ogni cella contiene un numero tra quelli compresi in un range:
con difficoltà 1 => tra 1 e 100
con difficoltà 2 => tra 1 e 81
con difficoltà 3 => tra 1 e 49
Il computer deve generare 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe :bomba:.
I numeri nella lista delle bombe non possono essere duplicati.
In seguito l'utente clicca su una cella:
se il numero è presente nella lista dei numeri generati - abbiamo calpestato una bomba
la cella si colora di rosso e la partita termina,
altrimenti la cella cliccata si colora di azzurro e l'utente può continuare a cliccare sulle altre celle.
La partita termina quando:
 il giocatore clicca su una bomba
o raggiunge il numero massimo possibile di numeri consentiti.
Al termine della partita il software deve comunicare il punteggio, cioè il numero di volte che l’utente ha cliccato su una cella che non era una bomba.
BONUS: 1
quando si clicca su una bomba e finisce la partita, evitare che si possa cliccare su altre celle
quando si clicca su una bomba e finisce la partita, il software scopre tutte le bombe nascoste
Consigli del giorno:  :baby-yoda:
Scriviamo prima cosa vogliamo fare passo passo in italiano.
Dividiamo il lavoro in micro problemi (sono piú facili da risolvere).
Ad esempio: Di cosa ho bisogno per generare i numeri casuali?
Proviamo sempre prima con dei console.log() per capire se stiamo ricevendo i dati giusti.
Le validazioni e i controlli possiamo farli anche in un secondo momento.
Io sono a disposizione via ticket per il resto della mattinata. Ricordate, prima di aprire un ticket:
loggate in console le variabili per capire dove si trova l'errore e se i valori salvati nella variabile siano quelli che vi occorrono,
pushate
mentre attendete se fate qualche modifica o aggiungete dei console log ripushate
quando scrivete il messaggio del ticket ditemi anche dove state lavorando, in che funzione o righa guardare e che messaggio di errore c'é in console (se c'é).
*/



/**
 * ###Creare una griglia numerata
 * @param {String} node_selector Il nodo dove appendere la griglia
 * @param {Number} number_of_cells Quante celle vuoi creare
 * @param {String} dimension_grid Assegna una classe per la dimensione della griglia (x10,x9,x7)
 * @param {String} create_tag Scegliere il tag da creare
 * @param {String} class_name Scegliere la classe da assegnare al tag
 */
function generate_grid_with_number(node_selector, number_of_cells, dimension_grid, create_tag, class_name) {
    const node = document.querySelector(node_selector);
    node.innerHTML = ''
    for (let i = 1; i <= number_of_cells; i++) {
        const element = document.createElement(create_tag);
        element.classList.add(class_name, dimension_grid);
        const text = i;
        element.innerHTML = text;
        node.append(element);
    }
}


/**
 * ###Data una lista di elementi al click gli cambia lo sfondo
 * @param {String} element Inserire elemento da selezionare
 * @param {String} colour Inserire il colore che si vuole aggiungere dopo il click
 */
function active_cell(class_name, num_cell) {
    const cell_list = document.querySelectorAll(class_name);
    const bomb_list = numeri_casuali_unici(16, num_cell)
    const click_possibili = cell_list.length - bomb_list.length

    let click_effettuati = 0;


    for (let i = 0; i < cell_list.length; i++) {
        const cell = cell_list[i];

        cell.addEventListener("click", function() {



            if (bomb_list.includes(parseInt(this.innerHTML))) {

                this.style.backgroundColor = 'red'

                document.querySelector('.cells').innerHTML = 'Hai preso la bomba'
                return alert(`hai effettuato ${click_effettuati} click prima di prendere una bomba`)

            } else {
                this.style.backgroundColor = 'violet'
                click_effettuati++
                console.log(click_effettuati);

            }
            if (click_effettuati == click_possibili) {
                console.log('you win');
                document.querySelector('.cells').innerHTML = 'Hai vinto'
                return alert(`hai vinto e hai effettuato ${click_effettuati} click e non hai preso nessuna bomba`)

            }

            console.log(click_effettuati, click_possibili);
        });


    }

}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function numeri_casuali_unici(number_bomb, number_max) {
    const number_list = [];

    for (let i = 0; i < number_bomb; i++) {
        let random_number = getRndInteger(1, number_max)
        while (number_list.includes(random_number)) {
            random_number = getRndInteger(1, number_max);
        }
        number_list.push(random_number);
    }
    return number_list
}



const element_form = document.querySelector("form");

element_form.addEventListener("submit", function(event) {
    event.preventDefault();

    let cell, colums;
    const difficolta = document.getElementById("difficolta").value;

    switch (difficolta) {
        case 'facile':
            cell = 100
            colums = 'x10'
            break;
        case "medio":
            cell = 81
            colums = 'x9'
            break;
        case "difficile":
            cell = 49
            colums = 'x7'
            break;
    }

    generate_grid_with_number(".cells", cell, colums, "div", "square");
    active_cell(".square", cell);

});