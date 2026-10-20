// Global SVG sprite. Renders all icon <symbol> defs once.
// Components reference icons via <use href="#i-NAME" />.
export function Sprite() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
    >
      <defs>
        <symbol id="i-search" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </symbol>
        <symbol id="i-bell" viewBox="0 0 24 24">
          <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
          <path d="M10 21h4" />
        </symbol>
        <symbol id="i-cal" viewBox="0 0 24 24">
          <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
          <rect x="14" y="14" width="3.5" height="3.5" rx=".8" fill="currentColor" />
        </symbol>
        <symbol id="i-sun" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
        </symbol>
        <symbol id="i-chev" viewBox="0 0 24 24">
          <path d="m9 5 7 7-7 7" />
        </symbol>
        <symbol id="i-minaret" viewBox="0 0 24 24">
          <path d="M12 2v3M9.5 9 12 5l2.5 4M9.5 9h5V22h-5zM7.5 22h9M11 13h2v3h-2z" />
        </symbol>
        <symbol id="i-users" viewBox="0 0 24 24">
          <circle cx="9" cy="8" r="3.2" />
          <path d="M2.8 20c0-3.4 2.8-6 6.2-6s6.2 2.6 6.2 6" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M16.2 14.2c2.9.2 5 2.5 5 5.8" />
        </symbol>
        <symbol id="i-moon" viewBox="0 0 24 24">
          <path
            d="M20 14.6A8.2 8.2 0 1 1 9.4 4a6.6 6.6 0 0 0 10.6 10.6z"
            fill="currentColor"
          />
        </symbol>
        <symbol id="i-sunset" viewBox="0 0 24 24">
          <path d="M7.5 16a4.5 4.5 0 0 1 9 0z" fill="currentColor" />
          <path d="M12 5v2.5M4.5 9l1.8 1.8M19.5 9l-1.8 1.8M2.5 16H5M19 16h2.5M5 20h14" />
        </symbol>
        <symbol id="i-compass" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9.5" />
          <path d="m16 8-2.4 5.6L8 16l2.4-5.6z" fill="currentColor" />
        </symbol>
        <symbol id="i-book" viewBox="0 0 24 24">
          <path d="M2.5 5.5c3.2-1 6.2-.8 9.5 1.2 3.3-2 6.3-2.2 9.5-1.2v13.5c-3.2-1-6.2-.8-9.5 1.2-3.3-2-6.3-2.2-9.5-1.2zM12 6.7v13" />
        </symbol>
        <symbol id="i-mega" viewBox="0 0 24 24">
          <path d="M3 10v4h3.2L15 18.5V5.5L6.2 10zM6.5 14l1.5 5h2.5l-1.3-4.5M18 9a4.5 4.5 0 0 1 0 6" />
        </symbol>
        <symbol id="i-home" viewBox="0 0 24 24">
          <path d="M3 11.5 12 3.5l9 8M5.5 10v10.5H10V15h4v5.5h4.5V10" />
        </symbol>
        <symbol id="i-clock" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9.5" />
          <path d="M12 6.5V12l3.5 2" />
        </symbol>
        <symbol id="i-grid" viewBox="0 0 24 24">
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
        </symbol>
      </defs>
    </svg>
  );
}