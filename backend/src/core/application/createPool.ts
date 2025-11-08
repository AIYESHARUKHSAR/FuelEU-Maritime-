export function createPoolAllocation(members: { shipId: string; cb: number }[]) {
  const total = members.reduce((s, m) => s + m.cb, 0);
  if (total < 0) throw new Error("Pool sum must be >= 0");

  const after = members.map(m => ({ shipId: m.shipId, cbBefore: m.cb, cbAfter: m.cb }));
  const donors = after.filter(m => m.cbAfter > 0).sort((a,b)=>b.cbAfter - a.cbAfter);
  const takers = after.filter(m => m.cbAfter < 0).sort((a,b)=>a.cbAfter - b.cbAfter); // most negative first

  for (const t of takers) {
    let need = -t.cbAfter;
    for (const d of donors) {
      if (need <= 0) break;
      const give = Math.min(d.cbAfter, need);
      d.cbAfter -= give;
      t.cbAfter += give;
      need -= give;
    }
    // Deficit ship cannot exit worse than before
    if (t.cbAfter < t.cbBefore) t.cbAfter = t.cbBefore;
  }
  // Surplus ship cannot exit negative
  after.forEach(m => { if (m.cbAfter < 0) m.cbAfter = 0; });

  return after;
}
