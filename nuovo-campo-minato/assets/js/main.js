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

game()


function game() {
    const element_form = document.querySelector('form')
    let numero_colonne, numero_celle;
    element_form.addEventListener('submit', function(event) {
        event.preventDefault()
        const difficolta = document.getElementById('difficolta').value
        switch (difficolta) {
            case 'facile':
                numero_celle = 100
                numero_colonne = 10
                break;
            case 'medio':
                numero_celle = 81
                numero_colonne = 9
                break;
            case 'difficile':
                numero_celle = 49
                numero_colonne = 7
                break;
        }

        crea_griglia('.cells', numero_celle, 'div', numero_colonne)
        const bombs = bombe(numero_celle)
        console.log(bombs.sort(function(a, b) { return a - b }));
        const click = []
        const tentativi_possibili = numero_celle - bombs.length
        window.bombs = bombs
        window.click = click
        window.tentativi_possibili = tentativi_possibili
    })
}


//creare la griglia
function crea_griglia(node, numero_celle, crea_elemento, numero_colonne) {
    //seleziono l'elemento della dom
    const node_dom = document.querySelector(node);
    //pulisco la dom
    node_dom.innerHTML = ''

    //creo tutti gli elementi da appendere
    for (let i = 1; i <= numero_celle; i++) {
        const new_element = document.createElement(crea_elemento)
        new_element.classList.add('square')
        new_element.innerHTML = i
        new_element.style.cssText = `width: calc(100% / ${numero_colonne})`
        new_element.addEventListener('click', click_function)
        node_dom.append(new_element)
    }
}

function bombe(numero_celle) {
    const bombs = []
    while (bombs.length != 16) {
        const bomb = getRndInteger(1, numero_celle)
        if (!bombs.includes(bomb)) {
            bombs.push(bomb)
        }
    }
    return bombs
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function click_function() {
    const bombs = window.bombs
    const click = window.click
    const tentativi_possibili = window.tentativi_possibili

    if (bombs.includes(parseInt(this.innerHTML))) {
        this.innerHTML = 'BOMB'
        this.style.backgroundColor = 'red'
        this.style.color = 'white'
        endgame(bombs, click, tentativi_possibili)

    } else {
        this.style.backgroundColor = 'violet'
        this.style.color = 'white'
        if (!click.includes(this.innerHTML)) {
            click.push(this.innerHTML)
        }
    }
    if (tentativi_possibili == click.length) {
        endgame(bombs, click, tentativi_possibili)
    }

}

/* La partita termina quando:
 il giocatore clicca su una bomba
o raggiunge il numero massimo possibile di numeri consentiti.
Al termine della partita il software deve comunicare il punteggio, cioè il numero di volte che l’utente ha cliccato su una cella che non era una bomba. */
function endgame(bombs, click, tentativi_possibili) {
    const celle = document.querySelectorAll('.square')
    for (let i = 0; i < celle.length; i++) {
        const new_element = celle[i];
        new_element.removeEventListener('click', click_function)
        if (bombs.includes(parseInt(new_element.innerHTML))) {
            new_element.style.backgroundColor = 'red'
            new_element.style.color = 'white'
            new_element.innerHTML = 'BOMB'
        }
    }
    if (tentativi_possibili == click.length) {
        setTimeout(function() {
            alert(`I tuoi click sono stati ${click.length}/${tentativi_possibili}.Complimenti hai vinto`)
        }, 100)
    } else {
        setTimeout(function() {
            alert(`I tuoi click sono stati ${click.length}/${tentativi_possibili}.Mi dispiace hai preso la bomba`)
        }, 100)
    }
}