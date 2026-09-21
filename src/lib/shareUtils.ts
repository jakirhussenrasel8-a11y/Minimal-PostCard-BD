/**
 * Social media share utilities for Minimal PostCard BD
 */

export interface ShareData {
  title?: string;
  quote?: string;
  recipient?: string;
  sender?: string;
  templateTitle?: string;
}

export function buildShareText(data: ShareData): string {
  const parts: string[] = [];

  parts.push('💌 Minimal PostCard BD — Vintage Love Postcard');

  if (data.recipient) {
    const r = data.recipient.startsWith('প্রিয়') ? data.recipient : `প্রিয় ${data.recipient}`;
    parts.push(r);
  }

  if (data.quote) {
    const cleanQuote = data.quote.replace(/^“|”$/g, '').trim();
    parts.push(`“${cleanQuote}”`);
  }

  if (data.sender) {
    parts.push(`— ${data.sender}`);
  }

  parts.push('');
  parts.push('✨ আপনিও নিজের প্রেমের অনুভূতি সাজিয়ে নিন ভিন্টেজ পোস্টকার্ডে:');
  parts.push(typeof window !== 'undefined' ? window.location.href : 'https://minimal-postcard-bd.web.app');

  return parts.join('\n');
}

export function getShareUrl(): string {
  return typeof window !== 'undefined' ? window.location.href : 'https://minimal-postcard-bd.web.app';
}

/**
 * Share to WhatsApp
 */
export function shareToWhatsApp(data: ShareData): void {
  const shareText = buildShareText(data);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Share to Facebook
 */
export function shareToFacebook(data: ShareData): void {
  const shareUrl = getShareUrl();
  const quote = data.quote ? `“${data.quote.replace(/^“|”$/g, '').trim()}”` : 'Minimal PostCard BD';
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(quote)}`;
  window.open(fbUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
}

/**
 * Share to Facebook Messenger
 */
export function shareToMessenger(data: ShareData): boolean {
  const shareUrl = getShareUrl();
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    // Try opening Messenger app on mobile
    window.location.href = `fb-messenger://share/?link=${encodeURIComponent(shareUrl)}`;
    return true;
  } else {
    // On desktop, try facebook send dialog or fallback
    const messengerUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(shareUrl)}`;
    const popup = window.open(messengerUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
    if (!popup) {
      return false;
    }
    return true;
  }
}

/**
 * Copy postcard text and link to clipboard
 */
export async function copyPostcardLink(data: ShareData): Promise<boolean> {
  try {
    const text = buildShareText(data);
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

/**
 * Native system share (Mobile & supported desktop browsers)
 */
export async function shareNative(data: ShareData): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: 'Minimal PostCard BD',
        text: data.quote ? `“${data.quote}”` : 'Vintage Love Postcard',
        url: getShareUrl(),
      });
      return true;
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error('Native share failed:', e);
      }
      return false;
    }
  }
  return false;
}
