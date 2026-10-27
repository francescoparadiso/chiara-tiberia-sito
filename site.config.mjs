// ═══════════════════════════════════════════════════════════════════════════
// site.config.mjs — l'UNICO file da modificare per contenuti e dati reali.
//
// Regola dei segnaposto: ogni testo racchiuso tra doppie quadre, es.
//   '[[00000000000]]'
// è un DATO DA SOSTITUIRE. Nel sito appare evidenziato in giallo; finché ne
// resta anche uno solo, il sito si dichiara "anteprima": barra in alto,
// noindex nei motori di ricerca e robots.txt che li tiene fuori. Quando li hai
// sostituiti tutti, `npm run build:final` verifica che non ne resti nessuno.
//
// La lista completa di ciò che serve è in DA-COMPLETARE.md.
// ═══════════════════════════════════════════════════════════════════════════

export default {
  // ── Indirizzo del sito: l'UNICO punto dove cambiare dominio ─────────────
  site: {
    // Lascia vuoto su GitHub Pages: nella build su GitHub l'indirizzo
    // https://<utente>.github.io/<repo> viene ricavato da solo.
    // Quando passi al dominio proprio scrivi qui, ad esempio:
    //   url: 'https://www.chiaratiberia.it',
    url: '',
    // true → la build scrive anche il file CNAME col dominio di `url`
    // (serve solo su GitHub Pages con dominio personalizzato).
    writeCname: false,
    lang: 'it',
    locale: 'it_IT',
    themeColor: '#35544A',
  },

  // ── Persona e attività ──────────────────────────────────────────────────
  person: {
    name: 'Chiara Tiberia',
    givenName: 'Chiara',
    familyName: 'Tiberia',
    role: 'Terapista occupazionale',
    // Iniziali per il monogramma del logo e del ritratto segnaposto.
    initials: 'CT',
  },

  business: {
    // Come compare in fattura / nel footer.
    legalName: 'Chiara Tiberia',
    vatNumber: '[[00000000000]]', // Partita IVA
    fiscalCode: '[[CODICE FISCALE]]', // facoltativo sul sito: cancella la riga se non lo vuoi mostrare
    // Iscrizione all'Albo — Ordine TSRM e PSTRP
    albo: {
      orderName: 'Ordine dei Tecnici sanitari di radiologia medica e delle professioni sanitarie tecniche, della riabilitazione e della prevenzione (TSRM e PSTRP)',
      orderShort: 'Ordine TSRM e PSTRP',
      province: '[[Provincia dell’Ordine]]',
      albo: 'Albo dei Terapisti Occupazionali',
      number: '[[N. iscrizione all’Albo]]',
    },
    // Assicurazione di responsabilità civile professionale (obbligatoria).
    insurance: '[[Compagnia e n. polizza RC professionale]]',
  },

  // ── Contatti ────────────────────────────────────────────────────────────
  contact: {
    email: '[[email@dominio.it]]',
    phone: '[[Numero di telefono]]',
    // Solo cifre con prefisso internazionale, senza + (es. 393331234567).
    whatsapp: '[[393331234567]]',
    pec: '', // facoltativa: scrivi l'indirizzo PEC oppure lascia ''
    address: {
      street: '[[Via e numero civico]]',
      postalCode: '[[CAP]]',
      city: '[[Città]]',
      province: '[[Sigla provincia]]',
      note: '', // es. "Secondo piano, citofono Tiberia"
    },
    availability: '[[Giorni e fasce orarie in cui sei raggiungibile]]',
    replyTime: 'Rispondo di norma entro due giorni lavorativi.',

    // Modulo di contatto: Web3Forms (https://web3forms.com).
    // 1) registri l'email di Chiara sul sito di Web3Forms (gratuito, senza carta)
    // 2) copi la "Access Key" che ti mandano e la incolli qui sotto.
    // La chiave è pubblica per costruzione (finisce nel codice della pagina) e
    // legata all'email di destinazione: non è un segreto.
    // Finché è un segnaposto, il modulo apre il programma di posta (mailto).
    formAccessKey: '[[ACCESS-KEY-WEB3FORMS]]',
  },

  // ── Dove e come lavora ──────────────────────────────────────────────────
  modes: {
    home: true, // a domicilio
    studio: true, // in studio
    online: false, // colloqui da remoto
  },

  area: {
    intro:
      'Mi sposto a domicilio nei comuni indicati qui sotto; in studio ricevo su appuntamento. Se il tuo comune non è in elenco scrivimi comunque: valutiamo insieme se è raggiungibile.',
    towns: ['[[Comune 1]]', '[[Comune 2]]', '[[Comune 3]]', '[[Comune 4]]'],
    // Mappa: finché lat/lon sono null il riquadro mostra solo il segnaposto.
    // Quando hai l'indirizzo dello studio, copia le coordinate da
    // openstreetmap.org (tasto destro → "Mostra indirizzo") e scrivile qui.
    map: { lat: null, lon: null, zoom: 14 },
  },

  // ── Fotografia ──────────────────────────────────────────────────────────
  // Metti il file in content/ritratto.jpg (o .jpeg/.png/.webp). La build lo
  // ritaglia in formato verticale 4:5 e crea AVIF/WebP/JPG in più larghezze.
  // Senza file, il sito mostra il ritratto segnaposto con il monogramma.
  photo: {
    alt: 'Ritratto di Chiara Tiberia, terapista occupazionale',
  },

  // ── Testi ───────────────────────────────────────────────────────────────
  // Tutti i testi qui sotto sono generici e prudenti: nessuna promessa di
  // risultati, nessuna affermazione clinica. Adattali alla tua pratica reale.
  home: {
    eyebrow: 'Terapia occupazionale',
    title: 'Le attività di ogni giorno, al centro del percorso.',
    lead:
      'Sono Chiara Tiberia, terapista occupazionale. Ti accompagno a capire che cosa è importante per te fare ogni giorno e a trovare, insieme, modi concreti per farlo: a casa, a scuola, al lavoro, nel tempo libero.',
    ctaPrimary: 'Richiedi un primo colloquio',
    ctaSecondary: 'Scopri i servizi',
  },

  whatIs: {
    title: 'Che cos’è la terapia occupazionale',
    text:
      'La terapia occupazionale è una professione sanitaria della riabilitazione. Il suo punto di partenza è semplice: per ognuno di noi la salute passa anche da ciò che riusciamo a fare nella vita di tutti i giorni. Per questo si lavora sulle «occupazioni», cioè sulle attività che hanno un significato per la persona.',
    chips: [
      'Prendersi cura di sé',
      'Muoversi in casa e fuori',
      'Giocare e imparare',
      'Studiare e lavorare',
      'Tempo libero e relazioni',
    ],
    note:
      'Può riguardare persone di età diverse, e coinvolgere anche chi sta loro vicino e gli ambienti in cui vivono.',
  },

  pillars: [
    {
      title: 'Parto da te',
      text: 'Il primo passo è ascoltare: la tua giornata, le tue routine, ciò che vorresti poter fare e ciò che oggi è più faticoso.',
    },
    {
      title: 'Guardo il tuo contesto',
      text: 'Casa, scuola, lavoro, famiglia: le attività non avvengono nel vuoto. Quando serve, lavoro anche sull’ambiente e con le persone intorno a te.',
    },
    {
      title: 'Obiettivi chiari e condivisi',
      text: 'Definiamo insieme che cosa è importante e come ce ne accorgeremo. Il percorso si rivede strada facendo, con parole semplici.',
    },
  ],

  about: {
    title: 'Chi sono',
    intro:
      'Sono Chiara, terapista occupazionale e lavoro come libera professionista. Credo che un buon percorso nasca da un ascolto attento e da obiettivi che abbiano senso per chi li vive.',
    // Elenco puntato di formazione e titoli: sostituisci con quelli reali.
    training: [
      { label: 'Laurea in Terapia Occupazionale', detail: '[[Università e anno di conseguimento]]' },
      { label: 'Iscrizione all’Albo dei Terapisti Occupazionali', detail: '[[Ordine TSRM e PSTRP di ... — n. ...]]' },
      { label: 'Formazione post-laurea e corsi', detail: '[[Elenco dei corsi e dei master che vuoi indicare]]' },
      { label: 'Esperienze professionali', detail: '[[Strutture, servizi o realtà in cui hai lavorato]]' },
    ],
    approachTitle: 'Il mio modo di lavorare',
    approach: [
      'Ascolto prima di proporre: ogni percorso comincia da ciò che per te è importante.',
      'Parole semplici e trasparenza su cosa faccio, perché e con quali tempi.',
      'Attenzione alla famiglia e a chi si prende cura di te, quando lo desideri.',
      'Collaborazione con medici, insegnanti e altri professionisti, con il tuo consenso.',
      'Rispetto della riservatezza e del Codice deontologico della professione.',
    ],
    personal: '[[Una o due righe personali, se vuoi: che cosa ti ha portata a questa professione]]',
  },

  // Metti `enabled: false` per nascondere un servizio che non offri.
  services: {
    title: 'Servizi',
    lead:
      'Ecco, in linea generale, gli ambiti in cui può essere utile la terapia occupazionale. Ogni percorso è costruito sulla persona: il modo migliore per capire se può fare al caso tuo è un primo colloquio.',
    draftNote: '[[Elenco di esempio: Chiara conferma, modifica o toglie i servizi che offre davvero]]',
    items: [
      {
        enabled: true,
        id: 'eta-evolutiva',
        title: 'Bambini e ragazzi',
        icon: 'play',
        text: 'Attività di gioco, autonomie quotidiane (vestirsi, mangiare, prepararsi), scuola e routine. Il lavoro coinvolge la famiglia e, quando opportuno, gli insegnanti.',
      },
      {
        enabled: true,
        id: 'adulti',
        title: 'Adulti',
        icon: 'path',
        text: 'Supporto per organizzare o riprendere le attività di casa, di lavoro e di tempo libero quando qualcosa le ha rese più difficili.',
      },
      {
        enabled: true,
        id: 'anziani',
        title: 'Persone anziane e caregiver',
        icon: 'home',
        text: 'Mantenere le abitudini e l’autonomia nella vita domestica; confronto e indicazioni pratiche per chi assiste un familiare.',
      },
      {
        enabled: true,
        id: 'ambiente',
        title: 'Ambiente domestico e ausili',
        icon: 'door',
        text: 'Osservazione degli spazi in cui si vive e consigli su organizzazione, adattamenti e ausili, valutati insieme caso per caso.',
      },
      {
        enabled: true,
        id: 'consulenza',
        title: 'Confronto con famiglie, scuole e servizi',
        icon: 'chat',
        text: 'Colloqui di consulenza e condivisione di strategie con le persone e i professionisti coinvolti, nel rispetto della riservatezza.',
      },
    ],
    disclaimer:
      'Le informazioni di questo sito hanno scopo divulgativo e non sostituiscono il parere del medico o di altri professionisti sanitari.',
  },

  firstVisit: {
    title: 'Come si svolge una prima valutazione',
    lead:
      'Il primo incontro serve a conoscerci e a capire se e come posso esserti utile. Non c’è un copione uguale per tutti: questa è la traccia generale.',
    steps: [
      {
        title: 'Contatto',
        text: 'Mi scrivi o mi chiami. Ti chiedo poche informazioni per capire di cosa hai bisogno e fissiamo il primo incontro, in studio o a domicilio.',
      },
      {
        title: 'Colloquio iniziale',
        text: 'Parliamo della tua giornata, di ciò che è cambiato o è più faticoso, di cosa vorresti poter fare. Se hai documenti utili (relazioni, referti), puoi portarli: non è obbligatorio.',
      },
      {
        title: 'Osservazione e valutazione',
        text: 'Osservo come svolgi le attività che ci interessano, nel luogo in cui hanno senso, e uso quando serve strumenti di valutazione adatti alla situazione.',
      },
      {
        title: 'Restituzione e proposta',
        text: 'Ti racconto ciò che ho visto con parole semplici. Se ha senso, definiamo insieme gli obiettivi e come proseguire; se non è il percorso giusto, te lo dico.',
      },
    ],
    practical: [
      { label: 'Durata indicativa', value: '[[Durata del primo incontro]]' },
      { label: 'Costo', value: '[[Tariffa del primo incontro]]' },
      { label: 'Cosa portare', value: 'Eventuali relazioni o documenti già in tuo possesso, se desideri condividerli.' },
      { label: 'Fattura', value: 'Rilascio regolare fattura; le spese sanitarie possono rientrare tra quelle detraibili [[verificare con il commercialista]].' },
    ],
  },

  faq: {
    title: 'Domande frequenti',
    lead: 'Le risposte più comuni. Se la tua non c’è, scrivimi.',
    items: [
      {
        q: 'Che differenza c’è tra terapista occupazionale e altre figure della riabilitazione?',
        a: 'Il terapista occupazionale si occupa in particolare di come una persona svolge le attività quotidiane che per lei contano (cura di sé, gioco, studio, lavoro, tempo libero) e di come adattare attività e ambiente. Lavora in modo complementare ad altri professionisti, non in alternativa.',
      },
      {
        q: 'A chi si rivolge la terapia occupazionale?',
        a: 'A persone di tutte le età, dai bambini agli anziani, e a chi se ne prende cura. Se non sai se fa al caso tuo, un primo colloquio serve proprio a chiarirlo.',
      },
      {
        q: 'Serve la prescrizione del medico?',
        a: 'Per un primo colloquio conoscitivo di norma no. In alcuni casi, ad esempio per collaborare con altri servizi o per specifiche pratiche, possono essere utili relazioni o indicazioni mediche: te lo dirò chiaramente. [[Chiara: confermare o correggere questa risposta in base alla tua pratica]]',
      },
      {
        q: 'Quanto dura un percorso?',
        a: 'Dipende dagli obiettivi e dalla situazione: non esiste una durata uguale per tutti. Dopo la valutazione ti propongo un piano e lo rivediamo insieme nel tempo.',
      },
      {
        q: 'Dove si svolgono gli incontri?',
        a: 'In studio, a domicilio nei comuni serviti, [[oppure online, se previsto]]. Quando le attività vanno osservate nel loro luogo naturale, come la casa, l’incontro a domicilio può essere particolarmente utile.',
      },
      {
        q: 'Quanto costa e come si paga?',
        a: '[[Tariffe, modalità di pagamento e politica di disdetta]]',
      },
      {
        q: 'Posso portare un familiare o chi mi assiste?',
        a: 'Sì, se lo desideri. Per i bambini è previsto il coinvolgimento dei genitori. Le informazioni sono condivise con altre persone solo con il tuo consenso.',
      },
      {
        q: 'Come vengono trattati i miei dati personali?',
        a: 'Con riservatezza e secondo la normativa sulla privacy (GDPR). I dettagli sono nell’informativa privacy. Ti chiedo di non inviare dati sulla salute tramite il modulo del sito: ne parleremo di persona.',
      },
    ],
  },

  contactPage: {
    title: 'Contatti',
    lead: 'Scrivimi o chiamami: ti rispondo per capire insieme come posso esserti utile e fissare, se vuoi, un primo incontro.',
    formIntro: 'Compila il modulo oppure usa uno dei contatti diretti qui accanto.',
    healthNotice:
      'Per favore non scrivere nel modulo informazioni sulla salute tue o di altre persone: ne parleremo durante il colloquio.',
  },

  // ── Privacy e cookie ────────────────────────────────────────────────────
  privacy: {
    updated: '27 ottobre 2026',
    hosting: '[[Nome del fornitore di hosting]]',
    retentionContact: 'fino a 12 mesi dall’ultima comunicazione, salvo che si instauri un rapporto professionale',
    formProcessor: {
      name: 'Web3Forms',
      note: 'servizio che inoltra il messaggio alla casella email del titolare',
      url: 'https://web3forms.com/privacy',
    },
    mapProvider: { name: 'OpenStreetMap Foundation', url: 'https://wiki.osmfoundation.org/wiki/Privacy_Policy' },
  },

  // Piccola nota in fondo alla pagina (facoltativa, scrivila come vuoi).
  footerNote: 'Sito d’informazione di una libera professionista sanitaria.',
};
