import { Suspense } from 'react';
import { getSiteSettings } from '@/lib/siteSettings';

import { DankeContent } from '@/components/danke/DankeContent';

export default async function DankePage() {
  const settings = await getSiteSettings();
  const waNummerClean = settings.whatsapp.replace(/[\s+\-()]/g, '');

  return (
    <Suspense>
      <DankeContent waNummerClean={waNummerClean} />
    </Suspense>
  );
}
