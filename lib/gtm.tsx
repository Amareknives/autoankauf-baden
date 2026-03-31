import Script from 'next/script'
import { GTM_ID } from "@/lib/constants"

export function GTMHead() {
  if (!GTM_ID || GTM_ID === 'GTM-XXXXXXX') return null

  return (
    <Script
      id="gtm-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
      }}
    />
  )
}

export function GTMBody() {
  if (!GTM_ID || GTM_ID === 'GTM-XXXXXXX') return null

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}

export function gtmEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  (window as Window & { dataLayer?: unknown[] }).dataLayer =
    (window as Window & { dataLayer?: unknown[] }).dataLayer || [];
  (window as Window & { dataLayer?: unknown[] }).dataLayer!.push({
    event,
    ...data,
  });
}

export const gtmEvents = {
  form_start: (data: { page: string }) => gtmEvent('form_start', data),
  form_step_complete: (data: { step: number; step_name: string }) => gtmEvent('form_step_complete', data),
  form_complete: (data: { marke: string; plz: string; zeitpunkt: string }) => gtmEvent('form_complete', data),
  whatsapp_click: (data: { location: string }) => gtmEvent('whatsapp_click', data),
  phone_click: (data: { location: string }) => gtmEvent('phone_click', data),
  chat_open: () => gtmEvent('chat_open'),
  chat_message_sent: (data: { count: number }) => gtmEvent('chat_message_sent', data),
  haendler_form: () => gtmEvent('haendler_form'),
  haendler_form_complete: (data: { fahrzeugAnzahl: string }) => gtmEvent('haendler_form_complete', data),
  stadtseite_view: (data: { stadt: string }) => gtmEvent('stadtseite_view', data),
}
