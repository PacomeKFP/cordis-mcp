import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {spawnSync} from 'node:child_process';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js';
const wid='00000000-0000-4000-8000-000000000001';
test('portable stdio discovers 16 tools and makes scoped, bounded calls with a header-only key',async()=>{
  const http=createServer((req,res)=>{
    assert.equal(req.headers.authorization,'Bearer synthetic-test-key');
    res.setHeader('Content-Type','application/json');
    if(req.url==='/api/session')return res.end(JSON.stringify({workspaces:[{id:wid,name:'QA',role:'owner'}]}));
    if(req.url===`/api/workspaces/${wid}/assets`)return res.end(JSON.stringify({assets:[{id:wid,name:'Voix.wav',trashed:false},{id:'other',name:'Hidden.wav',trashed:true}],folders:['Voix']}));
    res.statusCode=403;res.end(JSON.stringify({error:'Read-only test key'}));
  });
  await new Promise(r=>http.listen(0,'127.0.0.1',r));
  const transport=new StdioClientTransport({command:process.execPath,args:['bin/cordis-mcp.mjs'],env:{...process.env,CORDIS_URL:'http://127.0.0.1:'+http.address().port,CORDIS_TOKEN:'synthetic-test-key'},stderr:'pipe'});
  const client=new Client({name:'portable-qa',version:'1'});
  try{
    await client.connect(transport);
    const tools=await client.listTools();assert.equal(tools.tools.length,16);
    assert.equal(tools.tools.find(t=>t.name==='start_transcription').annotations.openWorldHint,true);
    const workspaces=await client.callTool({name:'list_workspaces',arguments:{}});assert.equal(workspaces.structuredContent.workspaces[0].id,wid);
    const media=await client.callTool({name:'list_media',arguments:{limit:1}});assert.equal(media.structuredContent.assets.length,1);assert.equal(media.structuredContent.assets[0].name,'Voix.wav');
    const denied=await client.callTool({name:'move_media',arguments:{assetId:wid,name:'Denied.wav'}});assert.equal(denied.isError,true);
    assert.equal(JSON.stringify(media).includes('synthetic-test-key'),false);
  }finally{await client.close();await new Promise(r=>http.close(r));}
});
test('the client rejects unsafe URL credentials without exposing them',()=>{
  const result=spawnSync(process.execPath,['bin/cordis-mcp.mjs'],{env:{...process.env,CORDIS_URL:'https://user:private-secret@example.test'},encoding:'utf8'});
  assert.notEqual(result.status,0);assert.equal(result.stderr.includes('private-secret'),false);assert.equal(result.stdout,'');
});
