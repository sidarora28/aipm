const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file:///tmp/claude-0/-home-user/82375cda-1aec-5408-8392-53859dd55357/scratchpad/brochure/brochure.html', { waitUntil:'networkidle' });
  await p.pdf({ path:'/tmp/claude-0/-home-user/82375cda-1aec-5408-8392-53859dd55357/scratchpad/brochure/AI-PM-Accelerator-Cohort-4.pdf',
    format:'A4', printBackground:true, margin:{top:'0',right:'0',bottom:'0',left:'0'} });
  await b.close(); console.log('ok');
})();
