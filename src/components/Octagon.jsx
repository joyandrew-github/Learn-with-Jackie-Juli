export default function Octagon({ className = "", children }) {
  return (
    <span className={`octagon ${className}`}>
      <span className="octagon-in">{children}</span>
    </span>
  );
}
