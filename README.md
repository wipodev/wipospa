<div align="center">
  <img src="https://raw.githubusercontent.com/wipodev/wivex/196dc75c180f8bddd09d4c085070b6213efb2ae0/template/assets/img/logo.svg" alt="wivex logo"/>
</div>

# W I V E X

`wivex` is a JavaScript library that allows dynamic loading of HTML components and makes it easy to create routes in web applications. With `wivex`, you can load HTML components, easily manage routes, and inject custom elements into the header of your document, `wivex` uses the power of `Vite` for the build and development process of your application, and `gh-pages` for the deployment of your project on github pages.

Below is a guide to integrating `wivex` into your project, including how to create components, views, and using useful commands to develop, build, preview, and deploy your application. Below are the steps to create and organize your files, as well as the available commands.

## Commands available in `wivex`

`wivex` includes several commands that facilitate the development and deployment flow of your project:

- `wivex init`: This command initializes a new `wivex` project in the current folder. It creates the basic file and folder structure needed to get started, including the main layout, folders for views and components, and a configuration file to customize the project. It is ideal for quickly setting up the base environment for a project.

- `wivex dev`: Launches a development server that allows you to see changes in real time. Ideal for working interactively on the application.

- `wivex build`: Compiles and minifies JavaScript and CSS files, optimizing them for deployment.

- `wivex preview`: Launches a server with the compiled files to perform a final review before deployment.

- `wivex deploy`: Automatically deploys the project to GitHub Pages. **If you want to deploy to another service, follow the specific instructions for that service for a manual deployment.**

## Installation

To install `wivex` in your project, follow these steps:

### 1. **Set up your project**

Create a new Node.js project if you don't have one already:

```bash
npm init -y
```

### 2. **Install wivex**

```bash
npm install wivex
```

### 3. **Generate a basic project**

Once installed, you can run the `init` command to generate a basic project structure at the root of your directory:

```bash
wivex init
```

## Project Structure

The `wivex init` command will create the following folder and file structure:

```bash
/my-project
├── public/                         # Folder for static files, such as images or CSS styles.
│   └── assets/
│       └── img/
│           └── logo.png
├── src/                            # Main development folder.
│   ├── app/                        # Main folder for the application.
│   │   ├── components/             # Contains the reusable HTML components.
│   │   │   ├── Header_Page.html
│   │   │   └── Footer_Page.html
│   │   ├── views/                  # Folder for the main views of the application
│   │   │   ├── home.html
│   │   │   └── contact.html
│   │   └── Layout.html             # Main layout of the application, where views and components are integrated
│   ├── assets/                     # Folder for CSS or SVG style files that will be processed
│   │   └── css/
│   │       └── styles.css
│   ├── config/                     # Folder for application configuration files
│   │   ├── defineComponents.js/    # Configuration file to define the project components.
│   │   └── defineRoutes.js/        # Configuration file to define the project paths.
│   └── app.js                      # Application entry point
├── .gitignore
├── index.html                      # Main entry page for your project.
└── wivex.config.js                # Configuration file for wivex.

```

## Usage

### 1. **Creating and Using a Layout**

The `layout.html` file acts as the main container for your application. Here you can load components and organize your application's structure.

`Layout.html` example:

```html
<HeaderPage></HeaderPage>

<main class="container"></main>

<FooterPage></FooterPage>

<style>
  body {
    display: grid;
    min-height: 100dvh;
    grid-template-rows: auto 1fr auto;
  }

  @media (max-width: 768px) {
    .container {
      max-width: 100%;
      padding-inline: 0;
    }
  }

  @media (min-width: 1536px) {
    .container {
      max-width: 1200px;
    }
  }
</style>
```

### 2. **Creating and Using Views**

A view represents a specific page or section of your application, such as `home.html`.

Example of `home.html`:

