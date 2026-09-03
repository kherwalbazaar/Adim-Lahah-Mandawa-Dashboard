export default function Footer() {
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-200/60 gap-2">
      <div>© 2026 Adim Lahah Mandawa. All rights reserved.</div>
      <div className="flex items-center gap-4">
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>
        <span>|</span>
        <a href="#" className="hover:underline">
          Terms of Use
        </a>
        <span>|</span>
        <a href="#" className="hover:underline">
          Help & Support
        </a>
      </div>
    </footer>
  );
}
