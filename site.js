// Watch Heart site: the story maker. One picture; pick its layout and its palette, exactly as the app renders them.
(() => {
  const img = document.getElementById('story-img');
  const name = document.getElementById('story-name');
  const layouts = document.getElementById('layouts');
  const palettes = document.getElementById('palettes');
  if (!img || !layouts || !palettes) return;
  const pick = { layout: 'strip', palette: 'marquee' };
  const label = (group, key) => group.querySelector(`[data-${key}="${pick[key]}"]`);

  const show = () => {
    const layoutName = label(layouts, 'layout').textContent.trim();
    const paletteName = label(palettes, 'palette').getAttribute('aria-label');
    const next = new Image();
    next.src = `assets/stories/${pick.layout}-${pick.palette}.webp`;
    img.classList.add('is-swapping');
    next.decode().catch(() => {}).finally(() => {
      img.src = next.src;
      img.alt = `October as a ${layoutName.toLowerCase()} story in the ${paletteName} palette`;
      name.textContent = `${layoutName}, ${paletteName}`;
      img.classList.remove('is-swapping');
    });
  };

  // A radio group: one choice at a time; the arrow keys move between them.
  const group = (list, key) => {
    const buttons = [...list.querySelectorAll('[role="radio"]')];
    const select = (b, focus) => {
      buttons.forEach((x) => { x.setAttribute('aria-checked', String(x === b)); x.tabIndex = x === b ? 0 : -1; });
      if (focus) b.focus();
      pick[key] = b.dataset[key];
      show();
    };
    buttons.forEach((b, i) => {
      b.tabIndex = i === 0 ? 0 : -1;
      b.addEventListener('click', () => select(b));
      b.addEventListener('keydown', (e) => {
        const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!d) return;
        e.preventDefault();
        select(buttons[(i + d + buttons.length) % buttons.length], true);
      });
    });
  };
  group(layouts, 'layout');
  group(palettes, 'palette');
})();
