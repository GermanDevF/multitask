export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex h-12 w-full max-w-6xl items-center px-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Debts
      </div>
    </footer>
  );
}
