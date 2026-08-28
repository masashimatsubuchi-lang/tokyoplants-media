import { HowToData } from "@/lib/howto";

export default function HowToJsonLd({ howTo }: { howTo: HowToData | null }) {
  if (!howTo) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howTo.name,
    step: howTo.steps.map((s) => ({
      "@type": "HowToStep",
      name: s.name,
      text: s.text,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
