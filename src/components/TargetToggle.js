import { useState } from "react";

export default function TargetToggle({ targetWord }) {
  const [show, setShow] = useState(false);

  return (
    <button
      className="target-toggle-btn"
      onClick={() => setShow(s => !s)}
      title="Debug word"
    >
      {show ? targetWord : "🐞"}
    </button>
  );
}
