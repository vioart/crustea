export default function PortalPage() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-5 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
          Overview
        </p>

        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Selamat datang di Portal Crustea.
        </p>
      </div>

      {/* Content */}
      <div className="mt-8 rounded-2xl border border-border bg-background p-6">
        <p className="text-sm text-muted-foreground">
          Dashboard content akan ditempatkan di sini.
        </p>
      </div>
    </div>
  );
}