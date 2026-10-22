// Accurate Marathi Devanagari to English Latin Transliteration Engine
export function devanagariToEnglish(text) {
  if (!text) return '';
  
  // Custom dictionary overrides for common words, honorifics, titles, surnames
  const wordOverrides = {
    'उर्फ': 'alias',
    'मयत': 'Late',
    'वारस': 'Heir',
    'नावे': 'in name of',
    'इतर': 'others',
    'वगैरे': 'etc.',
    'आणि': 'and',
    'श्री': 'Shri',
    'श्रीमती': 'Shrimati',
    'सौ': 'Sau.',
    'कु': 'Ku.',
    'अण्णा': 'Anna',
    'भाऊ': 'Bhau',
    'आप्पा': 'Appa',
    'बापू': 'Bapu',
    'तात्या': 'Tatya',
    'काका': 'Kaka',
    'नाना': 'Nana',
    'दादा': 'Dada',
    'साहेब': 'Saheb',
    'राव': 'Rao',
    'बाळासाहेब': 'Balasaheb',
    'दत्तात्रय': 'Dattatray',
    'राजेंद्र': 'Rajendra',
    'राजेंद': 'Rajendra',
    'ज्ञानदेव': 'Dnyandev',
    'ज्ञानेश्वर': 'Dnyaneshwar',
    'ज्ञानेश्‍वर': 'Dnyaneshwar',
    'काटे': 'Kate',
    'बागल': 'Bagal',
    'सस्ते': 'Saste',
    'देवकाते': 'Devkate',
    'चव्हाण': 'Chavan',
    'लाडकत': 'Ladkat',
    'खोमणे': 'Khomane',
    'कदम': 'Kadam',
    'साबळे': 'Sabale',
    'आडके': 'Aadke',
    'सरगर': 'Sargar',
    'ताकवणे': 'Takawane',
    'शिंदे': 'Shinde',
    'पाटील': 'Patil',
    'पवार': 'Pawar',
    'जाधव': 'Jadhav',
    'मोरे': 'More',
    'भोसले': 'Bhosale',
    'गायकवाड': 'Gaikwad',
    'जगताप': 'Jagtap',
    'हरिभाऊ': 'Haribhau',
    'खंडेराव': 'Khanderao',
    'आनंदराव': 'Anandrao',
    'विजयसिंह': 'Vijaysinh',
    'दिनकर': 'Dinkar',
    'धनंजय': 'Dhananjay',
    'सिताराम': 'Sitaram',
    'भाग्यश्री': 'Bhagyashree',
    'चंद्रकांत': 'Chandrakant',
    'संपत': 'Sampat',
    'बबन': 'Baban',
    'पोपट': 'Popat',
    'रघुनाथ': 'Raghunath',
    'गंगाराम': 'Gangaram',
    'तात्याबा': 'Tatyaba',
  };

  const words = text.trim().split(/\s+/);
  const resultWords = words.map(word => {
    if (wordOverrides[word]) {
      return wordOverrides[word];
    }
    // Check if ends with suffixes like 'राव', 'भाऊ', 'बा'
    if (word.endsWith('राव') && word.length > 3) {
      const base = word.slice(0, -3);
      return transliterateWord(base) + 'rao';
    }
    if (word.endsWith('भाऊ') && word.length > 3) {
      const base = word.slice(0, -3);
      return transliterateWord(base) + 'bhau';
    }
    if (word.endsWith('सिंह') && word.length > 4) {
      const base = word.slice(0, -4);
      return transliterateWord(base) + 'sinh';
    }

    return transliterateWord(word);
  });

  return resultWords.join(' ');
}

