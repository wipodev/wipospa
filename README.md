# wiview

`wiview` is a JavaScript library that allows dynamic loading of HTML components and makes it easy to create routes in web applications. With `wiview`, you can load HTML components asynchronously, manage routes in a simple way, and inject custom elements into the head of your document.

Here is a guide to integrating `wiview` into your project, including how to create components, views, and the use of useful commands for developing, building, previewing, and deploying your application. Below are the steps to create and organize your files, as well as the available commands.

## Commands available in `wiview`

`wiview` includes several commands that facilitate the development and deployment flow of your project:

- `wiview init`: This command initializes a new `wiview` project in the current folder. It creates the basic file and folder structure needed to get started, including the main layout, folders for views and components, and a configuration file to customize the project. It is ideal for quickly setting up the base environment for a project.

- `wiview dev`: Launches a development server that allows you to see changes in real time. Ideal for working interactively on the application.

- `wiview build`: Compiles and minifies JavaScript and CSS files, optimizing them for deployment.

- `wiview preview`: Launches a server with the compiled files to perform a final review before deployment.

- `wiview deploy`: Automatically deploys the project to GitHub Pages. **If you want to deploy to another service, follow the specific instructions for that service for a manual deployment.**

## Installation

To install `wiview` in your project, follow these steps:

### 1. **Set up your project**

Create a new Node.js project if you don't have one already:

```bash
npm init -y
```

### 2. **Install wiview**

```bash
npm install wiview
```

### 3. **Generate a basic project**

Once installed, you can run the `init` command to generate a basic project structure at the root of your directory:

```bash
wiview init
```

## Project Structure

The `wiview init` command will create the following folder and file structure:

```bash
/my-project
├── app/                        # Main folder for the application.
│   ├── components/             # Contains the reusable HTML components.
│   │   ├── Header_Page.html    # Header component template
│   │   └── Footer_Page.html    # Footer component template
│   ├── views/                  # Folder for the main views of the application
│   │   ├── home.html           # Home page view
│   │   └── contact.html        # View of the contact page
│   └── Layout.html             # Main layout of the application, where views and components are integrated
├── assets/                     # Folder for static files, such as images or CSS styles.
│   ├── img/                    # Folder to store images
│   │   └── logo.png            # Application logo
│   └── css/                    # Folder to store custom CSS files
│       └── styles.css          # CSS file for additional styles
├── scripts/                    # Configuration and logic scripts.
│   ├── wiview.js               # wiview main script to load components and views
│   └── wiview.config.js        # Configuration file for wiview.
├── app.js                      # Main JavaScript file for the application logic.
└── index.html                  # Main entry page for your project.

```

## Usage

### 1. **Creating and Using a Layout**

The `layout.html` file acts as the main container for your application. Here you can load components and organize your application's structure.

`Layout.html` example:

```html
<script>
  import { loadComponent } from "/scripts/wiview.js";

  loadComponent({
    component: "/app/components/Header_Page.html",
    selector: "header",
  });

  loadComponent({
    component: "/app/components/Footer_Page.html",
    selector: "body",
    replaceContent: false,
  });
</script>

<header></header>
<main></main>

<style>
  body {
    min-height: 100vh;
  }
</style>
```

### 2. **Creating and Using Views**

A view represents a specific page or section of your application, such as `contact.html`.

Example of `contact.html`:

```html
<script>
  document.querySelector("main > form > input[type=submit]").addEventListener("click", (event) => {
    event.preventDefault();
    const name = document.querySelector("main > form input[name=name]").value;
    const email = document.querySelector("main > form input[name=email]").value;
    const message = document.querySelector("main > form textarea[name=message]").value;
    console.log({ name, email, message });
  });
</script>

<h1>Contacto</h1>

<form>
  <label for="name">
    Nombre:
    <input type="text" id="name" name="name" required />
  </label>
  <label for="email">
    Email:
    <input type="email" id="email" name="email" required />
  </label>
  <label for="message">
    Mensaje:
    <textarea id="message" name="message" required></textarea>
  </label>
  <input type="submit" value="Enviar mensaje" />
</form>

<style>
  h1 {
    margin-top: var(--pico-spacing);
  }
</style>
```

### 3. **Creating and Using Components**

Components are reusable pieces of the user interface that you can load into different views or layouts. Here's an example of a component called `Header_Page.html` that includes a navigation menu and a theme switcher.

`Header_Page.html` example:

```html
<script>
  function toggleTheme() {
    const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  function loadTheme() {
    const theme = localStorage.getItem("theme");
    document.documentElement.setAttribute("data-theme", theme ? theme : "light");
    document.querySelector("body > header nav > a[data-theme-toggle]").addEventListener("click", toggleTheme);
  }

  loadTheme();
</script>

<div class="container">
  <a href="/" aria-label="Ir al inicio">
    <img src="/assets/img/logo.png" alt="Logo" />
    <span>MATIVELLE</span>
  </a>
  <nav>
    <a href="/">Inicio</a>
    <a href="/contact">Contacto</a>
    <a href="#" data-theme-toggle>Modo Oscuro</a>
  </nav>
</div>

<style>
  body > header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: var(--header-bg-color);
  }
</style>
```

## Component Integration

You can embed any component using `wiview`'s `loadComponent` function into any other component, view or layout

```html
<script>
  import { loadComponent } from "/scripts/wiview.js";

  loadComponent({
    component: "/app/components/Header_Page.html",
    selector: "header",
  });
</script>

<header></header>
<main></main>
```

With this configuration, `wiview` loads the components in the specified location and allows a modular structure for application development.

## Contributing

Contributions are welcome. If you encounter any problems or have ideas to improve `wiview`, please open an issue in the GitHub repository.

## License

The code in this project is licensed under the MIT License. - see the [LICENSE](https://github.com/wipodev/wiview/blob/main/LICENCE) file for details.
