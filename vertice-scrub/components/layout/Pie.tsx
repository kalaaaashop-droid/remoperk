export function Pie() {
  return (
    <footer id="contacto" className="border-t border-linea bg-marfil">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-2xl">
            Vértice<span className="text-salvia">.</span>scrub
          </p>
          <p className="mt-2 text-sm text-topo">Slow fashion médico. Hecho a mano en Valencia.</p>
        </div>
        <div className="text-sm text-topo">
          <p className="eyebrow mb-3">Taller</p>
          <p>Visitas con cita previa</p>
          <p>Lunes a viernes · 10:00–18:00</p>
        </div>
        <div className="text-sm text-topo">
          <p className="eyebrow mb-3">Síguenos</p>
          <a href="https://instagram.com/vertice.scrub" className="block transition-colors hover:text-grafito">
            Instagram · @vertice.scrub
          </a>
        </div>
      </div>
      <p className="border-t border-linea py-6 text-center text-xs text-piedra">
        © {new Date().getFullYear()} Vértice.scrub · Todos los derechos reservados
      </p>
    </footer>
  );
}
