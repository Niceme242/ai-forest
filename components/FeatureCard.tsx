import { motion } from 'framer-motion';

type FeatureCardProps = {
  title: string;
  description: string;
  accent: string;
  icon?: string;
  image?: string;
};

export function FeatureCard({ title, description, accent, image }: FeatureCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="group bg-white rounded-3xl border border-green-100 p-6 shadow-sm hover:shadow-xl hover:shadow-green-100/60 hover:border-green-200 transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      {image && (
        <div className="relative h-44 w-full overflow-hidden rounded-2xl mb-5">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Strong overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-950/75 via-green-900/30 to-transparent" />
        </div>
      )}

      {!image && (
        <div className="mb-5 h-1.5 w-14 rounded-full bg-green-500 shadow-sm shadow-green-500/20" />
      )}

      <p className="text-xs font-semibold uppercase tracking-[0.30em] text-green-600 mb-3">{accent}</p>
      <h3 className="text-xl font-semibold text-gray-900 leading-snug">{title}</h3>
      <p className="mt-3 text-gray-600 leading-7 text-sm">{description}</p>
    </motion.article>
  );
}
