# Progetto di Giada Rossana Margarone
#### Matricola: 1000015029
#### Corso: WEB PROGRAMMING, DESIGN & USABILITY

## Descrizione del Progetto
Questo applicativo web è stato sviluppato come parte del corso di Web Programming, Design & Usability. L'applicativo permette la gestione di eventi e utenti, utilizzando una combinazione di tecnologie moderne per il frontend e il backend.

## Tecnologie Utilizzate
- React: Framework JavaScript;
- Bootstrap: Libreria CSS per un design responsive;
- MongoDB: Database NoSQL per la gestione dei dati;
- Google API: Utilizzato per l'integrazione con Google Maps e altre funzionalità.

## Prerequisiti
Prima di poter avviare il progetto, bisogna assicurarsi di avere:

1. MongoDB: Un'istanza di MongoDB attiva e configurata.
2. Google API Keys: Chiavi API di Google per utilizzare Google Maps e altre funzionalità.
3. Node.js e npm: Assicurati di avere Node.js e npm installati.

## Configurazione

1. Configurazione del Backend
Crea un file .env nella cartella ./progetto/server/ con i seguenti parametri:

`PORT=5000`

`JWT_SECRET=tuo_segreto_per_jwt`

`MONGODB_URI=indirizzo_della_tua_istanza_mongodb`

2. Configurazione del Frontend
Crea un file .env nella cartella ./progetto/server/frontend con i seguenti parametri:

`REACT_APP_GOOGLE_MAPS_API_KEY=la_tua_chiave_google_maps`

`REACT_APP_MAP_ID=id_della_mappa_google`

`REACT_APP_PORT=5000`

`REACT_APP_SERVER_URL=il_tuo_url`

3. Installazione delle Dipendenze
Installa le dipendenze necessarie con i seguenti comandi:

`cd ./progetto/server`

`npm install`

`cd ./frontend`

`npm client-install ` 


## Avvio del Progetto

1. Avvio del Backend
Dalla cartella ./progetto/server, avvia il server con i comandi:

`npm run build` (non necessario se 'npm client-install' è appena stato effettuato)

`npm start`

Il server partirà sulla porta specificata nel file .env.

#### Cambio di porta

Nel caso in cui si volesse cambiare la porta, vanno cambiati i file `.env` sia in /progetto/server sia in /progetto/server/frontend, rispettivamente le variabili:

`PORT`

`REACT_APP_PORT`



