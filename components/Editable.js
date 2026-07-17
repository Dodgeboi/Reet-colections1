// Owner-editable copy: in edit mode, tapping this text opens an editor.
// Plain span for everyone else. pre-line keeps the owner's line breaks.
export default function Editable({ k, value, className = "" }) {
  return (
    <span data-edit-text={k} className={className} style={{ whiteSpace: "pre-line" }}>
      {value}
    </span>
  );
}
