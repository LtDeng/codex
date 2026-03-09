import type { Section } from '../App';

interface TopNavProps {
  sections: Section[];
  current: Section;
  onChange: (section: Section) => void;
}

export function TopNav({ sections, current, onChange }: TopNavProps) {
  return (
    <nav className="overflow-x-auto rounded-lg bg-surface p-2">
      <ul className="flex min-w-max gap-2">
        {sections.map((section) => {
          const active = section === current;
          return (
            <li key={section}>
              <button
                type="button"
                onClick={() => onChange(section)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  active ? 'bg-accent text-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {section}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
