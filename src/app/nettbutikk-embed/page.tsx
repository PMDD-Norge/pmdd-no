import type { Metadata } from 'next';
import MerchEmbed from '@/components/pages/merch/MerchEmbed';

export const metadata: Metadata = {
  title: 'Merch (embed) | PMDD Norge',
  description: 'Støtt PMDD Norge ved å kjøpe merch fra vår nettbutikk.',
};

export default function Page() {
  return <MerchEmbed />;
}
