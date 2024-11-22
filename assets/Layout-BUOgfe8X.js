(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const t of a)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function o(a){const t={};return a.integrity&&(t.integrity=a.integrity),a.referrerPolicy&&(t.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?t.credentials="include":a.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(a){if(a.ep)return;a.ep=!0;const t=o(a);fetch(a.href,t)}})();const g=(e,n)=>{for(const o in n)if(n.hasOwnProperty(o)){const r=new RegExp(`{${o}}`,"gi");e=e.replace(r,a=>n[o])}return e},T=e=>{const n=new DOMParser;let o=n.parseFromString(e,"text/html"),r=!0;for(;r;){r=!1;const a=L();Object.keys(a).forEach(t=>{o.querySelectorAll(t).forEach((s,y)=>{const v=`${t}-${y}`,u={};Array.from(s.attributes).forEach(p=>{u[p.name]=p.value});let E=g(b(t),{...u,...l(t)});const c=n.parseFromString(E,"text/html");c.querySelector(Object.keys(a).join(","))&&(r=!0),c.body.firstElementChild.setAttribute("data-component-id",v),s.outerHTML=c.body.innerHTML})}),o=n.parseFromString(o.body.innerHTML,"text/html")}return o.body.innerHTML},h=(e,n)=>{if(!(!e||!n)){if(e.nodeType===Node.TEXT_NODE&&e.textContent!==n.textContent)e.textContent=n.textContent;else if(e.nodeType===Node.ELEMENT_NODE&&e.tagName!==n.tagName)e.replaceWith(n.cloneNode(!0));else if(e.nodeType===Node.ELEMENT_NODE){Array.from(n.attributes).forEach(t=>{e.getAttribute(t.name)!==t.value&&e.setAttribute(t.name,t.value)});const o=Array.from(e.childNodes),r=Array.from(n.childNodes),a=Math.max(o.length,r.length);for(let t=0;t<a;t++)r[t]&&!o[t]?e.appendChild(r[t].cloneNode(!0)):o[t]&&!r[t]?e.removeChild(o[t]):h(o[t],r[t])}}},w=(e,n=document.querySelector(`[data-component-id^="${e}"]`))=>{const o=b(e),r=l(e);if(o&&r){const a=T(o),t=g(a,r),s=new DOMParser().parseFromString(t,"text/html");s.body.firstElementChild.setAttribute("data-component-id",n.getAttribute("data-component-id")),h(n,s.body.firstElementChild)}},f={TitleLib:`<span data-title-lib="">
  <span class="large-print">W</span>
  <span>I</span>
  <span class="large-print">V</span>
  <span>I</span>
  <span>E</span>
  <span>W</span>
</span>

`,DarkToggle:`<html><head>

</head><body><button aria-label="Turn dark mode on or off" class="btn" data-theme-toggle="">
  <i class="wi wi-{theme}"></i>
  <span>Dark Mode</span>
</button></body></html>`,HeaderPage:`<header>
  <div class="container">
    <a href="/" aria-label="Go to the beginning">
      <img src="/assets/img/logo.png" alt="Logo">
      <titlelib></titlelib>
    </a>
    <nav>
      <button aria-label="Open menu" class="btn" data-btn-menu=""><i class="wi wi-bars"></i></button>
      <div class="menu {menu}">
        <a href="/" aria-label="Go to the beginning">Inicio</a>
        <a href="/about" aria-label="Go to Contact">About</a>
        <darktoggle></darktoggle>
      </div>
    </nav>
  </div>
</header>

`,FooterPage:`<footer id="footerpage" class="container">
  <hr>
  <small>
    <a href="/terms" aria-label="Go to the Terms">Terms and Conditions</a> |
    <a href="https://github.com/wipodev/wiview/blob/main/LICENSE" aria-label="Go to License">License</a>
  </small><br>
  <small class="container">
    Copyright © 2024-present WIVIEW. |
    Powered by <a href="https://wipodev.com" target="_blank">WipoDev</a>.
  </small>
<style>@scope { 
  :scope {
    background-color: var(--pico-background-color);
    padding: 0 0 1rem;
    text-align: center;

    hr {
      margin-block: 0 0.5rem;
    }
  }
 }</style></footer>

`,Layout:`<headerpage></headerpage>

<main class="container"></main>

<footerpage></footerpage>

`,Home:`

<section>
  <img src="/assets/img/logo.svg" alt="logo">
  <h1>Welcome to Your <titlelib></titlelib> App</h1>
  <p>With <strong>wiview</strong>, you can load HTML components asynchronously, manage routes in a simple way, and
    inject custom elements
    into the head of your document.</p>
  <p>For a basic guide on how to use <strong>wiview</strong>, see the <a href="https://github.com/wipodev/wiview">readme</a> on github.
  </p>
</section>

`,About:`<html><head></head><body>

<article>
  <header>
    <h2>About WiView</h2>
  </header>
  <p><strong>WiView</strong> is a JavaScript library designed for dynamic loading of HTML components and simplified
    route
    management in web applications. With <strong>WiView</strong>, you can load HTML components asynchronously, enabling
    a
    faster and more optimized user experience. The library also makes it easy to create routes and customize elements in
    the document's <code>&lt;head&gt;</code>, helping you build more dynamic and organized web applications.</p>

  <h3>Main Features:</h3>
  <ul>
    <li><strong>Asynchronous HTML Component Loading:</strong> Renders specific content only when needed, improving
      application performance.</li>
    <li><strong>Simple Route Management:</strong> Easily define and organize routes for efficient navigation.</li>
    <li><strong>Custom Head Element Injection:</strong> Add and manage custom tags in the document’s
      <code>&lt;head&gt;</code>, useful for SEO and metadata configuration.
    </li>
  </ul>

  <footer>
    <p>For a quick start guide and usage examples, visit our <a href="https://github.com/wipodev/wiview">GitHub
        repository</a>.</p>
  </footer>
</article></body></html>`},m={DarkToggle:{theme:"sun"},HeaderPage:{menu:""}},b=e=>f[e],L=()=>({...f}),d=(e,n)=>{m[e]?(Object.assign(m[e],n),w(e)):console.error(`State for component "${e}" not found.`)},l=e=>m[e];document.addEventListener("DOMContentLoaded",()=>{document.querySelector("[data-btn-menu]").addEventListener("click",()=>{const e=l("HeaderPage");d("HeaderPage",{menu:e.menu==="open"?"":"open"})}),document.querySelector(".menu").addEventListener("click",()=>{l("HeaderPage"),d("HeaderPage",{menu:""})}),(()=>{function e(){const o=l("DarkToggle");d("DarkToggle",{theme:o.theme==="sun"?"moon":"sun"});const r=o.theme==="sun"?"dark":"light";document.documentElement.setAttribute("data-theme",r),localStorage.setItem("theme",r)}function n(){const o=localStorage.getItem("theme");document.documentElement.setAttribute("data-theme",o||"light"),document.querySelector("[data-theme-toggle]").addEventListener("click",e)}n()})()});
