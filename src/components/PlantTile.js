import { useEffect, useRef } from 'react';

// status: 'correct' | 'present' | 'absent' | 'empty'
export default function PlantTile({ status, letter, prevStatus }) {
  const svgRef = useRef(null);

  const improved = prevStatus !== status && status !== 'empty';

  useEffect(() => {
    if (!svgRef.current || status === 'empty') return;
    const el = svgRef.current;
    el.style.transform = 'scaleY(0)';
    el.style.opacity = '0';
    requestAnimationFrame(() => {
      el.style.transition = improved
        ? 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease'
        : 'transform 0.4s ease-out, opacity 0.3s ease';
      el.style.transform = 'scaleY(1)';
      el.style.opacity = '1';
    });
  }, [status]);

  if (status === 'empty') {
    return (
      <div style={styles.slot}>
        <svg width="52" height="80" viewBox="0 0 52 80" style={{ opacity: 0.18 }}>
          <line x1="26" y1="72" x2="26" y2="58" stroke="#8B5E3C" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="26" cy="57" rx="8" ry="4" fill="#8B5E3C" opacity="0.5" />
        </svg>
        <div style={styles.letterLabel}>{letter !== ' ' ? letter : ''}</div>
      </div>
    );
  }

  return (
    <div style={styles.slot}>
      <svg
        ref={svgRef}
        width="52"
        height="80"
        viewBox="0 0 52 80"
        style={{ transformOrigin: 'bottom center', display: 'block' }}
      >
        {status === 'correct' && <FlowerPlant />}
        {status === 'present' && <BudPlant />}
        {status === 'absent' && <WitheredPlant />}
      </svg>
      <div style={{
        ...styles.letterLabel,
        color: status === 'correct' ? '#2d6a1e' : status === 'present' ? '#7a5a10' : '#6a6a6a',
      }}>
      </div>
    </div>
  );
}

function FlowerPlant() {
  return (
    <>
      {/* Stem */}
      <line x1="26" y1="72" x2="26" y2="32" stroke="#4a8a2a" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left leaf */}
      <ellipse cx="18" cy="50" rx="8" ry="4" fill="#5aaa3a" transform="rotate(-30 18 50)" />
      {/* Right leaf */}
      <ellipse cx="34" cy="44" rx="8" ry="4" fill="#5aaa3a" transform="rotate(30 34 44)" />
      {/* Petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse
          key={i}
          cx={26 + 11 * Math.sin((angle * Math.PI) / 180)}
          cy={28 + -11 * Math.cos((angle * Math.PI) / 180)}
          rx="5"
          ry="7"
          fill={i % 2 === 0 ? '#e8609a' : '#f08cb8'}
          transform={`rotate(${angle} ${26 + 11 * Math.sin((angle * Math.PI) / 180)} ${28 + -11 * Math.cos((angle * Math.PI) / 180)})`}
        />
      ))}
      {/* Center */}
      <circle cx="26" cy="28" r="7" fill="#f5c842" />
      <circle cx="26" cy="28" r="4" fill="#e8a820" />
      {/* Center dots */}
      {[0, 90, 180, 270].map((a, i) => (
        <circle key={i}
          cx={26 + 2.2 * Math.sin((a * Math.PI) / 180)}
          cy={28 + -2.2 * Math.cos((a * Math.PI) / 180)}
          r="0.9" fill="#c88010" />
      ))}
      {/* Soil mound */}
      <ellipse cx="26" cy="73" rx="10" ry="4" fill="#7a4e2e" />
    </>
  );
}

function BudPlant() {
  return (
    <>
      {/* Stem */}
      <line x1="26" y1="72" x2="26" y2="38" stroke="#5a9a3a" strokeWidth="2.5" strokeLinecap="round" />
      {/* Small leaf */}
      <ellipse cx="19" cy="56" rx="7" ry="3.5" fill="#6aaa4a" transform="rotate(-25 19 56)" />
      {/* Bud petals — closed */}
      <ellipse cx="26" cy="32" rx="6" ry="9" fill="#f5c052" />
      <ellipse cx="20" cy="34" rx="4.5" ry="7" fill="#e8a830" transform="rotate(-15 20 34)" />
      <ellipse cx="32" cy="34" rx="4.5" ry="7" fill="#e8a830" transform="rotate(15 32 34)" />
      {/* Tip */}
      <ellipse cx="26" cy="26" rx="4" ry="5" fill="#d49020" />
      {/* Sepals */}
      <ellipse cx="21" cy="40" rx="3" ry="5" fill="#4a8a2a" transform="rotate(-20 21 40)" />
      <ellipse cx="31" cy="40" rx="3" ry="5" fill="#4a8a2a" transform="rotate(20 31 40)" />
      {/* Soil */}
      <ellipse cx="26" cy="73" rx="10" ry="4" fill="#7a4e2e" />
    </>
  );
}

function WitheredPlant() {
  return (
    <>
      {/* Drooping stem */}
      <path d="M26 72 Q28 58 22 48 Q18 40 20 34" fill="none" stroke="#9a9a7a" strokeWidth="2" strokeLinecap="round" />
      {/* Drooping leaves */}
      <ellipse cx="16" cy="55" rx="7" ry="3" fill="#b0b088" transform="rotate(40 16 55)" opacity="0.8" />
      <ellipse cx="25" cy="45" rx="6" ry="2.5" fill="#aaa878" transform="rotate(-20 25 45)" opacity="0.7" />
      {/* Wilted head — curled petals */}
      <ellipse cx="20" cy="32" rx="5" ry="3" fill="#c8c8a0" transform="rotate(-30 20 32)" opacity="0.8" />
      <ellipse cx="24" cy="30" rx="4" ry="2.5" fill="#b8b890" transform="rotate(10 24 30)" opacity="0.7" />
      <ellipse cx="18" cy="36" rx="4" ry="2" fill="#c0c098" transform="rotate(50 18 36)" opacity="0.75" />
      {/* Dried center */}
      <circle cx="21" cy="33" r="4" fill="#a8a878" opacity="0.9" />
      <circle cx="21" cy="33" r="2" fill="#909068" />
      {/* Cracked soil */}
      <ellipse cx="26" cy="73" rx="10" ry="4" fill="#9a7a5a" opacity="0.7" />
      <line x1="22" y1="72" x2="20" y2="69" stroke="#7a5a3a" strokeWidth="1" opacity="0.6" />
      <line x1="28" y1="73" x2="30" y2="70" stroke="#7a5a3a" strokeWidth="1" opacity="0.6" />
    </>
  );
}

const styles = {
  slot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '52px',
  },
  letterLabel: {
    fontSize: '11px',
    fontWeight: '500',
    marginTop: '2px',
    height: '14px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
};
