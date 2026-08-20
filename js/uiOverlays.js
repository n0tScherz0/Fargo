/**
 * FARGO — FORENSIC CANVAS FILTERS & VIEWPORT OVERLAYS
 * Live client-side visual inspection tools
 * Dead Internet Theory
 */

class FargoViewportFilters {
  /**
   * Apply selected forensic filter onto destination canvas
   * @param {HTMLImageElement} sourceImg 
   * @param {HTMLCanvasElement} canvas 
   * @param {string} filterType 'original' | 'edge' | 'ela' | 'heatmap'
   */
  static renderFilter(sourceImg, canvas, filterType = 'original') {
    if (!sourceImg || !canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = sourceImg.naturalWidth || 600;
    canvas.height = sourceImg.naturalHeight || 400;

    // Draw base
    ctx.drawImage(sourceImg, 0, 0, canvas.width, canvas.height);

    if (filterType === 'original') {
      return;
    }

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const width = canvas.width;
    const height = canvas.height;

    if (filterType === 'edge') {
      // High-pass Laplacian edge detection filter
      const copy = new Uint8ClampedArray(data);
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4;
          
          // Sample grayscale around pixel
          const c = (copy[idx] + copy[idx+1] + copy[idx+2]) / 3;
          const top = (copy[((y-1)*width + x)*4] + copy[((y-1)*width + x)*4+1] + copy[((y-1)*width + x)*4+2]) / 3;
          const bottom = (copy[((y+1)*width + x)*4] + copy[((y+1)*width + x)*4+1] + copy[((y+1)*width + x)*4+2]) / 3;
          const left = (copy[(y*width + (x-1))*4] + copy[(y*width + (x-1))*4+1] + copy[(y*width + (x-1))*4+2]) / 3;
          const right = (copy[(y*width + (x+1))*4] + copy[(y*width + (x+1))*4+1] + copy[(y*width + (x+1))*4+2]) / 3;
          
          let edgeVal = Math.abs(4 * c - top - bottom - left - right) * 3.5;
          if (edgeVal > 255) edgeVal = 255;

          // Render in forensic cyan edge aesthetic
          data[idx] = 0;                          // R
          data[idx + 1] = Math.min(255, edgeVal * 1.2); // G
          data[idx + 2] = edgeVal;                // B
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }
    else if (filterType === 'ela') {
      // Error Level Analysis (ELA) Simulation (Amplified compression residuals)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];

        // High frequency quantization artifact amplification
        const noise = (Math.sin(r * 0.25) + Math.cos(g * 0.25) + Math.sin(b * 0.25)) * 18;
        const diffR = Math.min(255, Math.abs(r - (r & 0xF8)) * 14 + noise);
        const diffG = Math.min(255, Math.abs(g - (g & 0xF8)) * 14 + noise);
        const diffB = Math.min(255, Math.abs(b - (b & 0xF8)) * 14 + noise);

        data[i] = diffR;
        data[i + 1] = diffG;
        data[i + 2] = diffB;
        data[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);
    }
    else if (filterType === 'heatmap') {
      // Forensic Luminance Noise Heatmap (Thermal / Spectral palette)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // Thermal color map (Blue -> Cyan -> Yellow -> Red)
        let tr, tg, tb;
        if (lum < 0.25) {
          tr = 0;
          tg = Math.round(lum * 4 * 200);
          tb = 255;
        } else if (lum < 0.5) {
          tr = 0;
          tg = 255;
          tb = Math.round((1 - (lum - 0.25) * 4) * 255);
        } else if (lum < 0.75) {
          tr = Math.round((lum - 0.5) * 4 * 255);
          tg = 255;
          tb = 0;
        } else {
          tr = 255;
          tg = Math.round((1 - (lum - 0.75) * 4) * 255);
          tb = 0;
        }

        data[i] = tr;
        data[i + 1] = tg;
        data[i + 2] = tb;
        data[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);
    }
  }
}
