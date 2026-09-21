import { toPng, toJpeg } from 'html-to-image';
import html2canvas from 'html2canvas';

export interface ExportOptions {
  format: 'png' | 'jpg';
  quality?: number;
  filename?: string;
  pixelRatio?: number;
}

export interface ExportResult {
  success: boolean;
  dataUrl: string;
  filename: string;
  blob?: Blob;
}

/**
 * Generates dataUrl & blob for postcard node without forcing immediate download trigger
 */
export async function generatePostcardDataUrl(
  node: HTMLElement,
  options: ExportOptions = { format: 'png', quality: 0.95, pixelRatio: 2.5 }
): Promise<ExportResult> {
  const { format = 'png', quality = 0.95, filename = 'MinimalPostCardBD', pixelRatio = 2.5 } = options;
  const extension = format === 'jpg' ? 'jpg' : 'png';
  const cleanFilename = `${filename.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.${extension}`;

  // Ensure all web fonts are fully loaded before capturing
  if (typeof document !== 'undefined' && document.fonts && typeof document.fonts.ready?.then === 'function') {
    try {
      await document.fonts.ready;
    } catch {
      // Continue if fonts.ready fails
    }
  }

  const exportFilter = (domNode: HTMLElement) => {
    if (!domNode) return true;
    if (domNode.classList && domNode.classList.contains('no-export')) return false;
    if (domNode.getAttribute && (domNode.getAttribute('data-no-export') === 'true' || domNode.getAttribute('data-html2canvas-ignore') === 'true')) return false;
    return true;
  };

  let dataUrl: string | null = null;
  let blob: Blob | undefined;

  // We set skipFonts: true because Google Fonts are already fully loaded and rendered on the DOM
  // (and document.fonts.ready has resolved).
  // When skipFonts is false, html-to-image attempts to inspect cross-origin <link> stylesheet cssRules,
  // throwing: "Failed to read the 'cssRules' property from 'CSSStyleSheet': Cannot access rules".
  const htmlToImageOptions = {
    quality,
    pixelRatio,
    cacheBust: false,
    skipFonts: true,
    filter: exportFilter,
  };

  try {
    if (format === 'jpg') {
      dataUrl = await toJpeg(node, {
        ...htmlToImageOptions,
        backgroundColor: '#161311',
      });
    } else {
      dataUrl = await toPng(node, {
        ...htmlToImageOptions,
      });
    }
  } catch (primaryErr) {
    console.warn('html-to-image export warning, falling back to html2canvas:', primaryErr);
    // Fallback: html2canvas
    const canvas = await html2canvas(node, {
      scale: pixelRatio,
      useCORS: true,
      backgroundColor: null,
      logging: false,
      ignoreElements: (element) =>
        element.classList?.contains('no-export') ||
        element.getAttribute('data-no-export') === 'true' ||
        element.getAttribute('data-html2canvas-ignore') === 'true',
    });
    dataUrl = canvas.toDataURL(format === 'jpg' ? 'image/jpeg' : 'image/png', quality);
  }

  if (!dataUrl) {
    throw new Error('Failed to generate image data');
  }

  try {
    const res = await fetch(dataUrl);
    blob = await res.blob();
  } catch (bErr) {
    console.warn('Could not parse blob from dataUrl:', bErr);
  }

  return {
    success: true,
    dataUrl,
    filename: cleanFilename,
    blob,
  };
}

/**
 * Exports a DOM node (the postcard card only) as high-definition PNG or JPG
 */
export async function exportPostcardNode(
  node: HTMLElement,
  options: ExportOptions = { format: 'png', quality: 0.95, pixelRatio: 2.5 }
): Promise<ExportResult> {
  try {
    const result = await generatePostcardDataUrl(node, options);

    // Trigger download via anchor tag
    try {
      const link = document.createElement('a');
      link.download = result.filename;
      link.href = result.dataUrl;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (clickErr) {
      console.warn('Anchor download click warning:', clickErr);
    }

    return result;
  } catch (error) {
    console.error('Error exporting postcard:', error);
    throw error;
  }
}
