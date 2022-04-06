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

/* L'utente indica un livello di difficoltà in base al quale viene generata una griglia di gioco quadrata, in cui ogni cella contiene un numero tra quelli compresi in un range:
con difficoltà 1 => tra 1 e 100
con difficoltà 2 => tra 1 e 81
con difficoltà 3 => tra 1 e 49 */
function game() {
    //seleziono il form
    const element_form = document.querySelector('form')
        //dichiaro delle variabili che mi servirviranno per impostare numero di celle e colonne in base al livello
    let numero_colonne, numero_celle;
    //scateno l'evento 
    element_form.addEventListener('submit', function(event) {
        event.preventDefault()
            //prendo il valore del livello selezionato
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
            //variabile che contiene la lista delle bombe
        const bombs = bombe(numero_celle)
            //console.log(bombs.sort(function(a, b) { return a - b }));
            //varibile per contare i click eseguiti
        const click = []
            //variabile per i tentativi possibili per vincere senza prendere le bombe
        const tentativi_possibili = numero_celle - bombs.length
            //attacco le variabili alla window così posso richiamarle nelle altre funzioni
        window.bombs = bombs
        window.click = click
        window.tentativi_possibili = tentativi_possibili
    })
}


//creo la griglia
function crea_griglia(node, numero_celle, crea_elemento, numero_colonne) {
    //seleziono l'elemento della dom
    const node_dom = document.querySelector(node);
    //pulisco la dom
    node_dom.innerHTML = ''

    //creo tutti gli elementi da appendere
    for (let i = 1; i <= numero_celle; i++) {
        const new_element = document.createElement(crea_elemento)
            //assegno la classe
        new_element.classList.add('square')
            //assegno il testo
        new_element.innerHTML = i
            //la grandezza della cella
        new_element.style.cssText = `width: calc(100% / ${numero_colonne})`
            //attacco l'evento da scatenare
        new_element.addEventListener('click', click_function)
            //lo appendo al nodo della dom
        node_dom.append(new_element)
    }
}

/* Il computer deve generare 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe :bomba:.
I numeri nella lista delle bombe non possono essere duplicati. */
function bombe(numero_celle) {
    //inizializzo array vuota da rimepire con i numeri bomba
    const bombs = []

    while (bombs.length != 16) {
        //creo le bombe
        const bomb = getRndInteger(1, numero_celle)
            //controllo che siano uniche
        if (!bombs.includes(bomb)) {
            bombs.push(bomb)
        }
    }
    //ritorno la lista di bombe
    return bombs
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/* In seguito l'utente clicca su una cella:
se il numero è presente nella lista dei numeri generati - abbiamo calpestato una bomba
la cella si colora di rosso e la partita termina,
altrimenti la cella cliccata si colora di azzurro e l'utente può continuare a cliccare sulle altre celle. */
function click_function() {
    //inizializzo le variabili che avevo nella window
    const bombs = window.bombs
    const click = window.click
    const tentativi_possibili = window.tentativi_possibili

    //se le celle cliccate hanno il numero bomba gli assegno colore, bg, testo e faccio finire la partita
    if (bombs.includes(parseInt(this.innerHTML))) {
        this.innerHTML = 'BOMB'
        this.style.backgroundColor = 'red'
        this.style.color = 'white'
        endgame(bombs, click, tentativi_possibili)
            //altrimenti assegno colore,bg e la partita continua
    } else {
        this.style.backgroundColor = 'violet'
        this.style.color = 'white'
            //controllo che la cella cliccata non sia stata già cliccata
        if (!click.includes(this.innerHTML)) {
            click.push(this.innerHTML)
        }
    }
    //se raggiungo il limite di tentativi concludo la partita
    if (tentativi_possibili == click.length) {
        endgame(bombs, click, tentativi_possibili)
    }

}

/* La partita termina quando:
 il giocatore clicca su una bomba
o raggiunge il numero massimo possibile di numeri consentiti.
Al termine della partita il software deve comunicare il punteggio, cioè il numero di volte che l’utente ha cliccato su una cella che non era una bomba.
BONUS: 1
quando si clicca su una bomba e finisce la partita, evitare che si possa cliccare su altre celle
quando si clicca su una bomba e finisce la partita, il software scopre tutte le bombe nascoste */
function endgame(bombs, click, tentativi_possibili) {
    // inserisco tutte le celle in una lista
    const celle = document.querySelectorAll('.square')
        //le faccio ciclare per togliere l'evento al click
    for (let i = 0; i < celle.length; i++) {
        const new_element = celle[i];
        new_element.removeEventListener('click', click_function)
            //se le celle hanno il numero bomba le scopro
        if (bombs.includes(parseInt(new_element.innerHTML))) {
            new_element.style.backgroundColor = 'red'
            new_element.style.color = 'white'
            new_element.innerHTML = 'BOMB'
        }
    }
    //se raggiunge i tentativi possibili senza prendere bombe vince e comunico i click effettuati
    if (tentativi_possibili == click.length) {
        setTimeout(function() {
                alert(`I tuoi click sono stati ${click.length}/${tentativi_possibili} . Complimenti hai vinto`)
            }, 300)
            //altrimenti ha preso una bomba e perde
    } else {
        setTimeout(function() {
            alert(`I tuoi click sono stati ${click.length}/${tentativi_possibili} . Mi dispiace hai preso la bomba`)
        }, 300)
    }
}