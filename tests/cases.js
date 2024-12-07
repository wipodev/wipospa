export const testCases = {
  case1: /*html*/ `
<section>
  <div></div>
  <span></span>
</section>
`,
  case2: /*html*/ `
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
`,
  case3: /*html*/ `
<script>
  let isLoggedIn = false;
  let user = { name: "Juan Pérez" };
</script>

<section>
  <div data-if="isLoggedIn">
    <h1>{user.name}</h1>
  </div>
  <div data-if="!isLoggedIn">
    <p>Por favor, inicia sesión</p>
  </div>
</section>
`,
  case4: /*html*/ `
<script>
  function customEventHandler() {
    alert("Evento personalizado disparado");
  }
</script>

<section>
  <button oncustom="customEventHandler()">Haz clic en mí</button>
</section>
`,
  case5: /*html*/ `
<script>
  let items = ["item1", "item2", "item3"];
</script>

<section>
  <ul>
    <li data-for="item in items">{item}</li>
  </ul>
</section>
`,
  case6: /*html*/ `
<script>
  let imageUrl = "https://via.placeholder.com/150";
  let imageAlt = "Imagen de ejemplo";
  let description = "Esta es una descripción de prueba";
</script>

<section>
  <img src="{imageUrl}" alt="{imageAlt}" data-if="imageUrl" />
  <p>{description}</p>
</section>
`,
  case7: /*html*/ `
<script>
  let dynamicClasses = "text-center bg-primary";
  let title = "Este es un título dinámico";
</script>

<section>
  <h1 class="{dynamicClasses}">{title}</h1>
</section>
`,
  case8: /*html*/ `
<script>
  let data = [
    { id: 1, value: "Elemento 1" },
    { id: 2, value: "Elemento 2" },
  ];
</script>

<section>
  <div data-for="item in data">
    <p>ID: {item.id}</p>
    <p>Valor: {item.value}</p>
  </div>
</section>
`,
  case9: /*html*/ `
<script>
  let showModal = false;
  let modalContent = "Este es el contenido del modal";
  function toggleModal() {
    showModal = !showModal;
  }
</script>

<section>
  <button onclick="toggleModal()">Abrir modal</button>
  <div data-if="showModal" class="modal">
    <p>{modalContent}</p>
    <button onclick="toggleModal()">Cerrar modal</button>
  </div>
</section>
`,
  case10: /*html*/ `
<script>
  let items = ["rojo", "verde", "azul"];
  let selectedColor = null;
  function selectColor(color) {
    selectedColor = color;
  }
</script>

<section>
  <ul>
    <li data-for="color in items">
      <button onclick="selectColor(color)">{color}</button>
    </li>
  </ul>
  <p data-if="selectedColor">Color seleccionado: {selectedColor}</p>
</section>
`,
  case11: /*html*/ `
<script>
  let hasPermission = false;
  let message = hasPermission ? "Tienes permiso" : "No tienes permiso";
</script>

<section>
  <p>{message}</p>
  <div data-if="hasPermission">
    <p>Contenido visible solo para usuarios con permiso.</p>
  </div>
</section>
`,
  case12: /*html*/ `
<script>
  let articles = [
    { title: "Artículo 1", body: "Contenido del artículo 1" },
    { title: "Artículo 2", body: "Contenido del artículo 2" },
  ];
</script>

<section>
  <article data-for="article in articles">
    <h2>{article.title}</h2>
    <p>{article.body}</p>
  </article>
</section>
`,
  case13: /*html*/ `
<script>
  let inputValue = "";
  function updateValue(event) {
    inputValue = event.target.value;
  }
</script>

<section>
  <input type="text" oninput="updateValue(event)" placeholder="Escribe algo..." />
  <p>Valor ingresado: {inputValue}</p>
</section>
`,
  case14: /*html*/ `
<script>
  let isLoading = true;
</script>

<section>
  <div data-if="isLoading">
    <p>Cargando...</p>
  </div>
  <div data-if="!isLoading">
    <p>Contenido cargado.</p>
  </div>
</section>
`,
  case15: /*html*/ `
<script>
  let progress = 50; // Porcentaje de progreso
</script>

<section>
  <div class="progress-bar" style="width: {progress} %;"></div>
  <p>Progreso: {progress} %</p>
</section>
`,
  case16: /*html*/ `
<script>
  let userProfile = {
    name: "Carlos",
    age: 30,
    occupation: "Desarrollador",
  };
</script>

<section>
  <h1>{userProfile.name}</h1>
  <p>Edad: {userProfile.age}</p>
  <p>Ocupación: {userProfile.occupation}</p>
</section>
`,
  case17: /*html*/ `
<script>
  let list = [
    { id: 1, name: "Elemento A", selected: false },
    { id: 2, name: "Elemento B", selected: true },
  ];
</script>

<section>
  <ul>
    <li data-for="item in list">
      <span>{item.name}</span>
      <span data-if="item.selected">(Seleccionado)</span>
    </li>
  </ul>
</section>
`,
  case18: /*html*/ `
<script>
  let step = 1;
  function nextStep() {
    step++;
  }
</script>

<section>
  <div data-if="step === 1">
    <p>Paso 1: Información básica</p>
    <button onclick="nextStep()">Siguiente</button>
  </div>
  <div data-if="step === 2">
    <p>Paso 2: Detalles adicionales</p>
    <button onclick="nextStep()">Finalizar</button>
  </div>
  <div data-if="step > 2">
    <p>Formulario completado.</p>
  </div>
</section>
`,
  case19: /*html*/ `
<script>
  let count = 0;
  function increment() {
    count++;
  }
</script>

<article>
  <h1>Este es el <strong>Contador</strong></h1>
  <button onclick="increment()">Incrementar</button>
  <p>Contador: {count}</p>
</article>
`,
};

