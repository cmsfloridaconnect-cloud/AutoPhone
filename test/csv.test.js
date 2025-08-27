const assert = require('assert');
const Papa = require('papaparse');

function parseDelimited(text){
  const result = Papa.parse(text,{delimiter:'',skipEmptyLines:true});
  return result.data || [];
}

const comma = `Name,Note\n"Foo, Inc","Line1
Line2"`;
assert.deepStrictEqual(parseDelimited(comma), [['Name','Note'], ['Foo, Inc','Line1\nLine2']]);

const tab = 'a\tb\n1\t2';
assert.deepStrictEqual(parseDelimited(tab), [['a','b'], ['1','2']]);

const semicolon = 'a;b\n"1;2";3';
assert.deepStrictEqual(parseDelimited(semicolon), [['a','b'], ['1;2','3']]);

console.log('csv.test.js passed');
