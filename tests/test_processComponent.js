function normalizeString(str) {
  return str.replace(/\s+/g, " ").trim();
}

function diff2(str1, str2, head = "Differences in the test") {
  const lines1 = str1.split("\n");
  const lines2 = str2.split("\n");

  const yellowColor = "\x1b[33m";
  const greenColor = "\x1b[32m";
  const redColor = "\x1b[31m";
  const blueColor = "\x1b[34m";
  const reset = "\x1b[0m";

  const map1 = new Map(lines1.map((line, index) => [line, index]));
  const map2 = new Map(lines2.map((line, index) => [line, index]));

  const diffReceived = [];
  const difference = [];

  let i = 0;
  let j = 0;

  while (i < lines1.length || j < lines2.length) {
    const line1 = lines1[i] || "";
    const line2 = lines2[j] || "";
    const pos1 = map1.get(line2);

    if (line1 === line2 && pos1 === j) {
      diffReceived.push(`  ${line1}`);
      i++;
      j++;
    } else if (!map1.has(line2)) {
      if (line2) {
        diffReceived.push(`${greenColor}+ ${line2}${reset}`);
        difference.push(`${blueColor}Added line: ${i + 1}${reset}`);
        difference.push(`${greenColor}+ ${line2}${reset}`);
      } else {
        diffReceived.push(line2);
      }
      j++;
    } else if (!map2.has(line1)) {
      if (line2) {
        diffReceived.push(`${redColor}- ${line1}${reset}`);
        difference.push(`${blueColor}Removed line: ${i + 1}${reset}`);
        difference.push(`${redColor}- ${line1}${reset}`);
      } else {
        diffReceived.push(line2);
      }
      i++;
    } else {
      if (j < pos1) {
        if (line2) {
          diffReceived.push(`${yellowColor}↑ ${line2}${reset}`);
          difference.push(`${blueColor}Moved line: ${pos1 + 1} to ${j + 1}${reset}`);
          difference.push(`${yellowColor}↑ ${line2}${reset}`);
        } else {
          diffReceived.push(line2);
        }
        j++;
        if (line1 === line2) i++;
      } else if (j > pos1) {
        if (line2) {
          diffReceived.push(`${yellowColor}↓ ${line2}${reset}`);
          difference.push(`${blueColor}Moved line: ${pos1 + 1} to ${j + 1}${reset}`);
          difference.push(`${yellowColor}↓ ${line2}${reset}`);
        } else {
          diffReceived.push(line2);
        }
        j++;
        if (line1 === line2) i++;
      } else {
        i++;
      }
    }
  }

  const output = `${redColor}${head}${reset}

${yellowColor}Expected:${reset}
${blueColor}${str1}${reset}

${yellowColor}Received:${reset}
${diffReceived.join("\n")}

${yellowColor}Difference:${reset}
${difference.join("\n")}
`;

  return output;
}

export default function runTestCases(compilerFunction) {
  let allTestsPassed = true;
  let passedTests = 0;

  Object.entries(testCases).forEach(([key, input]) => {
    console.log(`Running ${key}...`);
    const output = compilerFunction(input.trim(), key).templateContent;
    const expectedOutput = expectedOutputs[key].trim();

    if (normalizeString(output) !== normalizeString(expectedOutput)) {
      console.log(diff2(expectedOutput, output, `Test ${key} failed!`));
      allTestsPassed = false;
    } else {
      passedTests++;
      console.info(`\x1b[32mTestTest ${key} passed! ✔️\x1b[0m`);
    }
  });

  if (allTestsPassed) {
    console.info("\x1b[32mAll tests passed! 🎉\x1b[0m");
  } else {
    console.info(`\x1b[32m${passedTests} test passed.\x1b[0m`);
    console.error(`${Object.keys(testCases).length - passedTests} failed tests`);
    console.info("Some tests failed. See above for details.");
  }
}

const testCases = {
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
    console.log(count)
  }
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
};

