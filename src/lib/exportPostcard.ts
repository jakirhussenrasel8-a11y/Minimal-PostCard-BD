import { toPng, toJpeg } from 'html-to-image';
import html2canvas from 'html2canvas';

export interface ExportOptions {
  format: 'png' | 'jpg';
  quality?: number;
  filename?: string;
  pixelRatio?: number;
}

/**
 * Exports a DOM node (the postcard card only) as high-definition PNG or JPG
 */
export async function exportPostcardNode(
  node: HTMLElement,
  options: ExportOptions = { format: 'png', quality: 0.95, pixelRatio: 2.5 }
): Promise<boolean> {
  const { format = 'png', quality = 0.95, filename = 'MinimalPostCardBD', pixelRatio = 2.5 } = options;
  const extension = format === 'jpg' ? 'jpg' : 'png';
  const cleanFilename = `${filename.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.${extension}`;

  try {
    let dataUrl: string | null = null;

    // Primary: html-to-image (preserves sharp vectors & web fonts)
    const exportFilter = (domNode: HTMLElement) => {
      if (!domNode) return true;
      if (domNode.classList && domNode.classList.contains('no-export')) return false;
      if (domNode.getAttribute && (domNode.getAttribute('data-no-export') === 'true' || domNode.getAttribute('data-html2canvas-ignore') === 'true')) return false;
      return true;
    };

    try {
      if (format === 'jpg') {
        dataUrl = await toJpeg(node, {
          quality,
          pixelRatio,
          cacheBust: true,
          backgroundColor: '#161311',
          filter: exportFilter,
        });
      } else {
        dataUrl = await toPng(node, {
          pixelRatio,
          cacheBust: true,
          filter: exportFilter,
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

    // Trigger download
    const link = document.createElement('a');
    link.download = cleanFilename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Error exporting postcard:', error);
    throw error;
  }
}
