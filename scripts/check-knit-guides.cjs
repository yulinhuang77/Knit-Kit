const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../assets/index-cUViE75_.js'), 'utf8');
function extract(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0, name);
  return source.slice(start, source.indexOf('function ', start + 10));
}
let html;
const context = {URL, Kh:()=>'<svg/>', window:{location:{origin:'http://localhost',pathname:'/',href:'http://localhost/'},open:()=>({document:{write:text=>{html=text},close(){}}})}};
vm.createContext(context);
vm.runInContext(['Ly','Gy','Uu','Kseg','Kguide','Krow','Kplan','Og','No','Sn','Rg'].map(extract).join('\n'),context);
const row = (n, segments, leftDelta=0, rightDelta=0) => ({rowNumber:n,segments,leftDelta,rightDelta});
const segment = (start,end) => ({start,end});
const piece = {name:'领口检查',count:1,centerNeedle:201,rows:Array.from({length:235},(_,i)=>row(i+1,[segment(1,400)]))};
piece.rows.push(row(236,[segment(2,197),segment(204,399)],1,-1),row(237,[segment(3,193),segment(208,397)],1,-2),row(238,[segment(3,191),segment(210,397)]));
assert.equal(context.Krow(piece,piece.rows[0]),'第1排：起400针');
const right=context.Krow(piece,piece.rows[235],'right'),left=context.Krow(piece,piece.rows[235],'left');
assert.match(right,/领口侧首次收3针/);
assert.match(left,/领口侧首次收3针/);
assert.match(right,/袖笼\/肩侧收1针/);
assert.match(context.Krow(piece,piece.rows[236],'right'),/领口侧收4针；袖笼\/肩侧收2针/);
assert.match(context.Krow(piece,piece.rows[236],'left'),/领口侧收4针；袖笼\/肩侧收1针/);
function verify(piece) {
  const detailed=context.Kplan(piece),summary=context.No(piece);
  // Expand the summary's repeated-action shorthand and compare every instruction.
  const expanded=summary.slice(1).flatMap(text=>{
    const match=/^从第(\d+)排起，每隔(\d+)排(.*)，至第(\d+)排$/.exec(text);
    if(!match)return[text];
    const result=[];for(let n=+match[1];n<=+match[4];n+=+match[2])result.push(`第${n}排：${match[3]}`);return result;
  });
  assert.equal(JSON.stringify(expanded),JSON.stringify(detailed.filter(s=>!/^第\d+排$/.test(s)&&!s.endsWith('：继续织当前肩'))));
  for(const r of piece.rows){
    for(const branch of ['right','left'])assert.ok(detailed.includes(context.Krow(piece,r,branch)));
  }
  context.Rg([piece],'A4','portrait',false,'检查','测试');
  assert.ok(html.includes(`<ol>${summary.map(s=>`<li>${context.Sn(s)}</li>`).join('')}</ol>`));
  assert.ok(html.includes(`<pre>${context.Sn(detailed.join('\n'))}</pre>`));
  assert.ok(!html.includes('退出的针推到D位'));
}
verify(piece);
assert.ok(html.includes(context.Sn(right))&&html.includes(context.Sn(left)));
const asymmetric={...piece,centerNeedle:180};
assert.match(context.Krow(asymmetric,asymmetric.rows[235],'right'),/首次收24针/);
verify(asymmetric);
const opening25={centerNeedle:51,rows:[row(1,[segment(1,100)]),row(2,[segment(1,25),segment(76,100)])]};
for(const side of ['left','right'])assert.match(context.Krow(opening25,opening25.rows[1],side),/首次收25针/);
const regular={name:'普通织片',count:1,rows:Array.from({length:8},(_,i)=>row(i+1,[segment(1+i,100-i)],i%2?1:0,i%2?-1:0))};
verify(regular);
assert.ok(context.No(regular).some(s=>s.startsWith('从第2排起，每隔2排')));
const holding={...regular,holdingRegions:[{id:'h',side:'left',startRow:2,endRow:4}]};
const hold=context.Krow(holding,holding.rows[1]);
assert.match(hold,/开启Holding/);assert.match(hold,/右减1针/);assert.ok(!hold.includes('左减'));
verify(holding);
verify({name:'空织片',rows:[]});
assert.ok(source.includes('const b=Krow(ht,p,o.knitBranch)'));
assert.ok(source.includes('...No(ht)'));
assert.ok(!source.includes('No(ht.rows'));
assert.ok(source.includes('centerNeedle:ht.centerNeedle'));
assert.ok(!source.includes('退出的针推到D位'));
console.log('PASS: row 236 neckline, simultaneous outer shaping, 25-stitch openings, cast-on, both shoulders, Holding, summary expansion and PDF instruction equality');
