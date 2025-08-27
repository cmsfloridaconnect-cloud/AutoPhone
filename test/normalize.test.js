const assert = require('assert');

function normalize(raw, ccVal='+1', only10Checked=true){
  let s=String(raw||'').trim();
  s=s.replace(/(?:\s*(?:x|ext|#)\s*\d+)\s*$/i,'');
  s=s.replace(/[^\d+]/g,'');
  if(!s) return null;
  if(s.startsWith('++')) s=s.replace(/^\++/,'+');
  if(s[0]!=='+'){
    const d=s.replace(/\D/g,'');
    const onlyUs=only10Checked && ccVal==='+1';
    if(onlyUs){
      if(d.length===11 && d.startsWith('1')) s='+'+d;
      else if(d.length===10) s=ccVal+d;
      else return null;
    } else {
      if(/^\d{7,15}$/.test(d)){
        if(ccVal !== '+1' && d.startsWith('0')) s=ccVal + d.slice(1);
        else s=d.length===10?ccVal+d:'+'+d;
      }
      else return null;
    }
  }else{
    const d=s.slice(1).replace(/\D/g,'');
    if(d.length<7 || d.length>15) return null;
    s='+'+d;
  }
  return s;
}

assert.strictEqual(normalize('020 7123 4567', '+44', true), '+442071234567');
console.log('normalize.test.js passed');