export const expectedOutputs = {
  case1: {
    imports: ``,
    props: `this.props = props;`,
    state: ``,
    subscriptions: ``,
    bindMethods: ``,
    styles: ``,
    methods: ``,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
const div00 = document.createElement("div");
section0.appendChild(div00);
const section0TextNode1 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode1);
const span20 = document.createElement("span");
section0.appendChild(span20);
const section0TextNode3 = document.createTextNode(\`
\`);
section0.appendChild(section0TextNode3);
section0.setAttribute("data-component-id", \`case1-\${this.id}\`);

`,
  },
  case2: {
    imports: `import Hijo from "/src/app/components/Hijo.html";`,
    props: `this.props = { titulo: "", boton: "", ...props };`,
    state: `this.defineReactiveProperty(this.state, "count", 0);
this.defineReactiveProperty(this.state, "names", ["pepe", "paco", "luis", "jose", "wladimir"]);`,
    subscriptions: `this.subscriptions.count.push(() => this.render());
this.subscriptions.names.push(() => this.render());`,
    bindMethods: `this.increment = this.increment.bind(this);`,
    styles: ``,
    methods: `increment() {
  this.state.count++;
  console.log(this.state.count);
}`,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
const h100 = document.createElement("h1");
const h100TextNode00 = document.createTextNode(this.props.titulo);
h100.appendChild(h100TextNode00);
section0.appendChild(h100);
const section0TextNode1 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode1);
const h220 = document.createElement("h2");
const h220TextNode20 = document.createTextNode(\`Bienvenido\`);
h220.appendChild(h220TextNode20);
section0.appendChild(h220);
const section0TextNode3 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode3);
const button40 = document.createElement("button");
const button40TextNode40 = document.createTextNode(this.props.boton);
button40.appendChild(button40TextNode40);
this.registerEventListener(button40, "click", (event) => this.increment());
section0.appendChild(button40);
const section0TextNode5 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode5);
if (this.state.count > 0) {
const p60 = document.createElement("p");
const p60TextNode60 = document.createTextNode(\`Contador: \${this.state.count}\`);
p60.appendChild(p60TextNode60);
section0.appendChild(p60);
}
const section0TextNode7 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode7);
this.state.names.forEach((name, id) => {
  const hijo80 = new Hijo({title: name, num: 2});
  hijo80.mount(section0);
});
const section0TextNode9 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode9);
const ul100 = document.createElement("ul");
this.state.names.forEach((name, id) => {
const li0100 = document.createElement("li");
const li0100TextNode0100 = document.createTextNode(name);
li0100.appendChild(li0100TextNode0100);
ul100.appendChild(li0100);
});
const ul100TextNode1 = document.createTextNode(\`
  \`);
ul100.appendChild(ul100TextNode1);
section0.appendChild(ul100);
const section0TextNode11 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode11);
this.state.names.forEach((name, id) => {
const article120 = document.createElement("article");
const header0120 = document.createElement("header");
const h100120 = document.createElement("h1");
const h100120TextNode00120 = document.createTextNode(this.props.titulo);
h100120.appendChild(h100120TextNode00120);
header0120.appendChild(h100120);
const header0120TextNode1 = document.createTextNode(\`
  \`);
header0120.appendChild(header0120TextNode1);
article120.appendChild(header0120);
const article120TextNode1 = document.createTextNode(\`
  \`);
article120.appendChild(article120TextNode1);
const p2120 = document.createElement("p");
const p2120TextNode2120 = document.createTextNode(name);
p2120.appendChild(p2120TextNode2120);
article120.appendChild(p2120);
const article120TextNode3 = document.createTextNode(\`
  \`);
article120.appendChild(article120TextNode3);
const footer4120 = document.createElement("footer");
const p04120 = document.createElement("p");
const p04120TextNode04120 = document.createTextNode(\`pie de tarjeta\`);
p04120.appendChild(p04120TextNode04120);
footer4120.appendChild(p04120);
const footer4120TextNode1 = document.createTextNode(\`
  \`);
footer4120.appendChild(footer4120TextNode1);
article120.appendChild(footer4120);
const article120TextNode5 = document.createTextNode(\`
  \`);
article120.appendChild(article120TextNode5);
section0.appendChild(article120);
});
const section0TextNode13 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode13);
section0.setAttribute("data-component-id", \`case2-\${this.id}\`);`,
  },
  case3: {
    imports: ``,
    props: `this.props = props;`,
    state: `this.defineReactiveProperty(this.state, "isLoggedIn", false);
this.defineReactiveProperty(this.state, "user", { name: "Juan Pérez" });`,
    subscriptions: `this.subscriptions.isLoggedIn.push(() => this.render());
this.subscriptions.user.push(() => this.render());`,
    bindMethods: ``,
    styles: ``,
    methods: ``,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
if (this.state.isLoggedIn) {
const div00 = document.createElement("div");
const h1000 = document.createElement("h1");
const h1000TextNode000 = document.createTextNode(this.state.user.name);
h1000.appendChild(h1000TextNode000);
div00.appendChild(h1000);
const div00TextNode1 = document.createTextNode(\`
  \`);
div00.appendChild(div00TextNode1);
section0.appendChild(div00);
}
const section0TextNode1 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode1);
if (!this.state.isLoggedIn) {
const div20 = document.createElement("div");
const p020 = document.createElement("p");
const p020TextNode020 = document.createTextNode(\`Por favor, inicia sesión\`);
p020.appendChild(p020TextNode020);
div20.appendChild(p020);
const div20TextNode1 = document.createTextNode(\`
  \`);
div20.appendChild(div20TextNode1);
section0.appendChild(div20);
}
const section0TextNode3 = document.createTextNode(\`
\`);
section0.appendChild(section0TextNode3);
section0.setAttribute("data-component-id", \`case3-\${this.id}\`);`,
  },
  case4: {
    imports: ``,
    props: `this.props = props;`,
    state: ``,
    subscriptions: ``,
    bindMethods: `this.customEventHandler = this.customEventHandler.bind(this);`,
    styles: ``,
    methods: `customEventHandler() {
    alert("Evento personalizado disparado");
  }`,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
const button00 = document.createElement("button");
const button00TextNode00 = document.createTextNode(\`Haz clic en mí\`);
button00.appendChild(button00TextNode00);
this.registerEventListener(button00, "custom", (event) => this.customEventHandler());
section0.appendChild(button00);
const section0TextNode1 = document.createTextNode(\`
\`);
section0.appendChild(section0TextNode1);
section0.setAttribute("data-component-id", \`case4-\${this.id}\`);`,
  },
  case5: {
    imports: ``,
    props: `this.props = props;`,
    state: `this.defineReactiveProperty(this.state, "items", ["item1", "item2", "item3"]);`,
    subscriptions: `this.subscriptions.items.push(() => this.render());`,
    bindMethods: ``,
    styles: ``,
    methods: ``,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
const ul00 = document.createElement("ul");
this.state.items.forEach((item, id) => {
const li000 = document.createElement("li");
const li000TextNode000 = document.createTextNode(item);
li000.appendChild(li000TextNode000);
ul00.appendChild(li000);
});
const ul00TextNode1 = document.createTextNode(\`
  \`);
ul00.appendChild(ul00TextNode1);
section0.appendChild(ul00);
const section0TextNode1 = document.createTextNode(\`
\`);
section0.appendChild(section0TextNode1);
section0.setAttribute("data-component-id", \`case5-\${this.id}\`);`,
  },
  case6: {
    imports: ``,
    props: `this.props = props;`,
    state: `this.defineReactiveProperty(this.state, "imageUrl", "https://via.placeholder.com/150");
this.defineReactiveProperty(this.state, "imageAlt", "Imagen de ejemplo");
this.defineReactiveProperty(this.state, "description", "Esta es una descripción de prueba");`,
    subscriptions: `this.subscriptions.imageUrl.push(() => this.render());
this.subscriptions.imageAlt.push(() => this.render());
this.subscriptions.description.push(() => this.render());`,
    bindMethods: ``,
    styles: ``,
    methods: ``,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
if (this.state.imageUrl) {
const img00 = document.createElement("img");
img00.setAttribute("src", this.state.imageUrl);
img00.setAttribute("alt", this.state.imageAlt);
section0.appendChild(img00);
}
const section0TextNode1 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode1);
const p20 = document.createElement("p");
const p20TextNode20 = document.createTextNode(this.state.description);
p20.appendChild(p20TextNode20);
section0.appendChild(p20);
const section0TextNode3 = document.createTextNode(\`
\`);
section0.appendChild(section0TextNode3);
section0.setAttribute("data-component-id", \`case6-\${this.id}\`);`,
  },
  case7: {
    imports: ``,
    props: `this.props = props;`,
    state: `this.defineReactiveProperty(this.state, "dynamicClasses", "text-center bg-primary");
this.defineReactiveProperty(this.state, "title", "Este es un título dinámico");`,
    subscriptions: `this.subscriptions.dynamicClasses.push(() => this.render());
this.subscriptions.title.push(() => this.render());`,
    bindMethods: ``,
    styles: ``,
    methods: ``,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
const h100 = document.createElement("h1");
const h100TextNode00 = document.createTextNode(this.state.title);
h100.appendChild(h100TextNode00);
h100.setAttribute("class", this.state.dynamicClasses);
section0.appendChild(h100);
const section0TextNode1 = document.createTextNode(\`
\`);
section0.appendChild(section0TextNode1);
section0.setAttribute("data-component-id", \`case7-\${this.id}\`);`,
  },
  case8: {
    imports: ``,
    props: `this.props = props;`,
    state: `this.defineReactiveProperty(this.state, "data", [ { id: 1, value: "Elemento 1" }, { id: 2, value: "Elemento 2" }, ]);`,
    subscriptions: `this.subscriptions.data.push(() => this.render());`,
    bindMethods: ``,
    styles: ``,
    methods: ``,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
this.state.data.forEach((item, id) => {
const div00 = document.createElement("div");
const p000 = document.createElement("p");
const p000TextNode000 = document.createTextNode(\`ID: \${item.id}\`);
p000.appendChild(p000TextNode000);
div00.appendChild(p000);
const div00TextNode1 = document.createTextNode(\`
    \`);
div00.appendChild(div00TextNode1);
const p200 = document.createElement("p");
const p200TextNode200 = document.createTextNode(\`Valor: \${item.value}\`);
p200.appendChild(p200TextNode200);
div00.appendChild(p200);
const div00TextNode3 = document.createTextNode(\`
  \`);
div00.appendChild(div00TextNode3);
section0.appendChild(div00);
});
const section0TextNode1 = document.createTextNode(\`
\`);
section0.appendChild(section0TextNode1);
section0.setAttribute("data-component-id", \`case8-\${this.id}\`);`,
  },
  case9: {
    imports: ``,
    props: `this.props = props;`,
    state: `this.defineReactiveProperty(this.state, "showModal", false);
this.defineReactiveProperty(this.state, "modalContent", "Este es el contenido del modal");`,
    subscriptions: `this.subscriptions.showModal.push(() => this.render());
this.subscriptions.modalContent.push(() => this.render());`,
    bindMethods: `this.toggleModal = this.toggleModal.bind(this);`,
    styles: ``,
    methods: `toggleModal() {
    this.state.showModal = !this.state.showModal;
  }`,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
const button00 = document.createElement("button");
const button00TextNode00 = document.createTextNode(\`Abrir modal\`);
button00.appendChild(button00TextNode00);
this.registerEventListener(button00, "click", (event) => this.toggleModal());
section0.appendChild(button00);
const section0TextNode1 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode1);
if (this.state.showModal) {
const div20 = document.createElement("div");
const p020 = document.createElement("p");
const p020TextNode020 = document.createTextNode(this.state.modalContent);
p020.appendChild(p020TextNode020);
div20.appendChild(p020);
const div20TextNode1 = document.createTextNode(\`
    \`);
div20.appendChild(div20TextNode1);
const button220 = document.createElement("button");
const button220TextNode220 = document.createTextNode(\`Cerrar modal\`);
button220.appendChild(button220TextNode220);
this.registerEventListener(button220, "click", (event) => this.toggleModal());
div20.appendChild(button220);
const div20TextNode3 = document.createTextNode(\`
  \`);
div20.appendChild(div20TextNode3);
div20.setAttribute("class", "modal");
section0.appendChild(div20);
}
const section0TextNode3 = document.createTextNode(\`
\`);
section0.appendChild(section0TextNode3);
section0.setAttribute("data-component-id", \`case9-\${this.id}\`);`,
  },
  case10: {
    imports: ``,
    props: `this.props = props;`,
    state: `this.defineReactiveProperty(this.state, "items", ["rojo", "verde", "azul"]);
this.defineReactiveProperty(this.state, "selectedColor", null);`,
    subscriptions: `this.subscriptions.items.push(() => this.render());
this.subscriptions.selectedColor.push(() => this.render());`,
    bindMethods: `this.selectColor = this.selectColor.bind(this);`,
    styles: ``,
    methods: `selectColor(color) {
    this.state.selectedColor = color;
  }`,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
const ul00 = document.createElement("ul");
this.state.items.forEach((color, id) => {
const li000 = document.createElement("li");
const button0000 = document.createElement("button");
const button0000TextNode0000 = document.createTextNode(color);
button0000.appendChild(button0000TextNode0000);
this.registerEventListener(button0000, "click", (event) => this.selectColor(color));
li000.appendChild(button0000);
const li000TextNode1 = document.createTextNode(\`
    \`);
li000.appendChild(li000TextNode1);
ul00.appendChild(li000);
});
const ul00TextNode1 = document.createTextNode(\`
  \`);
ul00.appendChild(ul00TextNode1);
section0.appendChild(ul00);
const section0TextNode1 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode1);
if (this.state.selectedColor) {
const p20 = document.createElement("p");
const p20TextNode20 = document.createTextNode(\`Color seleccionado: \${this.state.selectedColor}\`);
p20.appendChild(p20TextNode20);
section0.appendChild(p20);
}
const section0TextNode3 = document.createTextNode(\`
\`);
section0.appendChild(section0TextNode3);
section0.setAttribute("data-component-id", \`case10-\${this.id}\`);`,
  },
  case11: {
    imports: ``,
    props: `this.props = props;`,
    state: `this.defineReactiveProperty(this.state, "hasPermission", false);
this.defineReactiveProperty(this.state, "message", hasPermission ? "Tienes permiso" : "No tienes permiso");`,
    subscriptions: `this.subscriptions.hasPermission.push(() => this.render());
this.subscriptions.message.push(() => this.render());`,
    bindMethods: ``,
    styles: ``,
    methods: ``,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
const p00 = document.createElement("p");
const p00TextNode00 = document.createTextNode(this.state.message);
p00.appendChild(p00TextNode00);
section0.appendChild(p00);
const section0TextNode1 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode1);
if (this.state.hasPermission) {
const div20 = document.createElement("div");
const p020 = document.createElement("p");
const p020TextNode020 = document.createTextNode(\`Contenido visible solo para usuarios con permiso.\`);
p020.appendChild(p020TextNode020);
div20.appendChild(p020);
const div20TextNode1 = document.createTextNode(\`
  \`);
div20.appendChild(div20TextNode1);
section0.appendChild(div20);
}
const section0TextNode3 = document.createTextNode(\`
\`);
section0.appendChild(section0TextNode3);
section0.setAttribute("data-component-id", \`case11-\${this.id}\`);`,
  },
  case12: {
    imports: ``,
    props: `this.props = props;`,
    state: `this.defineReactiveProperty(this.state, "articles", [ { title: "Artículo 1", body: "Contenido del artículo 1" }, { title: "Artículo 2", body: "Contenido del artículo 2" }, ]);`,
    subscriptions: `this.subscriptions.articles.push(() => this.render());`,
    bindMethods: ``,
    styles: ``,
    methods: ``,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
this.state.articles.forEach((article, id) => {
const article00 = document.createElement("article");
const h2000 = document.createElement("h2");
const h2000TextNode000 = document.createTextNode(article.title);
h2000.appendChild(h2000TextNode000);
article00.appendChild(h2000);
const article00TextNode1 = document.createTextNode(\`
    \`);
article00.appendChild(article00TextNode1);
const p200 = document.createElement("p");
const p200TextNode200 = document.createTextNode(article.body);
p200.appendChild(p200TextNode200);
article00.appendChild(p200);
const article00TextNode3 = document.createTextNode(\`
  \`);
article00.appendChild(article00TextNode3);
section0.appendChild(article00);
});
const section0TextNode1 = document.createTextNode(\`
\`);
section0.appendChild(section0TextNode1);
section0.setAttribute("data-component-id", \`case12-\${this.id}\`);`,
  },
  case13: {
    imports: ``,
    props: `this.props = props;`,
    state: `this.defineReactiveProperty(this.state, "inputValue", "");`,
    subscriptions: `this.subscriptions.inputValue.push(() => this.render());`,
    bindMethods: `this.updateValue = this.updateValue.bind(this);`,
    styles: ``,
    methods: `updateValue(event) {
    this.state.inputValue = event.target.value;
  }`,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
const input00 = document.createElement("input");
this.registerEventListener(input00, "input", (event) => this.updateValue(event));
input00.setAttribute("type", "text");
input00.setAttribute("placeholder", "Escribe algo...");
section0.appendChild(input00);
const section0TextNode1 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode1);
const p20 = document.createElement("p");
const p20TextNode20 = document.createTextNode(\`Valor ingresado: \${this.state.inputValue}\`);
p20.appendChild(p20TextNode20);
section0.appendChild(p20);
const section0TextNode3 = document.createTextNode(\`
\`);
section0.appendChild(section0TextNode3);
section0.setAttribute("data-component-id", \`case13-\${this.id}\`);`,
  },
  case14: {
    imports: ``,
    props: `this.props = props;`,
    state: `this.defineReactiveProperty(this.state, "isLoading", true);`,
    subscriptions: `this.subscriptions.isLoading.push(() => this.render());`,
    bindMethods: ``,
    styles: ``,
    methods: ``,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
if (this.state.isLoading) {
const div00 = document.createElement("div");
const p000 = document.createElement("p");
const p000TextNode000 = document.createTextNode(\`Cargando...\`);
p000.appendChild(p000TextNode000);
div00.appendChild(p000);
const div00TextNode1 = document.createTextNode(\`
  \`);
div00.appendChild(div00TextNode1);
section0.appendChild(div00);
}
const section0TextNode1 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode1);
if (!this.state.isLoading) {
const div20 = document.createElement("div");
const p020 = document.createElement("p");
const p020TextNode020 = document.createTextNode(\`Contenido cargado.\`);
p020.appendChild(p020TextNode020);
div20.appendChild(p020);
const div20TextNode1 = document.createTextNode(\`
  \`);
div20.appendChild(div20TextNode1);
section0.appendChild(div20);
}
const section0TextNode3 = document.createTextNode(\`
\`);
section0.appendChild(section0TextNode3);
section0.setAttribute("data-component-id", \`case14-\${this.id}\`);`,
  },
  case15: {
    imports: ``,
    props: `this.props = props;`,
    state: `this.defineReactiveProperty(this.state, "progress", 50);`,
    subscriptions: `this.subscriptions.progress.push(() => this.render());`,
    bindMethods: ``,
    styles: ``,
    methods: ``,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
const div00 = document.createElement("div");
div00.setAttribute("class", "progress-bar");
div00.setAttribute("style", \`width: \${this.state.progress} %;\`);
section0.appendChild(div00);
const section0TextNode1 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode1);
const p20 = document.createElement("p");
const p20TextNode20 = document.createTextNode(\`Progreso: \${this.state.progress} %\`);
p20.appendChild(p20TextNode20);
section0.appendChild(p20);
const section0TextNode3 = document.createTextNode(\`
\`);
section0.appendChild(section0TextNode3);
section0.setAttribute("data-component-id", \`case15-\${this.id}\`);`,
  },
  case16: {
    imports: ``,
    props: `this.props = props;`,
    state: `this.defineReactiveProperty(this.state, "userProfile", { name: "Carlos", age: 30, occupation: "Desarrollador", });`,
    subscriptions: `this.subscriptions.userProfile.push(() => this.render());`,
    bindMethods: ``,
    styles: ``,
    methods: ``,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
const h100 = document.createElement("h1");
const h100TextNode00 = document.createTextNode(this.state.userProfile.name);
h100.appendChild(h100TextNode00);
section0.appendChild(h100);
const section0TextNode1 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode1);
const p20 = document.createElement("p");
const p20TextNode20 = document.createTextNode(\`Edad: \${this.state.userProfile.age}\`);
p20.appendChild(p20TextNode20);
section0.appendChild(p20);
const section0TextNode3 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode3);
const p40 = document.createElement("p");
const p40TextNode40 = document.createTextNode(\`Ocupación: \${this.state.userProfile.occupation}\`);
p40.appendChild(p40TextNode40);
section0.appendChild(p40);
const section0TextNode5 = document.createTextNode(\`
\`);
section0.appendChild(section0TextNode5);
section0.setAttribute("data-component-id", \`case16-\${this.id}\`);`,
  },
  case17: {
    imports: ``,
    props: `this.props = props;`,
    state: `this.defineReactiveProperty(this.state, "list", [ { id: 1, name: "Elemento A", selected: false }, { id: 2, name: "Elemento B", selected: true }, ]);`,
    subscriptions: `this.subscriptions.list.push(() => this.render());`,
    bindMethods: ``,
    styles: ``,
    methods: ``,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
const ul00 = document.createElement("ul");
this.state.list.forEach((item, id) => {
const li000 = document.createElement("li");
const span0000 = document.createElement("span");
const span0000TextNode0000 = document.createTextNode(item.name);
span0000.appendChild(span0000TextNode0000);
li000.appendChild(span0000);
const li000TextNode1 = document.createTextNode(\`
      \`);
li000.appendChild(li000TextNode1);
if (item.selected) {
const span2000 = document.createElement("span");
const span2000TextNode2000 = document.createTextNode(\`(Seleccionado)\`);
span2000.appendChild(span2000TextNode2000);
li000.appendChild(span2000);
}
const li000TextNode3 = document.createTextNode(\`
    \`);
li000.appendChild(li000TextNode3);
ul00.appendChild(li000);
});
const ul00TextNode1 = document.createTextNode(\`
  \`);
ul00.appendChild(ul00TextNode1);
section0.appendChild(ul00);
const section0TextNode1 = document.createTextNode(\`
\`);
section0.appendChild(section0TextNode1);
section0.setAttribute("data-component-id", \`case17-\${this.id}\`);`,
  },
  case18: {
    imports: ``,
    props: `this.props = props;`,
    state: `this.defineReactiveProperty(this.state, "step", 1);`,
    subscriptions: `this.subscriptions.step.push(() => this.render());`,
    bindMethods: `this.nextStep = this.nextStep.bind(this);`,
    styles: ``,
    methods: `nextStep() {
    this.state.step++;
  }`,
    headContent: ``,
    container: `section0`,
    templateContent: `const section0 = document.createElement("section");
if (this.state.step === 1) {
const div00 = document.createElement("div");
const p000 = document.createElement("p");
const p000TextNode000 = document.createTextNode(\`Paso 1: Información básica\`);
p000.appendChild(p000TextNode000);
div00.appendChild(p000);
const div00TextNode1 = document.createTextNode(\`
  \`);
div00.appendChild(div00TextNode1);
const button200 = document.createElement("button");
const button200TextNode200 = document.createTextNode(\`Siguiente\`);
button200.appendChild(button200TextNode200);
this.registerEventListener(button200, "click", (event) => this.nextStep());
div00.appendChild(button200);
const div00TextNode3 = document.createTextNode(\`
  \`);
div00.appendChild(div00TextNode3);
section0.appendChild(div00);
}
const section0TextNode1 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode1);
if (this.state.step === 2) {
const div20 = document.createElement("div");
const p020 = document.createElement("p");
const p020TextNode020 = document.createTextNode(\`Paso 2: Detalles adicionales\`);
p020.appendChild(p020TextNode020);
div20.appendChild(p020);
const div20TextNode1 = document.createTextNode(\`
    \`);
div20.appendChild(div20TextNode1);
const button220 = document.createElement("button");
const button220TextNode220 = document.createTextNode(\`Finalizar\`);
button220.appendChild(button220TextNode220);
this.registerEventListener(button220, "click", (event) => this.nextStep());
div20.appendChild(button220);
const div20TextNode3 = document.createTextNode(\`
  \`);
div20.appendChild(div20TextNode3);
section0.appendChild(div20);
}
const section0TextNode3 = document.createTextNode(\`
  \`);
section0.appendChild(section0TextNode3);
if (this.state.step > 2) {
const div40 = document.createElement("div");
const p040 = document.createElement("p");
const p040TextNode040 = document.createTextNode(\`Formulario completado.\`);
p040.appendChild(p040TextNode040);
div40.appendChild(p040);
const div40TextNode1 = document.createTextNode(\`
  \`);
div40.appendChild(div40TextNode1);
section0.appendChild(div40);
}
const section0TextNode5 = document.createTextNode(\`
\`);
section0.appendChild(section0TextNode5);
section0.setAttribute("data-component-id", \`case18-\${this.id}\`);`,
  },
  case19: {
    imports: ``,
    props: `this.props = props;`,
    state: `this.defineReactiveProperty(this.state, "count", 0);`,
    subscriptions: `this.subscriptions.count.push(() => this.render());`,
    bindMethods: `this.increment = this.increment.bind(this);`,
    styles: ``,
    methods: `increment() {
    this.state.count++;
  }`,
    headContent: ``,
    container: `article0`,
    templateContent: `const article0 = document.createElement("article");
const h100 = document.createElement("h1");
const h100TextNode0 = document.createTextNode(\`Este es el \`);
h100.appendChild(h100TextNode0);
const strong100 = document.createElement("strong");
const strong100TextNode100 = document.createTextNode(\`Contador\`);
strong100.appendChild(strong100TextNode100);
h100.appendChild(strong100);
article0.appendChild(h100);
const article0TextNode1 = document.createTextNode(\`
  \`);
article0.appendChild(article0TextNode1);
const button20 = document.createElement("button");
const button20TextNode20 = document.createTextNode(\`Incrementar\`);
button20.appendChild(button20TextNode20);
this.registerEventListener(button20, "click", (event) => this.increment());
article0.appendChild(button20);
const article0TextNode3 = document.createTextNode(\`
  \`);
article0.appendChild(article0TextNode3);
const p40 = document.createElement("p");
const p40TextNode40 = document.createTextNode(\`Contador: \${this.state.count}\`);
p40.appendChild(p40TextNode40);
article0.appendChild(p40);
const article0TextNode5 = document.createTextNode(\`
\`);
article0.appendChild(article0TextNode5);
article0.setAttribute("data-component-id", \`case19-\${this.id}\`);`,
  },
};

export function getBase({
  componentName,
  imports,
  props,
  state,
  subscriptions,
  bindMethods,
  beforeMount,
  mounted,
  styles,
  methods,
  templateContent,
  container,
  headContent,
}) {
  const defineReactiveProperty = state
    ? `defineReactiveProperty(obj, key, initialValue) {
    let value = initialValue;
    this.subscriptions[key] = [];
    Object.defineProperty(obj, key, {
      get: () => value,
      set: (newValue) => {
        value = newValue;
        this.subscriptions[key].forEach((callback) => callback());
      }
    });
  }`
    : "";

  const updateComponent = state
    ? `updateComponent(currentNode, newNode) {
    if (!currentNode || !newNode) return;

    if (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent !== newNode.textContent) {
      currentNode.textContent = newNode.textContent;
    } else if (currentNode.nodeType === Node.ELEMENT_NODE && currentNode.tagName !== newNode.tagName) {
      currentNode.replaceWith(newNode.cloneNode(true));
    } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
      Array.from(newNode.attributes).forEach((attr) => {
        if (currentNode.getAttribute(attr.name) !== attr.value) {
          currentNode.setAttribute(attr.name, attr.value);
        }
      });

      const currentChildren = Array.from(currentNode.childNodes);
      const newChildren = Array.from(newNode.childNodes);

      const maxLen = Math.max(currentChildren.length, newChildren.length);
      for (let i = 0; i < maxLen; i++) {
        if (newChildren[i] && !currentChildren[i]) {
          currentNode.appendChild(newChildren[i].cloneNode(true));
        } else if (currentChildren[i] && !newChildren[i]) {
          currentNode.removeChild(currentChildren[i]);
        } else {
          this.updateComponent(currentChildren[i], newChildren[i]);
        }
      }
    }
  }`
    : "";

  const reRender = state
    ? `else {
      const el = document.querySelector(\`[data-component-id="${componentName}-\${this.id}"]\`);
      this.updateComponent(el, ${container});
    }`
    : "";

  const registerEvent = templateContent.includes("registerEventListener")
    ? `registerEventListener(element, event, callback) {
    element.addEventListener(event, callback);
    this.eventListeners.push({ element, event, callback });
  }`
    : "";

  const removeEvent = templateContent.includes("registerEventListener")
    ? `this.eventListeners.forEach(({ element, event, callback }) => {
      element.removeEventListener(event, callback);
    });
    this.eventListeners = [];
`
    : "";

  let styleContent = "";
  let styleGlobal = true;
  if (styles) {
    if (styles.includes("scope")) {
      styleContent += `scopedStyles(el) {
        const style = document.createElement("style");
        style.textContent = \`${styles}\`;
        el.appendChild(style);
      }`;
      styleGlobal = false;
    } else {
      styleContent += `ensureStyles() {
    if (!document.querySelector(\`style[data-style-for="${componentName}"]\`)) {
      const style = document.createElement("style");
      style.setAttribute("data-style-for", "${componentName}");
      style.textContent = \`${styles}\`;
      document.head.appendChild(style);
    }
  }`;
    }
  }

  return `${imports}

class ${componentName} {
  constructor(props = {}) {
    this.id = Math.random().toString(36).substring(2, 9);${
      beforeMount ? `\nthis.beforeMount = this.beforeMount.bind(this);` : ""
    }${mounted ? `\nthis.mounted = this.mounted.bind(this);` : ""}this.destroy = this.destroy.bind(this);
    this.eventListeners = [];
    this.observer = null;
    ${props}${subscriptions ? "\nthis.subscriptions = {};" : ""}${
    state ? `\nthis.state = {};\n${state}` : ""
  }${subscriptions}${bindMethods}${styleContent && styleGlobal ? "\nthis.ensureStyles();" : ""}
  }

  ${defineReactiveProperty}

  observeDOM(node) {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((removedNode) => {
          if (removedNode === node) {
            this.destroy();
            this.observer.disconnect();
          }
        })
      });
    });

    const parent = node.parentNode;
    if (parent) {
      this.observer.observe(parent, { childList: true });
    }
  }

  ${registerEvent}

  ${beforeMount ? beforeMount : ""}

  ${mounted ? mounted : ""}

  destroy() {
    console.log("destroy");
    ${removeEvent}
    const el = document.querySelector(\`[data-component-id="${componentName}-\${this.id}"]\`);
    const style = document.querySelector(\`style[data-style-for="${componentName}"]\`);
    if (el) el.remove();
    if (style) style.remove();
  }

  ${methods}
  
  ${styleContent}

  ${updateComponent}

  ${headContent}

  render(container = null) {
    ${templateContent}

    if (container) {
      container.appendChild(${container});
      ${styleContent && !styleGlobal ? `this.scopedStyles(${container});\n` : ""}this.observeDOM(${container});
    } ${reRender}

    return ${container};
  }

  mount(container, replace = false) {
    ${beforeMount ? `this.beforeMount();\n` : ""}if (replace && container) container.innerHTML = "";
    ${headContent ? `this.renderHead();\n` : ""}this.render(container);${mounted ? `\nthis.mounted();` : ""}
  }

  unmount() {
    this.destroy();
  }
}

export default ${componentName};`;
}
