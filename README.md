<div align="center">
  <img src="https://raw.githubusercontent.com/wipodev/wivex/196dc75c180f8bddd09d4c085070b6213efb2ae0/template/assets/img/logo.svg" alt="wivex logo"/>
</div>

# W I V E X

`wivex` is a lightweight JavaScript library designed for fast and efficient development of dynamic web applications. With `wivex`, you can:

- Dynamically load and reuse HTML components.

- Easily configure and manage client-side routes.

- Seamlessly integrate custom meta tags or scripts into your document's `<head>`.

- Leverage the power of `Vite` for blazing-fast builds and development.

- Deploy to GitHub Pages with a single command.

## Commands available in `wivex`

`wivex` includes several commands that facilitate the development and deployment flow of your project:

- `wivex init`: Initialize a new `wivex` project with a pre-configured structure.

- `wivex dev`: Start a live development server for real-time updates.

- `wivex build`: Compile and optimize the project for production.

- `wivex preview`: Preview the built project locally before deploying.

- `wivex deploy`: Deploy the project to GitHub Pages.

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
│   │   │   ├── Home.html
│   │   │   └── About.html
│   │   └── Layout.html             # Main layout of the application, where views and components are integrated
│   ├── assets/                     # Folder for CSS or SVG style files that will be processed
│   │   └── css/
│   │       └── styles.css
│   ├── config/                     # Folder for application configuration files
│   │   └── defineRoutes.js         # Configuration file to define the project paths.
│   └── app.js                      # Application entry point
├── .gitignore
├── index.html                      # Main entry page for your project.
└── wivex.config.js                 # Configuration file for wivex.

```

## Component Structure in Wivex

In Wivex, a component is an `.html` file that follows specific rules to function correctly. Below is a detailed explanation of these rules and how to structure a component:

### Component Sections

A component can include the following sections:

1. `script` (Optional): Contains the component's logic.

2. `style` (Optional): Defines the component's styles.

3. `wivex:head` (Optional): Includes meta information for the `<head>` of the document.

4. `HTML Structure` (Required): Defines the visual content of the component.

### General Rules

1. Single root element: The HTML structure must be wrapped in a single root element. Multiple root elements will result in an error.

2. File extension: The component file must have the `.html` extension.

### Rules by Section

#### 1. `script`

- Structure: Must be enclosed in `<script></script>` tags.

- Variables:

  - `let`: Declared at the root of the script, they are treated as reactive states within the component.

  - `var`: Declared at the root of the script, they are treated as properties that can be passed via HTML attributes.

- Functions: Declared at the root of the script, they are treated as reactive methods of the component.

- Lifecycle Hooks: To run code before or after the component is mounted, export an object with the following structure:

```html
<script>
  export default {
    beforeMount() {
      // Code to execute before mounting
      console.log("Preparing to mount the component.");
    },
    mount() {
      // Code to execute after mounting
      console.log("Component has been mounted.");
    },
  };
</script>
```

#### 2. `style`

- Structure: Must be enclosed in `<style></style>` tags.

- CSS Support: Only standard CSS is supported.

- Scoped Styles: Add the `scoped` attribute to apply styles only to the component.

```html
<style scoped>
  section {
    max-width: 1200px;
  }
</style>
```

#### 3. `wivex:head`

- Structure: Must be enclosed in `<wivex:head></wivex:head>` tags.

- Purpose: Includes meta information such as the page title or meta tags for the `<head>` section.

```html
<wivex:head>
  <title>Component Title</title>
</wivex:head>
```

#### 4. HTML Structure

- Single Root Element: The HTML structure must be wrapped in one root element, such as `<div>` or `<section>`.

- Directives: Wivex provides several built-in directives to simplify web application development:

  - `data-if`: Conditionally displays an element based on a condition.

  ```html
  <p data-if="count > 0">Count: {count}</p>
  ```

  - `data-for`: Loops through arrays to generate elements.

  ```html
  <li data-for="item in items">{item}</li>
  ```

  - `on*`: Binds an event to a function.

  ```html
  <button onclick="increment()">Click me</button>
  ```

- Nested Components: You can import and use components within other components

```html
<script>
  import ChildComponent from "./Child.html";
</script>

<ChildComponent />
```

### Component Example

```html
<script>
  import Child from "./Child.html";
  var title = "Parent Component";
  let count = 0;

  function increment() {
    count++;
    console.log(count);
  }
</script>

<wivex:head>
  <title>Parent Component</title>
</wivex:head>

<section>
  <h1>{title}</h1>
  <button onclick="increment()">Increment</button>
  <p data-if="count > 0">Count: {count}</p>
  <Child data-for="name in ['Alice', 'Bob']" title="{name}" />
</section>

<style scoped>
  section {
    max-width: 800px;
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
