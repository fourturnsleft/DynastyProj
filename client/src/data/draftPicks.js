// Dynasty draft pick values modeled after KTC
// Years: current + 2 future years | Rounds 1-4 | Tiers: Early/Mid/Late
const PICK_VALUES = {
  '2025': { 1: { Early: 8200, Mid: 6400, Late: 5000 }, 2: { Early: 3400, Mid: 2600, Late: 1900 }, 3: { Early: 1400, Mid: 1100, Late: 800 }, 4: { Early: 600, Mid: 450, Late: 300 } },
  '2026': { 1: { Early: 6200, Mid: 4800, Late: 3700 }, 2: { Early: 2600, Mid: 2000, Late: 1400 }, 3: { Early: 1000, Mid: 800,  Late: 550 }, 4: { Early: 450, Mid: 320, Late: 200 } },
  '2027': { 1: { Early: 4500, Mid: 3500, Late: 2700 }, 2: { Early: 1900, Mid: 1400, Late: 1000 }, 3: { Early: 750,  Mid: 580,  Late: 400 }, 4: { Early: 320, Mid: 230, Late: 150 } },
}

const ROUND_SUFFIX = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' }

export const DRAFT_PICKS = Object.entries(PICK_VALUES).flatMap(([year, rounds]) =>
  Object.entries(rounds).flatMap(([round, tiers]) =>
    Object.entries(tiers).map(([tier, value]) => ({
      id: `pick-${year}-${round}-${tier}`,
      type: 'pick',
      name: `${year} ${ROUND_SUFFIX[round]} (${tier})`,
      year,
      round: Number(round),
      tier,
      value,
    }))
  )
)
