const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function noise(canvas, w, h) {
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(w, h);
  return () => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  };
}

const drawGrain = noise(document.getElementById('grain'), 200, 150);
const staticEl = document.getElementById('static');
const drawStatic = noise(staticEl, 480, 360);

if (reduced) {
  drawGrain();
} else {
  setInterval(drawGrain, 70);
}

let staticTimer;
function burst(ms = 350) {
  if (reduced) return;
  clearInterval(staticTimer);
  staticEl.classList.add('on');
  staticTimer = setInterval(drawStatic, 40);
  setTimeout(() => {
    clearInterval(staticTimer);
    staticEl.classList.remove('on');
  }, ms);
}

const pages = document.querySelectorAll('.page');
const links = document.querySelectorAll('[data-page]');
const content = document.getElementById('content');

function show(id, withStatic) {
  if (!document.getElementById(id)) id = 'home';
  if (withStatic) burst();
  pages.forEach(p => p.classList.toggle('active', p.id === id));
  links.forEach(a => a.classList.toggle('active', a.dataset.page === id));
  content.scrollTop = 0;
}

links.forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  const id = a.dataset.page;
  history.replaceState(null, '', '#' + id);
  show(id, true);
}));

show(location.hash.slice(1) || 'home', false);
addEventListener('load', () => { content.scrollTop = 0; });
setTimeout(() => burst(600), 700);
