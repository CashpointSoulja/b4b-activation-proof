const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
let browser;
(async()=>{
  browser=await chromium.launch({executablePath:process.env.B4B_BROWSER_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  const results=[];
  for(const width of [320,390,540])for(const height of [568,640]){
    const context=await browser.newContext({viewport:{width,height}});
    const page=await context.newPage();
    await page.goto(process.env.B4B_QA_URL||'http://127.0.0.1:8787');
    await page.locator('#account-workspace:not(.hidden)').waitFor();
    await page.locator('#import-open').click();
    await page.locator('#import-example').click();
    await page.locator('#preview-import').click();
    await page.locator('#import-preview').filter({hasText:'Valid preview'}).waitFor();
    for(const selector of ['#import-close','#import-input','#import-example','#preview-import','#commit-import']){
      const box=await page.locator(selector).boundingBox();
      assert.ok(box&&box.x>=0&&box.y>=0&&box.x+box.width<=width+1&&box.y+box.height<=height,`${width}×${height} ${selector} outside viewport`);
    }
    await page.locator('#import-input').fill('[{"id":"invalid"}]');
    await page.locator('#preview-import').click();
    await page.locator('#import-preview').filter({hasText:'Import blocked'}).waitFor();
    for(const selector of ['#import-close','#import-input','#import-example','#preview-import','#commit-import']){
      const box=await page.locator(selector).boundingBox();
      assert.ok(box&&box.y>=0&&box.y+box.height<=height,`${width}×${height} invalid preview hides ${selector}`);
    }
    if(height===568)await page.screenshot({path:`docs/screenshots/import-${width}-short.png`});
    results.push(`${width}×${height}: every modal control visible for valid and invalid previews.`);
    await context.close();
  }
  await browser.close();
  await fs.writeFile('docs/short-viewport-results.json',JSON.stringify({scope:'Local short-height UI QA, not public recording',status:'PASS',results},null,2)+'\n');
  console.log(JSON.stringify({status:'PASS',checks:results.length,results},null,2));
})().catch(async error=>{console.error(error);await browser?.close();process.exitCode=1;});
