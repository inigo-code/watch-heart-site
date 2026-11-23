// Watch Heart site: section entrances, the diary tabs, the story maker and the log card.
document.documentElement.classList.add('js');

// Parts of each section rise in once as they come into view.
const revealed = new IntersectionObserver(
  (items) => {
    for (const item of items) {
      if (!item.isIntersecting) continue;
      item.target.classList.add('in');
      revealed.unobserve(item.target);
    }
  },
  { rootMargin: '0px 0px -10% 0px' },
);
document.querySelectorAll('[data-reveal]').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
  revealed.observe(el);
});

/** A row of tabs: one selected at a time; arrow keys move between them. */
function tabs(list, onSelect) {
  const buttons = [...list.querySelectorAll('[role=tab]')];
  const select = (b) => {
    buttons.forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    onSelect(b);
  };
  buttons.forEach((b, i) => {
    b.addEventListener('click', () => select(b));
    b.addEventListener('keydown', (e) => {
      const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      const next = buttons[(i + step + buttons.length) % buttons.length];
      next.focus();
      select(next);
    });
  });
}

// The diary: tickets, poster wall or the Paper look.
const showcaseImg = document.getElementById('showcase-img');
const diaryTabs = document.querySelector('#diary .tabs');
if (showcaseImg && diaryTabs) {
  tabs(diaryTabs, (b) => {
    showcaseImg.style.opacity = '0';
    setTimeout(() => {
      showcaseImg.src = b.dataset.img;
      showcaseImg.alt = b.dataset.alt;
      showcaseImg.onload = () => (showcaseImg.style.opacity = '1');
    }, 180);
  });
}

// The story maker: one layout in all six palettes, exactly as the app renders them.
const layoutTabs = document.getElementById('layout-tabs');
if (layoutTabs) {
  tabs(layoutTabs, (b) => {
    const layout = b.dataset.layout;
    const name = b.textContent.trim();
    document.querySelectorAll('#story-tiles img[data-palette]').forEach((img) => {
      img.style.opacity = '0';
      setTimeout(() => {
        img.src = `assets/stories/${layout}-${img.dataset.palette}.webp`;
        img.alt = `October story, ${name} layout, ${img.dataset.palette} palette`;
        img.onload = () => (img.style.opacity = '1');
      }, 160);
    });
    document.querySelectorAll('#story-tiles .layout-name').forEach((s) => (s.textContent = name));
  });
}

// The log card: type a title, choose a kind, tap the stars.
const input = document.getElementById('log-input');
const nameOut = document.getElementById('log-name');
if (input && nameOut) {
  input.addEventListener('input', () => (nameOut.textContent = input.value.trim() || 'your film'));
}
document.querySelectorAll('#log-card .segmented').forEach((group) => {
  const options = [...group.querySelectorAll('[role=radio]')];
  options.forEach((o) =>
    o.addEventListener('click', () => options.forEach((x) => x.setAttribute('aria-checked', String(x === o)))),
  );
});
const stars = [...document.querySelectorAll('#log-card .stars button')];
const paint = (v) => stars.forEach((s) => s.classList.toggle('on', Number(s.dataset.v) <= v));
stars.forEach((s) =>
  s.addEventListener('click', () => {
    stars.forEach((x) => x.setAttribute('aria-checked', String(x === s)));
    paint(Number(s.dataset.v));
  }),
);
paint(5);
document.getElementById('log-card')?.addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('log-button')?.click();
});
