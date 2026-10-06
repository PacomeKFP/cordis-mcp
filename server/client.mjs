const configured = new URL(process.env.CORDIS_URL || 'https://pacomekengafe--cordis-web.modal.run');
if (configured.username || configured.password || configured.search || configured.hash || (configured.protocol!=='https:' && !(configured.protocol==='http:' && ['localhost','127.0.0.1','[::1]'].includes(configured.hostname)))) throw new Error('CORDIS_URL must use HTTPS (HTTP is allowed for local development only).');
export const baseURL=configured.href.replace(/\/$/,'');
export async function call(path,method='GET',body) {
  if (!process.env.CORDIS_TOKEN) throw new Error('Configure CORDIS_TOKEN with a key from Cordis settings.');
  const response=await fetch(baseURL+'/api'+path,{method,redirect:'error',signal:AbortSignal.timeout(30000),headers:{Authorization:'Bearer '+process.env.CORDIS_TOKEN,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});
  const data=await response.json();
  if (!response.ok) throw Object.assign(new Error(data.error||`HTTP ${response.status}`),{status:response.status});
  return data;
}
let cached,expires=0;
export async function workspace(){
  if(process.env.CORDIS_WORKSPACE)return process.env.CORDIS_WORKSPACE;
  if(cached && Date.now()<expires)return cached;
  const session=await call('/session');if(!session.workspaces?.length)throw new Error('No accessible workspace.');
  cached=session.workspaces[0].id;expires=Date.now()+60000;return cached;
}