function transliterateWord(word) {
  const vowels = {
    'अ': 'a', 'आ': 'a', 'इ': 'i', 'ई': 'i', 'उ': 'u', 'ऊ': 'u',
    'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'an', 'अः': 'ah'
  };

  const matras = {
    'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u',
    'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
    'ं': 'n', 'ँ': 'n', 'ः': 'h'
  };

  const consonants = {
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh',
    'ष': 'sh', 'स': 's', 'ह': 'h', 'ळ': 'l', 'क्ष': 'ksh',
    'ज्ञ': 'dny', 'श्र': 'shr', 'त्र': 'tr'
  };

  let out = '';
  const len = word.length;
  let i = 0;

  while (i < len) {
    const ch = word[i];
    const next = i + 1 < len ? word[i + 1] : '';
    const nextNext = i + 2 < len ? word[i + 2] : '';

    // Handle compound letters
    if (ch === 'ज' && next === '्' && nextNext === 'ञ') {
      out += 'dny';
      i += 3;
      if (i < len && matras[word[i]]) {
        out += matras[word[i]];
        i++;
      } else if (i < len && word[i] === '्') {
        i++;
      } else if (i < len && !isPunctuation(word[i])) {
        out += 'a';
      }
      continue;
    }

    if (ch === 'क' && next === '्' && nextNext === 'ष') {
      out += 'ksh';
      i += 3;
      if (i < len && matras[word[i]]) {
        out += matras[word[i]];
        i++;
      } else if (i < len && word[i] === '्') {
        i++;
      } else if (i < len && !isPunctuation(word[i])) {
        out += 'a';
      }
      continue;
    }

    if (ch === 'श' && next === '्' && nextNext === 'र') {
      out += 'shr';
      i += 3;
      if (i < len && matras[word[i]]) {
        out += matras[word[i]];
        i++;
      } else if (i < len && word[i] === '्') {
        i++;
      } else if (i < len && !isPunctuation(word[i])) {
        out += 'a';
      }
      continue;
    }

    if (ch === 'त' && next === '्' && nextNext === 'र') {
      out += 'tr';
      i += 3;
      if (i < len && matras[word[i]]) {
        out += matras[word[i]];
        i++;
      } else if (i < len && word[i] === '्') {
        i++;
      } else if (i < len && !isPunctuation(word[i])) {
        out += 'a';
      }
      continue;
    }

    // Check independent vowel
    if (vowels[ch]) {
      out += vowels[ch];
      i++;
      continue;
    }

    // Check consonant
    if (consonants[ch]) {
      const c = consonants[ch];
      i++;

      // Check what follows the consonant
      if (i < len) {
        const nextChar = word[i];
        if (nextChar === '्') {
          // Virama: no vowel
          out += c;
          i++;
        } else if (matras[nextChar]) {
          out += c + matras[nextChar];
          i++;
          // Check for anusvara following matra (e.g. शें, कें, तां)
          if (i < len && (word[i] === 'ं' || word[i] === 'ँ')) {
            const nextAfterAnusvara = i + 1 < len ? word[i + 1] : '';
            if (['प', 'फ', 'ब', 'भ', 'म'].includes(nextAfterAnusvara)) {
              out += 'm';
            } else {
              out += 'n';
            }
            i++;
          }
        } else if (nextChar === 'ं' || nextChar === 'ँ') {
          // Consonant + anusvara (e.g. संपत -> Sam, चंद्र -> Chan)
          const nextAfterAnusvara = i + 1 < len ? word[i + 1] : '';
          if (['प', 'फ', 'ब', 'भ', 'म'].includes(nextAfterAnusvara)) {
            out += c + 'am';
          } else {
            out += c + 'an';
          }
          i++;
        } else if (nextChar === 'ः') {
          out += c + 'ah';
          i++;
        } else if (consonants[nextChar] || vowels[nextChar]) {
          out += c + 'a';
        } else {
          out += c;
        }
      } else {
        // End of word: consonant usually has no vowel in Marathi
        out += c;
      }
      continue;
    }

    if (matras[ch]) {
      out += matras[ch];
      i++;
      continue;
    }

    out += ch;
    i++;
  }

  // Capitalize first letter of word
  if (out.length > 0) {
    return out.charAt(0).toUpperCase() + out.slice(1);
  }
  return out;
}

function isPunctuation(ch) {
  return /[\s.,\/#!$%\^&\*;:{}=\-_`~()]/i.test(ch);
}

// Test against samples from user's screen (Gat 17) and Gats 1, 22, 124
const sample = [
  'श्रीकांत हरिभाऊ काटे',
  'भाग्यश्री राजेंद बागल',
  'योगेश खंडेराव काटे',
  'भूपेश खंडेराव काटे',
  'राजेश उर्फ भूपेश खंडेराव काटे',
  'वैभव विजयसिंह काटे',
  'शोभा विजयसिंह काटे',
  'संपत आनंदराव कदम',
  'प्रदीप तात्याबा लाडकत',
  'कमल बाळासाहेब साबळे',
  'गोपिनाथ दिनकर आडके',
  'चंद्रकांत आण्णा खोमणे',
  'अंकुश रघुनाथ चव्हाण',
  'दत्तात्रय रघुनाथ चव्हाण',
  'प्रताप पोपट देवकाते',
  'चंद्रकांत सिताराम सस्ते',
  'अशोक सिताराम सस्ते',
  'सोनाली विनोद सस्ते',
  'जान्हवी धनंजय सस्ते'
];

console.log('--- TRANSLITERATION TEST ---');
for (const s of sample) {
  console.log(s, '->', devanagariToEnglish(s));
}
