import { useEffect } from "react";

export default function Toast({ feedback, clear }) {
  useEffect(() => {
    if (!feedback) return;

    const t = setTimeout(clear, 1500);
    return () => clearTimeout(t);
  }, [feedback, clear]);

  if (!feedback) return null;

  return (
    <div className={`toast ${feedback.type}`}>
      {feedback.message}
    </div>
  );
}
