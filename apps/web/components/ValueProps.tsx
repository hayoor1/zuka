import { Truck, Shield, RefreshCw, Gem } from 'lucide-react';

const valueProps = [
  {
    icon: Truck,
    title: 'Same-Day Concierge Delivery',
    description: 'Complimentary within Lagos for orders above ₦50,000',
    accent: 'from-[#f7dcbf] to-[#eacda3]',
    iconTint: 'text-[#a86726]'
  },
  {
    icon: Shield,
    title: 'Triple-Checked Authentication',
    description: 'Every piece verified by our luxury curation team',
    accent: 'from-[#dec7ff] to-[#b18bff]',
    iconTint: 'text-[#5d35a6]'
  },
  {
    icon: RefreshCw,
    title: '30-Day Atelier Returns',
    description: 'Effortless exchanges & alterations for custom fits',
    accent: 'from-[#ffe7f3] to-[#ffd9ee]',
    iconTint: 'text-[#cc3f7b]'
  },
  {
    icon: Gem,
    title: 'Zuka Royale Rewards',
    description: 'Earn double points during premiere launches',
    accent: 'from-[#fdf5d7] to-[#fdeaba]',
    iconTint: 'text-[#b5850d]'
  }
];

export function ValueProps() {
  return (
    <section className="py-16 bg-gradient-to-b from-[#fbf8ff] to-[#fffdf7]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((prop, index) => (
            <div
              key={index}
              className="brand-card border border-white/40 p-5 flex gap-4 items-start"
            >
              <div
                className={`rounded-2xl p-3 bg-gradient-to-br ${prop.accent} shadow-lg shadow-black/5`}
              >
                <prop.icon className={`h-6 w-6 ${prop.iconTint}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-purple">{prop.title}</p>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">{prop.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

