import { useEffect } from 'react';

type PageMetaProps = {
  title: string;
  description?: string;
};

export default function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    document.title = `${title} | Multiplayer Mini Games Platform`;

    if (!description) return;

    const selector = 'meta[name="description"]';
    let meta = document.querySelector(selector) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [title, description]);

  return null;
}
