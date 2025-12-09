const currentYear = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer>
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-600">
            (c) {currentYear} Zespol Hiver
          </p>
        </div>
        <p className="text-[11px] tracking-wide text-gray-400 uppercase">
          Własność cyfrowa Hiver
        </p>
      </div>
    </footer>
  );
}
