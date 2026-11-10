// Bootstrap 5 bundle is loaded from CDN in __root; access its JS API safely.
export function bs(): any { return typeof window !== "undefined" ? (window as any).bootstrap : undefined; }
export function hideModal(el: HTMLElement | null) { if (el) bs()?.Modal.getInstance(el)?.hide(); }
export function showModal(el: HTMLElement | null) { if (el) bs()?.Modal.getOrCreateInstance(el).show(); }
