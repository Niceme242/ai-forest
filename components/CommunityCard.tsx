import { motion } from 'framer-motion';

type CommunityCardProps = {
  name: string;
  description: string;
  href: string;
  accent: string;
  icon: string;
};

export function CommunityCard({ name, description, href, accent, icon }: CommunityCardProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group flex flex-col gap-5 rounded-[2rem] border border-green-200 bg-white p-6 text-left shadow-sm hover:shadow-xl hover:shadow-green-100/60 hover:border-green-300 transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl shadow-sm group-hover:bg-green-200 transition-colors">
          {icon}
        </div>
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-green-700">
          {accent}
        </span>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        <p className="mt-3 text-sm leading-7 text-gray-600">{description}</p>
      </div>
      <span className="text-sm font-semibold text-green-600 transition group-hover:text-green-700 group-hover:underline underline-offset-2">
        Rejoindre →
      </span>
    </motion.a>
  );
}
