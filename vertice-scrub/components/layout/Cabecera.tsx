const ENLACES = [
  { href: "#personaliza", texto: "Personaliza" },
  { href: "#taller", texto: "El taller" },
  { href: "#contacto", texto: "Contacto" },
];

export function Cabecera() {
  return (
    <header className="sticky top-0 z-50 border-b border-linea/70 bg-hueso/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="font-display text-2xl tracking-tight">
          Vértice<span className="text-salvia">.</span>scrub
        </a>
        <nav aria-label="Principal" className="hidden gap-8 text-sm text-topo sm:flex">
          {ENLACES.map((e) => (
            <a key={e.href} href={e.href} className="transition-colors duration-300 hover:text-grafito">
              {e.texto}
            </a>
          ))}
        </nav>
        <a href="#personaliza" className="rounded-full bg-grafito px-4 py-2 text-xs font-medium tracking-wide text-hueso sm:hidden">
          Crear el mío
        </a>
      </div>
    </header>
  );
}
