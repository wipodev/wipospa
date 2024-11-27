import componentProcessor from "./processComponent.js";

// datos de prueba
const html = /*html*/ `
<script>
  import Hijo from "/src/app/components/Hijo.html";
  var titulo;
  var boton;

  let count = 0;
  let names = ["pepe", "paco", "luis", "jose", "wladimir"];

  function increment() {
    count++;
    console.log(count)
  }
</script>

<section>
  <h1>{titulo}</h1>
  <button onclick="increment()">{boton}</button>
  <p data-if="count > 0">Contador: {count}</p>
  <Hijo data-for="name in names" title="{name}" num="2"></Hijo>
  <ul>
    <li data-for="name in names">{name}</li>
  </ul>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding-inline: var(--pico-spacing);

    section img {
      width: 30%;
      height: auto;
    }

    h1 {
      display: flex;
      gap: 0.5rem;
      align-items: baseline;

      span[data-title-lib] {
        font-size: inherit;
      }
    }

    p {
      text-align: center;
    }
  }
</style>
`;
// ejemplo de uso

componentProcessor(html, "Home");
