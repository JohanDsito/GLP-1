export const sideEffectsContentEn = {
  // ── Section 1 — Gastrointestinal ────────────────────────────────────────
  nausea: {
    title: 'Nausea',
    cause:
      'The most common effect. GLP-1 medications slow gastric emptying (food stays longer in the stomach) and activate brain receptors that control the nausea reflex. It is dose-dependent, appears mostly in the first weeks and after dose increases, and usually improves over time.',
    whatToDo:
      'Slow dose titration; small, frequent meals; avoid greasy, fried, and very sweet foods; eat slowly and stop when full; do not lie down right after eating; stay hydrated. Contact your doctor if nausea stops you from eating or drinking, or if it is persistent.',
    supplements: ['Ginger', 'Vitamin B6 (pyridoxine) — evidence in pregnancy nausea, not specific to GLP-1'],
  },
  vomiting: {
    title: 'Vomiting',
    cause:
      'Same mechanism as nausea (delayed gastric emptying). Often triggered by eating too much, too fast, or greasy foods. It affects about 25% of users; severe digestive reactions are uncommon.',
    whatToDo:
      'Small portions, avoid fats, eat slowly. Seek medical care if vomiting lasts more than 24-48 hours, you cannot keep fluids down, or there are signs of dehydration or intense abdominal pain (risk of dehydration and kidney injury). It may require lowering the dose or pausing treatment.',
    supplements: ['Ginger', 'Vitamin B6', 'Oral rehydration solutions with electrolytes'],
  },
  diarrhea: {
    title: 'Diarrhea',
    cause:
      'GLP-1 medications alter gut motility; in some people they speed up transit or change the microbiota, producing loose stools. It affects about 30% of users.',
    whatToDo:
      'Stay well hydrated with clear fluids and electrolytes; avoid dairy, caffeine, alcohol, and polyol sweeteners (sorbitol, xylitol); eat a bland diet. Contact your doctor if it is severe, bloody, with fever, or lasts several days.',
    supplements: ['Probiotics', 'Gentle soluble fiber', 'Rehydration solutions with electrolytes'],
  },
  constipation: {
    title: 'Constipation',
    cause:
      'As digestion slows, waste stays longer in the colon, more water is reabsorbed, and stools harden. Eating less food and less fiber makes it worse. It affects about 24% of users.',
    whatToDo:
      'Increase fiber gradually, drink plenty of fluids, and stay active (about 150 minutes/week of moderate intensity). Use a laxative only if the symptom appears (reactive, not preventive). Contact your doctor if you do not have a bowel movement for several days or have significant pain or bloating.',
    supplements: ['Magnesium (oxide or citrate)', 'Psyllium fiber', 'Probiotics', 'Kiwi'],
  },
  reflux: {
    title: 'Reflux / heartburn',
    cause:
      'Slower gastric emptying raises pressure inside the stomach and prolongs acid exposure, pushing it up into the esophagus. It is worse during dose increases and usually improves around months 2-3 at each dose.',
    whatToDo:
      'Small meals; avoid fats, caffeine, alcohol, spicy and acidic foods; do not lie down for 2-3 hours after eating; walk 10 minutes after dinner; over-the-counter antacids. If it does not improve or is severe, see your doctor (proton-pump inhibitors, safe with GLP-1, may be prescribed).',
    supplements: [],
  },
  sulfurBurps: {
    title: 'Rotten-egg (sulfur) burps',
    cause:
      'With delayed gastric emptying, gut bacteria ferment sulfur-containing amino acids from sulfur-rich foods for longer, producing hydrogen sulfide gas that comes up as an egg-smelling burp. It is worse 24-72 hours after the injection and after dose increases; it usually improves in 2-4 weeks.',
    whatToDo:
      'Limit sulfur-rich foods (eggs, garlic, onion, broccoli, cauliflower, cabbage, red meat), especially around injection day; small meals; keep a food diary to spot triggers; stay hydrated. Over-the-counter remedies like simethicone or bismuth subsalicylate.',
    supplements: ['Probiotics', 'Simethicone (for gas)', 'Bismuth'],
  },
  bloatingGas: {
    title: 'Gas and bloating',
    cause:
      'Food stays longer in the digestive tract, which increases bacterial fermentation and gas production, causing abdominal bloating, burping, and flatulence.',
    whatToDo:
      'Eat slowly (to swallow less air); reduce highly fermentable foods; small meals; physical activity; identify triggers.',
    supplements: ['Simethicone', 'Peppermint oil (antispasmodic)', 'Probiotics'],
  },
  dehydration: {
    title: 'Dehydration',
    cause:
      'Reduced thirst cues, together with nausea, vomiting, or diarrhea, can lower fluid intake or increase fluid loss.',
    whatToDo:
      'Set reminders to drink water throughout the day rather than waiting until you feel thirsty. Include water-rich foods. Watch for signs like dark urine, dizziness, or dry mouth, and contact your doctor if they appear.',
    supplements: ['Rehydration solutions with electrolytes'],
  },

  // ── Section 2 — Systemic and cosmetic ───────────────────────────────────
  fatigue: {
    title: 'Extreme fatigue',
    cause:
      'Mainly from the sharp drop in calories (less available energy), dehydration from digestive symptoms, possible blood-sugar dips, and nutritional gaps (iron, B-complex, magnesium). It is strongest during titration and usually improves once the dose stabilizes.',
    whatToDo:
      'Hydration; small, frequent meals with enough protein; gentle movement (walking); prioritize sleep. Contact your doctor if fatigue is severe, lasts beyond 4 weeks, or interferes with daily life (they may order tests to rule out other causes).',
    supplements: ['Correct documented deficits of iron, B12/B-complex, vitamin D, and magnesium (lab-guided)', 'Adequate protein'],
  },
  hairLoss: {
    title: 'Hair loss',
    cause:
      'Not direct damage from the drug, but telogen effluvium: rapid weight loss and metabolic stress push many follicles into a resting phase, with diffuse shedding 2-4 months later. It is more common in women and generally temporary and reversible.',
    whatToDo:
      'Ensure enough protein and calories; avoid overly aggressive weight loss; ask your doctor to check ferritin, thyroid (TSH), vitamin D, and zinc. Shedding usually resolves as the body adapts.',
    supplements: ['Correct deficits of iron/ferritin, zinc, and vitamin D', 'Adequate protein', 'Hydrolyzed collagen + zinc + B-complex (evidence in general population)'],
  },
  facialAging: {
    title: 'Gaunt face ("Ozempic face")',
    cause:
      'Not skin damage from the drug; it is the result of rapid loss of facial subcutaneous fat. The fat compartments deflate faster than the skin can retract, leaving the face more hollow and wrinkled. It happens with any rapid weight loss.',
    whatToDo:
      'A more gradual pace of weight loss; adequate protein; sun protection and skin care. For significant laxity, see a dermatologist or plastic surgeon (fillers, laser, radiofrequency).',
    supplements: ['Enough protein', 'Hydrolyzed collagen with vitamin C'],
  },
  looseSkin: {
    title: 'Loose skin',
    cause:
      'The skin loses its supporting fat faster than it can contract; with large, rapid loss, collagen and elastin do not adapt in time, leaving hanging skin on the abdomen, arms, or thighs.',
    whatToDo:
      'Slower weight loss; strength training to preserve muscle and provide support; skin hydration. For significant excess skin, dermatological or surgical evaluation.',
    supplements: ['Adequate protein', 'Hydrolyzed collagen with vitamin C, zinc, and copper'],
  },
  glutealLoss: {
    title: 'Loss of glutes and curves ("Ozempic butt")',
    cause:
      'Loss of gluteal subcutaneous fat combined with muscle loss. A meaningful part of the weight lost can be lean mass if not counteracted. It is a normal physiological response to weight loss, not a complication.',
    whatToDo:
      'Strength training 2-3 times/week, especially glute exercises; adequate protein (a general target above ~1.2 g/kg/day spread across the day); a controlled pace of loss.',
    supplements: ['Protein (including protein powder)', 'Creatine (alongside strength training)', 'Vitamin D if deficient'],
  },
  muscleLoss: {
    title: 'Muscle loss',
    cause:
      'A significant part of rapid weight loss can come from muscle instead of fat if protein and resistance training are not prioritized. It is one of the most preventable effects with the right routine.',
    whatToDo:
      'Prioritize protein at every meal and include strength training (even light, at home) rather than cardio alone. Ask your doctor or a trainer about a plan suited to your situation.',
    supplements: ['Protein supplementation (whey or plant-based, if diet is not enough)', 'Creatine (alongside strength training)'],
  },
  headache: {
    title: 'Headache',
    cause:
      'Can be related to dehydration, low food/calorie intake, or the body adjusting to the medication.',
    whatToDo:
      'First check your hydration and whether you have eaten enough that day. Rest in a quiet, dark place if needed. If headaches are frequent, severe, or new for you, mention them to your doctor.',
    supplements: [],
  },

  // ── Section 3 — Genitourinary, sexual and hormonal ──────────────────────
  vulvarVolume: {
    title: 'Vulvar volume loss',
    cause:
      'A non-medical term. Rapid weight loss reduces fat in the mons pubis and labia, causing looseness of the vulvar skin; the relative estrogen drop associated with fat loss may contribute. It is not direct damage from the drug.',
    whatToDo:
      'A gradual pace of loss; pelvic floor training; adequate hydration and nutrition. See a gynecologist if there is discomfort or significant change. For associated dryness, see the vaginal dryness entry.',
    supplements: [],
  },
  vaginalDryness: {
    title: 'Vaginal dryness',
    cause:
      'Fat loss and hormonal changes (a relative estrogen drop) can thin and dry the vaginal lining; dehydration and microbiota changes also contribute. It is not listed as an adverse reaction on the labels; it is known from clinical reports.',
    whatToDo:
      'General hydration; regular-use vaginal moisturizers and lubricants for intercourse; see a gynecologist, who may prescribe local vaginal estrogen if more severe.',
    supplements: ['Hyaluronic acid vaginal moisturizers (topical)', 'Vitamin E vaginal suppositories (topical)'],
  },
  libidoLoss: {
    title: 'Low libido',
    cause:
      'Multifactorial: GLP-1 medications act on the brain reward pathways (dopamine), which reduces desire in some people; fatigue, nausea, hormonal changes from weight loss, and vaginal dryness also play a role. The evidence is limited.',
    whatToDo:
      'Optimize nutrition and hydration; review hormones, thyroid, and nutrients; manage dryness; open communication with your partner; talk to your doctor about a dose adjustment or switching medication.',
    supplements: [],
  },
  anorgasmia: {
    title: 'Difficulty reaching orgasm',
    cause:
      'There is a published case report of anorgasmia after starting a GLP-1, with a proposed mechanism via neurotransmitter modulation in the reward pathways; reduced sensitivity, dryness, and hormonal factors also contribute. The evidence is very preliminary.',
    whatToDo:
      'Rule out other causes (medications, hormones, psychological factors); see your doctor or a sexual medicine specialist; consider a treatment adjustment.',
    supplements: [],
  },
  menstrualChanges: {
    title: 'Menstrual changes',
    cause:
      'Not a direct effect, but a consequence of weight loss and metabolic/hormonal changes. In people with PCOS, regularity often improves; with large, rapid loss, irregularities or even missed periods can appear if body fat drops below a certain threshold.',
    whatToDo:
      'Track your cycle; rule out pregnancy if you miss a period; see a gynecologist for significant changes, heavy or persistent bleeding. Most changes are temporary.',
    supplements: [],
  },
  chillsHotFlashes: {
    title: 'Chills / hot flashes',
    cause:
      'Not listed as formal effects, but reported in practice. Possible causes: changes in metabolism and temperature regulation, hormonal changes from weight loss, or blood-sugar dips (which cause sweating and chills). Note: sweating and chills with trembling can be a sign of hypoglycemia.',
    whatToDo:
      'Rule out low blood sugar (eat if you have dip symptoms); dress in layers; stay hydrated; mention it to your doctor if frequent or intense.',
    supplements: [],
  },
  vividDreams: {
    title: 'Vivid dreams',
    cause:
      'Not an official effect on the labels. It is proposed that neurotransmitter modulation by GLP-1 medications could alter dreams; nighttime blood-sugar dips and sleep changes also play a role. Research is limited.',
    whatToDo:
      'Sleep hygiene; avoid heavy meals and alcohol before bed; mention it to your doctor if it interferes with rest (they may adjust the dose or the timing of the injection).',
    supplements: [],
  },

  // ── Section 4 — Serious complications ───────────────────────────────────
  gastroparesis: {
    title: 'Gastroparesis / ileus (gastric or intestinal paralysis)',
    cause:
      'The same slowing of gastric emptying can, in some cases, lead to gastroparesis (markedly delayed emptying) or even ileus (intestinal paralysis). The risk increases with rapid dose escalation that skips titration. Most cases resolve after stopping the medication.',
    whatToDo:
      'WARNING SIGNS that require medical attention: intense abdominal pain, marked bloating, persistent vomiting, inability to tolerate food or fluids, severe constipation. Always respect slow titration. It may require tests and stopping the medication. This is not something to manage with supplements.',
    supplements: [],
  },
  injectionSite: {
    title: 'Injection site pain',
    cause:
      'Tissue stretching from the injected fluid and local irritation; technique and the cold temperature of the medication play a role. Local reactions (redness, swelling, itching, small nodules) are common and usually resolve in 1-3 days.',
    whatToDo:
      'Let the medication reach room temperature before injecting (do not warm it artificially); rotate sites (abdomen, thigh, back of the arm), 2-3 cm from the previous spot, without repeating the same site for 4 weeks; inject slowly at 90°; apply a cold compress afterward. See your doctor if there is warm redness, pus, fever, or severe pain; seek immediate care for signs of a serious allergic reaction (trouble breathing, spreading swelling).',
    supplements: [],
  },
  hypoglycemia: {
    title: 'Trembling, sweating, confusion, fast heartbeat (warning signs)',
    cause:
      'The combination of trembling, cold sweating, confusion, and a fast heartbeat (also dizziness, intense hunger, blurred vision, difficulty speaking, weakness) is the classic picture of HYPOGLYCEMIA (low blood sugar). Semaglutide/tirzepatide alone rarely cause it, but the risk rises sharply with insulin or sulfonylureas, or when skipping meals, exercising hard without eating, drinking alcohol, or not eating due to nausea.',
    whatToDo:
      'THIS MAY BE AN EMERGENCY. If symptoms are mild-moderate and possible, measure your glucose and use the 15/15 rule: take 15 g of fast-acting carbohydrate (juice, glucose tablets, candy), wait 15 minutes, and repeat if still low. If there is intense confusion, loss of consciousness, seizures, or no improvement: CALL EMERGENCY SERVICES immediately (glucagon may be needed). This is not managed with supplements.',
    supplements: [],
  },

  // ── Section 5 — Psychological ───────────────────────────────────────────
  moodSwings: {
    title: 'Mood swings / irritability',
    cause:
      'Rapid changes in eating patterns, blood sugar, and the emotional adjustment of changing your relationship with food can all affect mood.',
    whatToDo:
      'Keep a simple daily note of how you feel — patterns are easier to see written down than remembered. Regular meals (even smaller ones) help stabilize blood sugar and mood. Talking to someone you trust, or a therapist, about the emotional side of this process can help.',
    supplements: [],
  },
  anxiety: {
    title: 'Anxiety',
    cause:
      'Can stem from the physical adjustment to the medication, worry about side effects, or the emotional weight of a major lifestyle change.',
    whatToDo:
      'Grounding techniques (slow breathing, short walks) can help in the moment. Keeping a consistent routine reduces uncertainty. If anxiety is persistent or affecting daily life, a conversation with your doctor or a mental health professional is worth having — this is common and treatable.',
    supplements: [],
  },
  lowMotivation: {
    title: 'Low motivation / apathy',
    cause:
      'Lower energy intake, fatigue, and the mental effort of maintaining a new routine can reduce motivation for tasks that used to feel easy.',
    whatToDo:
      'Break tasks into smaller steps. Small, consistent wins (a short walk, one healthy meal) rebuild momentum better than trying to do everything at once. If this feels like more than low energy — like losing interest in things you used to enjoy — talk to your doctor.',
    supplements: [],
  },
  insomnia: {
    title: 'Insomnia / trouble sleeping',
    cause:
      'Changes in eating schedule, blood sugar fluctuations, or anxiety about the treatment process can disrupt sleep.',
    whatToDo:
      'Keep a consistent bedtime and wake time. Avoid large meals or screens right before bed. If poor sleep continues for more than a couple of weeks or you feel exhausted the next day consistently, mention it to your doctor.',
    supplements: [],
  },
  foodRelationship: {
    title: 'Altered relationship with food',
    cause:
      'Losing the desire to eat for comfort, or noticing changes in impulse control around food, alcohol, or spending, is a recognized effect some people experience as appetite signals change.',
    whatToDo:
      'This can feel disorienting even when the weight loss itself is welcome. Give yourself time to adjust to a new relationship with food rather than expecting it to feel "normal" immediately. If you notice significant changes in mood, alcohol use, or spending habits, it is worth discussing with your doctor.',
    supplements: [],
  },
} as const;
