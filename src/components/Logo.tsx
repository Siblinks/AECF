export default function Logo({ size = 'md', onDark = false }: { size?: 'sm' | 'md' | 'lg'; onDark?: boolean }) {
  const sizes = {
    sm: { box: 'w-8 h-8', text: 'text-sm' },
    md: { box: 'w-10 h-10', text: 'text-lg' },
    lg: { box: 'w-14 h-14', text: 'text-2xl' },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/algc-logo.svg"
        alt="Agaie Emirate Consultative Forum"
        className={`${s.box} object-contain rounded-full bg-white`}
      />
      <div>
        <span className={`font-display font-bold ${onDark ? 'text-white' : 'text-slate-900'} ${s.text} leading-none block`}>ALGC Forum</span>
        {size !== 'sm' && (
          <span className={`text-[10px] ${onDark ? 'text-white/60' : 'text-slate-500'} leading-none block mt-0.5`}>Agaie LGA Consultative Forum</span>
        )}
      </div>
    </div>
  );
}
