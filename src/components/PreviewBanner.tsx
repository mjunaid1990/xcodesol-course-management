export function PreviewBanner({ enabled }: { enabled: boolean }) {
  if (!enabled) return null
  return <div className="preview-bar">Draft preview is active <a href="/api/preview/exit">Exit preview</a></div>
}
