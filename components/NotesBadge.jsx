export default function NotesBadge({ text }) {
  const preview = text ? (text.length > 140 ? text.slice(0, 140) + '…' : text) : 'Notes';
  return (
    <div
      className="absolute top-3 left-3 text-xs font-mono px-2 py-1 border border-blue-400/60 text-blue-300 bg-black/60 group-hover:scale-105 transition-transform duration-150"
      title={preview}
    >
      NOTES
    </div>
  );
}
