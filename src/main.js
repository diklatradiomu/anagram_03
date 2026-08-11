import sourceHtml from '../assets/asset?raw';

function mountUploadedPage() {
  const app = document.querySelector('#app');

  try {
    const parsed = new DOMParser().parseFromString(sourceHtml, 'text/html');

    document.title = parsed.title || document.title;
    document.documentElement.lang = parsed.documentElement.lang || 'id';

    parsed.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
      document.head.appendChild(node.cloneNode(true));
    });

    app.replaceChildren(...Array.from(parsed.body.childNodes).map((node) => node.cloneNode(true)));

    // HTML inserted with innerHTML does not execute inline scripts. Recreate each
    // script node so the original game's behavior starts after the DOM is ready.
    parsed.body.querySelectorAll('script').forEach((sourceScript) => {
      const script = document.createElement('script');
      Array.from(sourceScript.attributes).forEach((attribute) => {
        script.setAttribute(attribute.name, attribute.value);
      });
      script.textContent = sourceScript.textContent;
      document.body.appendChild(script);
    });
  } catch (error) {
    console.error(error);
    app.innerHTML = `
      <main style="font-family:system-ui,sans-serif;max-width:560px;margin:3rem auto;padding:1.5rem">
        <h1>Game Anagram tidak dapat dimuat</h1>
        <p>${error.message}</p>
      </main>
    `;
  }
}

mountUploadedPage();
