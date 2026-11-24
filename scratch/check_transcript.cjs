const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\diksha\\.gemini\\antigravity\\brain\\0740d0c3-a6e3-4414-a6cf-b3663917f05e\\.system_generated\\logs\\transcript_full.jsonl';

const fileStream = fs.createReadStream(transcriptPath);
const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

const items = [];
let lineIndex = 0;

rl.on('line', (line) => {
  lineIndex++;
  try {
    const entry = JSON.parse(line);
    // Let's inspect relevant fields
    if (entry.type === 'USER_INPUT' || entry.type === 'MODEL_RESPONSE' || entry.type === 'PLANNER_RESPONSE' || entry.content) {
      items.push({
        lineIndex,
        step_index: entry.step_index,
        source: entry.source,
        type: entry.type,
        created_at: entry.created_at,
        content: entry.content,
        tool_calls: entry.tool_calls ? entry.tool_calls.length : 0,
      });
    }
  } catch (e) {
    console.error('Error parsing line ' + lineIndex + ':', e.message);
  }
});

rl.on('close', () => {
  console.log('Total parsed items:', items.length);
  const userItems = items.filter(i => i.type === 'USER_INPUT');
  console.log('User inputs count:', userItems.length);
  userItems.forEach((u, idx) => {
    console.log(`User prompt #${idx + 1} (step ${u.step_index}, line ${u.lineIndex}, time ${u.created_at}): length ${u.content ? u.content.length : 0}`);
    console.log(`Preview: ${(u.content || '').substring(0, 100).replace(/\n/g, ' ')}...`);
  });

  const responseItems = items.filter(i => i.type === 'MODEL_RESPONSE' || (i.source === 'MODEL' && i.content));
  console.log('Model responses with content count:', responseItems.length);
});
