/** Pill filter row with a count per option. */
export function Filters({ id, className = "filters", label, options, value, onChange }: {
  id: string; className?: string; label: string;
  options: { id: string; label: string; count: number }[];
  value: string; onChange: (id: string) => void;
}) {
  return (
    <div className={className} id={id} role="group" aria-label={label}>
      {options.map(o => (
        <button key={o.id} className="chip" aria-pressed={o.id === value} onClick={() => onChange(o.id)}>
          {o.label}<span className="n">{o.count}</span>
        </button>
      ))}
    </div>
  );
}