const expectedOutputs = {
  case1: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case1-\${this.id}\`);

const div0 = document.createElement("div");
section.appendChild(div0);

const span1 = document.createElement("span");
section.appendChild(span1);`,
  case2: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case2-\${this.id}\`);

const h10 = document.createElement("h1");
h10.textContent = this.props.titulo;
section.appendChild(h10);

const h21 = document.createElement("h2");
h21.textContent = "Bienvenido";
section.appendChild(h21);

const button2 = document.createElement("button");
button2.textContent = this.props.boton;
button2.onclick = this.increment;
section.appendChild(button2);

if (this.state.count > 0) {
const p3 = document.createElement("p");
p3.textContent = \`Contador: \${this.state.count}\`;
section.appendChild(p3);
}

this.state.names.forEach((name) => {
  const hijo4Clone = new Hijo({title: name, num: 2});
  hijo4Clone.mount(section);
});

const ul5 = document.createElement("ul");
this.state.names.forEach((name) => {
  const li0 = document.createElement("li");
  li0.textContent = name;
  ul5.appendChild(li0);
});
section.appendChild(ul5);

this.state.names.forEach((name) => {
const article6 = document.createElement("article");
const header0 = document.createElement("header");
const h10 = document.createElement("h1");
h10.textContent = this.props.titulo;
header0.appendChild(h10);
article6.appendChild(header0);

const p1 = document.createElement("p");
p1.textContent = name;
article6.appendChild(p1);

const footer2 = document.createElement("footer");
const p0 = document.createElement("p");
p0.textContent = "pie de tarjeta";
footer2.appendChild(p0);
article6.appendChild(footer2);
section.appendChild(article6);
});`,
  case3: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case3-\${this.id}\`);

if (this.state.isLoggedIn) {
const div0 = document.createElement("div");
const h10 = document.createElement("h1");
h10.textContent = this.state.user.name;
div0.appendChild(h10);
section.appendChild(div0);
}

if (!this.state.isLoggedIn) {
const div1 = document.createElement("div");
const p0 = document.createElement("p");
p0.textContent = "Por favor, inicia sesión";
div1.appendChild(p0);
section.appendChild(div1);
}`,
  case4: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case4-\${this.id}\`);

const button0 = document.createElement("button");
button0.textContent = "Haz clic en mí";
button0.oncustom = this.customEventHandler;
section.appendChild(button0);`,
  case5: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case5-\${this.id}\`);

const ul0 = document.createElement("ul");
this.state.items.forEach((item) => {
  const li0 = document.createElement("li");
  li0.textContent = item;
  ul0.appendChild(li0);
});
section.appendChild(ul0);`,
  case6: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case6-\${this.id}\`);

if (this.state.imageUrl) {
const img0 = document.createElement("img");
img0.setAttribute("src", this.state.imageUrl);
img0.setAttribute("alt", this.state.imageAlt);
section.appendChild(img0);
}

const p1 = document.createElement("p");
p1.textContent = this.state.description;
section.appendChild(p1);`,
  case7: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case7-\${this.id}\`);

const h10 = document.createElement("h1");
h10.textContent = this.state.title;
h10.setAttribute("class", this.state.dynamicClasses);
section.appendChild(h10);`,
  case8: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case8-\${this.id}\`);

this.state.data.forEach((item) => {
const div0 = document.createElement("div");
const p0 = document.createElement("p");
p0.textContent = \`ID: \${item.id}\`;
div0.appendChild(p0);

const p1 = document.createElement("p");
p1.textContent = \`Valor: \${item.value}\`;
div0.appendChild(p1);
section.appendChild(div0);
});`,
  case9: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case9-\${this.id}\`);

const button0 = document.createElement("button");
button0.textContent = "Abrir modal";
button0.onclick = this.toggleModal;
section.appendChild(button0);

if (this.state.showModal) {
const div1 = document.createElement("div");
const p0 = document.createElement("p");
p0.textContent = this.state.modalContent;
div1.appendChild(p0);

const button1 = document.createElement("button");
button1.textContent = "Cerrar modal";
button1.onclick = this.toggleModal;
div1.appendChild(button1);
div1.setAttribute("class", "modal");
section.appendChild(div1);
}`,
  case10: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case10-\${this.id}\`);

const ul0 = document.createElement("ul");
this.state.items.forEach((color) => {
  const li0 = document.createElement("li");
  const button0 = document.createElement("button");
  button0.textContent = color;
  button0.onclick = this.selectColor(color);
  li0.appendChild(button0);
  ul0.appendChild(li0);
});
section.appendChild(ul0);

if (this.state.selectedColor) {
const p1 = document.createElement("p");
p1.textContent = \`Color seleccionado: \${this.state.selectedColor}\`;
section.appendChild(p1);
}`,
  case11: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case11-\${this.id}\`);

const p0 = document.createElement("p");
p0.textContent = this.state.message;
section.appendChild(p0);

if (this.state.hasPermission) {
const div1 = document.createElement("div");
const p0 = document.createElement("p");
p0.textContent = "Contenido visible solo para usuarios con permiso.";
div1.appendChild(p0);
section.appendChild(div1);
}`,
  case12: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case12-\${this.id}\`);

this.state.articles.forEach((article) => {
const article0 = document.createElement("article");
const h20 = document.createElement("h2");
h20.textContent = article.title;
article0.appendChild(h20);

const p1 = document.createElement("p");
p1.textContent = article.body;
article0.appendChild(p1);
section.appendChild(article0);
});`,
  case13: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case13-\${this.id}\`);

const input0 = document.createElement("input");
input0.oninput = this.updateValue(event);
input0.setAttribute("type", "text");
input0.setAttribute("placeholder", "Escribe algo...");
section.appendChild(input0);

const p1 = document.createElement("p");
p1.textContent = \`Valor ingresado: \${this.state.inputValue}\`;
section.appendChild(p1);`,
  case14: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case14-\${this.id}\`);

if (this.state.isLoading) {
const div0 = document.createElement("div");
const p0 = document.createElement("p");
p0.textContent = "Cargando...";
div0.appendChild(p0);
section.appendChild(div0);
}

if (!this.state.isLoading) {
const div1 = document.createElement("div");
const p0 = document.createElement("p");
p0.textContent = "Contenido cargado.";
div1.appendChild(p0);
section.appendChild(div1);
}`,
  case15: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case15-\${this.id}\`);

const div0 = document.createElement("div");
div0.setAttribute("class", "progress-bar");
div0.setAttribute("style", \`width: \${this.state.progress} %;\`);
section.appendChild(div0);

const p1 = document.createElement("p");
p1.textContent = \`Progreso: \${this.state.progress} %\`;
section.appendChild(p1);`,
  case16: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case16-\${this.id}\`);

const h10 = document.createElement("h1");
h10.textContent = this.state.userProfile.name;
section.appendChild(h10);

const p1 = document.createElement("p");
p1.textContent = \`Edad: \${this.state.userProfile.age}\`;
section.appendChild(p1);

const p2 = document.createElement("p");
p2.textContent = \`Ocupación: \${this.state.userProfile.occupation}\`;
section.appendChild(p2);`,
  case17: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case17-\${this.id}\`);

const ul0 = document.createElement("ul");
this.state.list.forEach((item) => {
  const li0 = document.createElement("li");
  const span0 = document.createElement("span");
  span0.textContent = item.name;
  li0.appendChild(span0);

  if (item.selected) {
    const span1 = document.createElement("span");
    span1.textContent = "(Seleccionado)";
    li0.appendChild(span1);
  }
  ul0.appendChild(li0);
});
section.appendChild(ul0);`,
  case18: `const section = document.createElement("section");
section.setAttribute("data-component-id", \`case18-\${this.id}\`);

if (this.state.step === 1) {
const div0 = document.createElement("div");
const p0 = document.createElement("p");
p0.textContent = "Paso 1: Información básica";
div0.appendChild(p0);

const button1 = document.createElement("button");
button1.textContent = "Siguiente";
button1.onclick = this.nextStep;
div0.appendChild(button1);
section.appendChild(div0);
}

if (this.state.step === 2) {
const div1 = document.createElement("div");
const p0 = document.createElement("p");
p0.textContent = "Paso 2: Detalles adicionales";
div1.appendChild(p0);

const button1 = document.createElement("button");
button1.textContent = "Finalizar";
button1.onclick = this.nextStep;
div1.appendChild(button1);
section.appendChild(div1);
}

if (this.state.step > 2) {
const div2 = document.createElement("div");
const p0 = document.createElement("p");
p0.textContent = "Formulario completado.";
div2.appendChild(p0);
section.appendChild(div2);
}`,
};
