const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(require('node:path').join(__dirname, '../assets/index-cUViE75_.js'), 'utf8');
const cells = source.slice(source.indexOf('function Kcells('), source.indexOf('\nfunction zg()'));
const canvas = source.slice(source.indexOf('function Mo('), source.indexOf('function lg(', source.indexOf('function Mo(')));
let slots = [], cursor = 0, effects = [], cleanups = [], listeners = new Map(), output;
let piece = { rows: Array.from({length:3}, (_,i)=>({rowNumber:i+1, segments:[{start:1,end:2}], leftDelta:0, rightDelta:0})) };
const context = {
  nt: {
    useState(initial) { const i=cursor++; if (!(i in slots)) slots[i]=typeof initial==='function'?initial():initial; return [slots[i], value=>{slots[i]=typeof value==='function'?value(slots[i]):value}]; },
    useRef(initial) { const i=cursor++; return slots[i]??(slots[i]={current:initial}); },
    useMemo(fn) { return fn(); },
    useEffect(fn) { effects.push(fn); }
  },
  d: {jsx:(type,props)=>({type,props})},
  window: {addEventListener:(type,fn)=>{if(!listeners.has(type))listeners.set(type,new Set());listeners.get(type).add(fn)},removeEventListener:(type,fn)=>listeners.get(type)?.delete(fn)},
  cancelAnimationFrame(){}, requestAnimationFrame(){return 1},
  Ei:()=>({objects:[],assets:{},cells:[]}),
  ky:(p,row,stitch)=>p.rows[row-1]?.segments.some(s=>stitch>=s.start&&stitch<=s.end)??false,
  console
};
vm.createContext(context);
vm.runInContext(cells+'\n'+canvas+'\nthis.renderCanvas=Mo;',context);
function render(){
  cleanups.forEach(fn=>fn?.()); cleanups=[];cursor=0;effects=[];
  output=context.renderCanvas({piece, gauge:{stitchWidthMm:1,rowHeightMm:1},currentRow:1,shapeEdit:true,onRowsChange:rows=>{piece={...piece,rows}},onPatternChange(){}});
  cleanups=effects.map(fn=>fn());
}
const target={getBoundingClientRect:()=>({left:0,top:0}),setPointerCapture(){},hasPointerCapture:()=>false};
const event=(x,y)=>({button:0,pointerType:'mouse',pointerId:1,clientX:x,clientY:y,currentTarget:target,preventDefault(){}});
function drag(x1,y1,x2,y2){output.props.onPointerDown(event(x1,y1));render();output.props.onPointerMove(event(x2,y2));render();output.props.onPointerUp(event(x2,y2));render();}
const has=(row,stitch)=>context.ky(piece,row,stitch);
render();
// Make a blank cell inside the existing bounds; exercise the real pointer handlers.
piece={...piece,rows:piece.rows.map(r=>({...r,segments:r.rowNumber===2?[{start:1,end:1}]:r.segments}))};render();
drag(1.1,1.1,1.8,1.8);
assert.equal(has(2,2),false,'selection alone must not add cells');
drag(4.1,1.1,4.1,1.1);
assert.equal(has(2,2),true,'confirm must write rows from the piece object');
drag(1.1,1.1,1.8,1.8);
for(const fn of [...listeners.get('keydown')])fn({key:'Delete',target:{tagName:'CANVAS'},preventDefault(){}});
render();assert.equal(has(2,2),false,'Delete must remove the selected cell');
assert.equal(has(1,2),true,'unselected rows must remain intact');
assert.equal(has(2,1),true,'unselected stitches must remain intact');
console.log('PASS: real canvas handlers select, confirm, and Delete with piece-object input');
