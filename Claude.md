 # CLAUDE.md

  ## Progetto

  Sito personale "stream" — raccolta di pensieri, link e citazioni.
  Costruito con [Eleventy (11ty)](https://www.11ty.dev).
  Contenuto in italiano.

  ## Comandi principali

  ```bash
  npm start        # server locale con live reload
  npm run build    # build statica in _site/

  # Creare nuovi post
  npm run note
  npm run link
  npm run quote
  npm run image

  usa sempre `npm run build` prima di fare commit

  Struttura

  .eleventy.js          # configurazione Eleventy, filtri, trasformazioni
  src/
    stream/             # tutti i post (*.md con frontmatter)
    _includes/          # template Nunjucks (base.njk, post.njk, …)
    _data/site.json     # dati globali del sito
    css/                # stili
    img/                # immagini
  new-post.js           # script per creare nuovi post

  Tipi di post e frontmatter

  note
  date: 2026-03-12T10:00:00
  type: note

  link
  date: …
  type: link
  url: https://…
  linkTitle: Titolo del link

  quote
  date: …
  type: quote
  author: Autore

  image
  date: …
  type: image
  image: /img/nome-file.jpg
  imageAlt: Descrizione

  Aggiungere published: false al frontmatter per escludere un post dalle collezioni.

  Convenzioni

  - I post vanno in src/stream/, mai altrove.
  - Nomi file: YYYY-MM-DD-slug.md (post storici) o YYYY-MM-DDTHH-MM-SS-type.md (generati da new-post.js).
  - WikiLink interni: [[./slug-del-post]] o [[./slug|testo alternativo]].
  - I link esterni nel corpo vengono trasformati automaticamente con target="_blank" dalla trasformazione externalLinks.
  - Lingua del contenuto: italiano.

  Note su Eleventy

  - Collezione principale: stream (tutti i post pubblicati, ordine cronologico inverso).
  - Sotto-collezioni per tipo: stream_note, stream_link, stream_quote, stream_image.
  - Filtri personalizzati rilevanti: dataLeggibile, ora, truncateChars, backlinksFor, postIcon.
  - PATH_PREFIX = "/" (configurabile in .eleventy.js).