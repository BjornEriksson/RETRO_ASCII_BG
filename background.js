/* =========================================================================
   PROJECT:     RETRO_ASCII_BG
   AUTHOR:      BjornEriksson / Björn Eriksson
   LICENSE:     MIT License
   DESCRIPTION: A lightweight, high-performance background animation written 
                in pure vanilla JavaScript using HTML5 Canvas. It simulates 
                a retro computing environment with glowing violet ASCII 
                characters moving programmatically inside a grid layout.
   ========================================================================= */

(function() {
  const bgChars = ['0', '1', '#', '$', '%', '&', '*', '+', '-', '/', '=', '?', '@', '[', ']'];
  const cellSize = 22;
  let cols = 0;
  let rows = 0;
  let particles = [];
  let canvas, ctx;

  function initAsciiBg() {
    // Check for existing canvas, create one if missing
    canvas = document.getElementById('ascii-bg');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'ascii-bg';
      document.body.insertBefore(canvas, document.body.firstChild);
      
      // Inject fallback CSS styles to anchor the canvas behind everything
      const style = document.createElement('style');
      style.innerHTML = `
        #ascii-bg {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          z-index: 0;
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);
    }
    
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / cellSize);
    rows = Math.floor(canvas.height / cellSize);

    // Initialize particle grid network (approx. 8% screen coverage)
    const count = Math.floor((cols * rows) * 0.08);
    particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
        char: bgChars[Math.floor(Math.random() * bgChars.length)],
        dir: Math.floor(Math.random() * 4), // 0:Up, 1:Right, 2:Down, 3:Left
        stepsLeft: Math.floor(Math.random() * 8) + 3
      });
    }

    // Force single active clock cycle interval
    clearInterval(window.asciiInterval);
    window.asciiInterval = setInterval(stepAsciiBg, 220);
  }

  function resetCanvasSize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / cellSize);
    rows = Math.floor(canvas.height / cellSize);
  }

  function stepAsciiBg() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '14px "Courier New", Courier, monospace';
    
    // Theme setup: Dark cyber-violet phosphor tone
    ctx.fillStyle = '#4a154b'; 

    particles.forEach(p => {
      ctx.fillText(p.char, p.x * cellSize, p.y * cellSize);

      // Random grid progression (35% change of taking a step per tick)
      if (Math.random() > 0.35) {
        if (p.dir === 0) p.y = (p.y - 1 + rows) % rows;
        if (p.dir === 1) p.x = (p.x + 1) % cols;
        if (p.dir === 2) p.y = (p.y + 1) % rows;
        if (p.dir === 3) p.x = (p.x - 1 + cols) % cols;

        p.stepsLeft--;

        // Recalculate vector routing and change glyph when steps deplete
        if (p.stepsLeft <= 0) {
          p.dir = Math.floor(Math.random() * 4);
          p.stepsLeft = Math.floor(Math.random() * 10) + 4;
          p.char = bgChars[Math.floor(Math.random() * bgChars.length)];
        }
      }
    });
  }

  // Trigger grid initiation once the host interface layout is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAsciiBg);
  } else {
    initAsciiBg();
  }
  
  window.addEventListener('resize', resetCanvasSize);
})();
