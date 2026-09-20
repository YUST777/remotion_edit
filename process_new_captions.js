const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('IMG_1397-enhanced-v2_ara.json', 'utf8'));

function cleanText(t) {
  if (!t) return '';
  return t.replace(/[\u200E\u200F\u202A-\u202E]/g, '').trim();
}

// Common transcription corrections
const wordReplacements = {
  'ينفا': 'ينفع',
  'ينفا،': 'ينفع،',
  'blender': 'Blender',
  'blender،': 'Blender،',
  'advance': 'Advanced',
  'advance،': 'Advanced،',
  'مقدرك': 'مكدرك',
  'كركز؟': 'كده؟',
  'أحداك': 'حداشر',
  'يلاقى': 'ألاقي',
  'لاقي': 'ألاقي'
};

const processedSegments = raw.segments.map((seg) => {
  const startMs = Math.round(seg.start_time * 1000);
  const endMs = Math.round(seg.end_time * 1000);
  
  const validWords = [];
  if (seg.words && seg.words.length > 0) {
    for (const w of seg.words) {
      const cleaned = cleanText(w.text);
      if (cleaned && cleaned.length > 0 && cleaned !== ' ') {
        const fixed = wordReplacements[cleaned] || cleaned;
        validWords.push({
          text: fixed,
          startMs: Math.round(w.start_time * 1000),
          endMs: Math.round(w.end_time * 1000)
        });
      }
    }
  }

  if (validWords.length === 0) {
    let rawClean = cleanText(seg.text);
    const tokens = rawClean.split(/\s+/).filter(Boolean);
    const dur = (endMs - startMs) / Math.max(1, tokens.length);
    tokens.forEach((tok, i) => {
      const fixed = wordReplacements[tok] || tok;
      validWords.push({
        text: fixed,
        startMs: Math.round(startMs + i * dur),
        endMs: Math.round(startMs + (i + 1) * dur)
      });
    });
  }

  return {
    startMs: validWords[0].startMs,
    endMs: validWords[validWords.length - 1].endMs,
    text: validWords.map(w => w.text).join(' '),
    speaker: seg.speaker ? seg.speaker.name : undefined,
    words: validWords
  };
});

// Rebalance dangling prefixes/words across boundaries
const danglingStarters = ['الـ', 'والـ', 'للـ', 'desktop', 'mobile', 'AI'];

for (let i = 0; i < processedSegments.length - 1; i++) {
  const curr = processedSegments[i];
  const next = processedSegments[i + 1];
  if (!curr.words || curr.words.length <= 1 || !next.words) continue;

  const lastWord = curr.words[curr.words.length - 1];
  if (danglingStarters.includes(lastWord.text)) {
    // Move last word to start of next segment
    const movedWord = curr.words.pop();
    next.words.unshift(movedWord);

    // Update texts and bounds
    curr.text = curr.words.map(w => w.text).join(' ');
    curr.endMs = curr.words[curr.words.length - 1].endMs;

    next.text = next.words.map(w => w.text).join(' ');
    next.startMs = next.words[0].startMs;
  }
}

fs.writeFileSync('public/captions.json', JSON.stringify(processedSegments, null, 2), 'utf8');
console.log('Successfully saved ' + processedSegments.length + ' rebalanced captions to public/captions.json');
