import { useState } from "react";

export default function TargetToggle({ targetWord }) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ marginBottom: "10px" }}>
      <button onClick={() => setShow(s => !s)}>
        {show ? "Hide word" : "Show word"}
      </button>

      {show && (
        <p style={{ marginTop: "5px", letterSpacing: "3px" }}>
          {targetWord}
        </p>
      )}
    </div>
  );
}
