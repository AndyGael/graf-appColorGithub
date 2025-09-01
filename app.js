// Utilidades
const clamp255 = n => Math.max(0, Math.min(255, n));
const toHex2 = n => clamp255(n).toString(16).toUpperCase().padStart(2, '0');
const rgbToHex = (r, g, b) => `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function idealTextColor(r, g, b) {
  const L = 0.2126 * (r/255) + 0.7152 * (g/255) + 0.0722 * (b/255);
  return L > 0.6 ? '#000000' : '#FFFFFF';
}

// Referencias sliders
const r = document.getElementById('r');
const g = document.getElementById('g');
const b = document.getElementById('b');

// Referencias inputs numéricos
const rInput = document.getElementById('rInput');
const gInput = document.getElementById('gInput');
const bInput = document.getElementById('bInput');

// Color picker
const colorPicker = document.getElementById('colorPicker');

// Otros elementos
const preview = document.getElementById('preview');
const previewRgb = document.getElementById('previewRgb');
const hexInput = document.getElementById('hex');
const copyBtn = document.getElementById('copyHex');
const resetBtn = document.getElementById('resetBtn');
const copiedToast = document.getElementById('copiedToast');

// Actualización del preview
function update() {
  const R = clamp255(parseInt(r.value));
  const G = clamp255(parseInt(g.value));
  const B = clamp255(parseInt(b.value));

  // sincronizar sliders con inputs numéricos
  rInput.value = R;
  gInput.value = G;
  bInput.value = B;

  const hex = rgbToHex(R, G, B);
  hexInput.value = hex;
  colorPicker.value = hex; // actualizar el color picker

  const textColor = idealTextColor(R, G, B);
  preview.style.backgroundColor = `rgb(${R}, ${G}, ${B})`;
  preview.style.color = textColor;
  previewRgb.textContent = `RGB(${R}, ${G}, ${B}) • ${hex}`;
}

// Eventos sliders
[r, g, b].forEach(slider => {
  slider.addEventListener('input', update);
});

// Eventos inputs numéricos
rInput.addEventListener('input', () => { r.value = clamp255(rInput.value); update(); });
gInput.addEventListener('input', () => { g.value = clamp255(gInput.value); update(); });
bInput.addEventListener('input', () => { b.value = clamp255(bInput.value); update(); });

// Evento color picker
colorPicker.addEventListener('input', () => {
  const { r: R, g: G, b: B } = hexToRgb(colorPicker.value);
  r.value = rInput.value = R;
  g.value = gInput.value = G;
  b.value = bInput.value = B;
  update();
});

// Copiar HEX
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(hexInput.value);
    copiedToast.classList.remove('d-none');
    setTimeout(() => copiedToast.classList.add('d-none'), 1200);
  } catch {
    hexInput.select();
    document.execCommand('copy');
  }
});

// Reset
resetBtn.addEventListener('click', () => {
  r.value = g.value = b.value = 128;
  rInput.value = gInput.value = bInput.value = 128;
  colorPicker.value = "#808080";
  update();
});

// Inicializar
update();
