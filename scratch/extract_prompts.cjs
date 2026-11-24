const fs = require('fs');
const path = require('path');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\diksha\\.gemini\\antigravity\\brain\\0740d0c3-a6e3-4414-a6cf-b3663917f05e\\.system_generated\\logs\\transcript_full.jsonl';

const fileStream = fs.createReadStream(transcriptPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

const prompts = [];
let lineIndex = 0;

rl.on('line', (line) => {
  lineIndex++;
  try {
    const entry = JSON.parse(line);
    if (entry.type === 'USER_INPUT') {
      prompts.push({
        index: prompts.length + 1,
        step_index: entry.step_index,
        created_at: entry.created_at,
        content: entry.content
      });
    }
  } catch (e) {}
});

rl.on('close', () => {
  fs.writeFileSync(
    'C:\\Users\\diksha\\.gemini\\antigravity\\brain\\0740d0c3-a6e3-4414-a6cf-b3663917f05e\\scratch\\all_user_prompts.json',
    JSON.stringify(prompts, null, 2),
    'utf8'
  );
  console.log(`Saved ${prompts.length} user prompts to all_user_prompts.json`);
});