```html
<wivex:head>
  <title>wivex - JavaScript library for dynamic loading of HTML components</title>
  <meta
    name="description"
    content="wivex is a JavaScript library that allows dynamic loading of HTML components and makes it easy to create routes in web applications. With wivex, you can load HTML components asynchronously, manage routes in a simple way, and inject custom elements into the head of your document."
  />
</wivex:head>

<section>
  <img src="/assets/img/logo.svg" alt="logo" />
  <h1>Welcome to Your <TitleLib></TitleLib> App</h1>
  <p>
    With <strong>wivex</strong>, you can load HTML components asynchronously, manage routes in a simple way, and inject
    custom elements into the head of your document.
  </p>
  <p>
    For a basic guide on how to use <strong>wivex</strong>, see the
    <a href="https://github.com/wipodev/wivex">readme</a> on github.
  </p>
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
```

### 3. **Creating and Using Components**

Components are reusable pieces of the user interface that you can load into different views or layouts. Here's an example of a component called `Header_Page.html` that includes a navigation menu and a theme switcher.

`Header_Page.html` example:

```html
<script>
  import { getState, updateState } from "wivex";

  document.querySelector("[data-btn-menu]").addEventListener("click", () => {
    const state = getState("HeaderPage");
    updateState("HeaderPage", { menu: state.menu === "open" ? "" : "open" });
  });

  document.querySelector(".menu").addEventListener("click", () => {
    const state = getState("HeaderPage");
    updateState("HeaderPage", { menu: "" });
  });
</script>

<header>
  <div class="container">
    <a href="/" aria-label="Go to the beginning">
      <img src="/assets/img/logo.png" alt="Logo" />
      <TitleLib></TitleLib>
    </a>
    <nav>
      <button aria-label="Open menu" class="btn" data-btn-menu><i class="wi wi-bars"></i></button>
      <div class="menu {menu}">
        <a href="/" aria-label="Go to the beginning">Inicio</a>
        <a href="/about" aria-label="Go to Contact">About</a>
        <DarkToggle></DarkToggle>
      </div>
    </nav>
  </div>
</header>

<style>
  body > header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: var(--header-bg-color);
  }
   {
    ....;
  }
</style>
```

## They are all components

In wivex everything can be a component and you can integrate any component into any other component, view or layout.

### child component:

```html
<!--DarkToggle-->
<script>
  import { getState, updateState } from "wivex";

  function toggleTheme() {
    updateState("DarkToggle", { theme: state.theme === "sun" ? "moon" : "sun" });
  }

  document.querySelector("[data-theme-toggle]").addEventListener("click", toggleTheme);
</script>
<button aria-label="Turn dark mode on or off" class="btn" data-theme-toggle>
  <i class="wi wi-{theme}"></i>
  <span>Dark Mode</span>
</button>
```

### parent component:

```html
<!--HeaderPage-->
<header>
  <div class="container">
    <nav>
      <a href="/" aria-label="Go to the beginning">Inicio</a>
      <a href="/about" aria-label="Go to Contact">About</a>
      <DarkToggle></DarkToggle>
      <!--way to insert a component-->
    </nav>
  </div>
</header>
```

## component styles

Styles are global by default, meaning they can affect any other component. If you want to change this behavior so that the styles only affect the component you are creating, you must place the "escoped" attribute in the style tag of the component.

```css
<style scoped>
  footer {
    background-color: var(--pico-background-color);
    padding: 0 0 1rem;
    text-align: center;

    hr {
      margin-block: 0 0.5rem;
    }
  }
</style>
```

## Contributing

Contributions are welcome. If you encounter any problems or have ideas to improve `wivex`, please open an issue in the GitHub repository.

## Icons Attribution

The icons used in this project include both icons from [Font Awesome](https://fontawesome.com) and original icons created specifically for this project. All icons are licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). Appropriate credit should be given as specified in the license.

## License

### Code License

The code in this project is licensed under the MIT License. - see the [LICENSE](https://github.com/wipodev/wivex/blob/main/LICENCE) file for details.

### Icons License

The icons provided in this project are licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

You are free to:

- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material for any purpose, even commercially.

Under the following terms:

- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.

### Logo Usage Restriction

The `wivex` logo is proprietary and created solely for representing this project. It is not covered by the Creative Commons license and may not be used, modified, or distributed outside of this project or for any other purposes without explicit permission.
