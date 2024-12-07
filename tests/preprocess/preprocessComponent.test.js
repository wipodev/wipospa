import { preprocessComponent } from "../../core/preprocess/componentPreprocessor.js";

const component = /*html*/ `
<script>
  import Hijo from "/src/app/components/Hijo.html";
  var titulo;
  var boton;

  let count = 0;
  let names = ["pepe", "paco", "luis", "jose", "wladimir"];

  function increment() {
    count++;
    console.log(count);
  };
</script>

<wivex:head>
  <title>Home - Wivex</title>
</wivex:head>

<section>
  <h1>{titulo}</h1>
  <h2>Bienvenido</h2>
  <button onclick="increment()">{boton}</button>
  <p data-if="count > 0">Contador: {count}</p>
  <Hijo data-for="name in names" title="{name}" num="2"></Hijo>
  <ul>
    <li data-for="name in names">{name}</li>
  </ul>
  <article data-for="name in names">
    <header>
      <h1>{titulo}</h1>
    </header>
    <p>{name}</p>
    <footer>
      <p>pie de tarjeta</p>
    </footer>
  </article>
</section>

<style>
  section {
    background-color: var(--pico-background-color);
    color: var(--pico-foreground-color);
    padding: 1rem;
  }

  h1 {
    color: var(--pico-primary-color);
  }

  button {
    background-color: var(--pico-primary-color);
    color: var(--pico-foreground-color);
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
</style>
`;

const expected = {
  preProcessedTemplate: `<html><head>

</head><body>

<section>
  <h1>{titulo}</h1>
  <h2>Bienvenido</h2>
  <button onclick="increment()">{boton}</button>
  <p data-if="count > 0">Contador: {count}</p>
  <hijo data-for="name in names" title="{name}" num="2"></hijo>
  <ul>
    <li data-for="name in names">{name}</li>
  </ul>
  <article data-for="name in names">
    <header>
      <h1>{titulo}</h1>
    </header>
    <p>{name}</p>
    <footer>
      <p>pie de tarjeta</p>
    </footer>
  </article>
</section>


</body></html>`,
  scriptContent: {
    imports: `import Hijo from "/src/app/components/Hijo.html";
`,
    state: {
      count: "0",
      names: '["pepe", "paco", "luis", "jose", "wladimir"]',
    },
    props: {
      titulo: "",
      boton: "",
    },
    methods: {
      increment: `increment() { 
    this.state.count++;
    console.log(this.state.count);
   }`,
    },
    indexes: {
      imports: {
        start: 12,
        end: 61,
      },
      state: [
        { name: "count", start: 92, end: 106 },
        { name: "names", start: 109, end: 166 },
      ],
      props: [
        { name: "titulo", start: 64, end: 75 },
        { name: "boton", start: 78, end: 88 },
      ],
      methods: [{ name: "increment", start: 170, end: 233 }],
    },
  },
  headContent: {
    headContent: `
  <title>Home - Wivex</title>
`,
    indexes: {
      start: 246,
      end: 302,
    },
  },
  styleContent: {
    styles: `
  section {
    background-color: var(--pico-background-color);
    color: var(--pico-foreground-color);
    padding: 1rem;
  }

  h1 {
    color: var(--pico-primary-color);
  }

  button {
    background-color: var(--pico-primary-color);
    color: var(--pico-foreground-color);
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
`,
    indexes: {
      start: 762,
      end: 1127,
    },
  },
};

define("test Preprocess Component", () => preprocessComponent(component), expected);
