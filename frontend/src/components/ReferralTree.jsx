export default function ReferralTree({ nodes }) {
  if (!nodes?.length) return <p style={{color:'#94a3b8'}}>No referrals yet.</p>;
  return (
    <div className="tree">
      <ul>{nodes.map(n => (
        <li key={n._id}>
          <span className="node">L{n.level} • {n.fullName} <em style={{color:'#22d3ee'}}>({n.referralCode})</em></span>
          {n.children?.length > 0 && <ReferralTree nodes={n.children} />}
        </li>
      ))}</ul>
    </div>
  );
}
