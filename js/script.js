const container=document.getElementById("array-container");

const graphContainer=document.getElementById("graph-container");

const generateButton=document.getElementById("generate-btn");

const startButton=document.getElementById("start-btn");
const pauseButton=document.getElementById("pause-btn");
const prevButton=document.getElementById("prev-btn");
const nextButton=document.getElementById("next-btn");
const resetButton=document.getElementById("reset-btn");

const speedSlider=document.getElementById("speed");
const speedValue=document.getElementById("speed-value");

const searchWrap=document.getElementById("search-input-wrap");
const searchValue=document.getElementById("search-value");

const title=document.getElementById("algorithm-title");

const statusBadge=document.getElementById("status-badge");

const infoTitle=document.getElementById("info-title");
const infoDescription=document.getElementById("info-description");
const infoSteps=document.getElementById("info-steps");
const infoPseudocode=document.getElementById("info-pseudocode");
const complexity=document.getElementById("complexity");

const comparisonDisplay=document.getElementById("comparisons");
const swapDisplay=document.getElementById("swaps");
const passDisplay=document.getElementById("passes");
const operationText=document.getElementById("operation-text");
const variablesText=document.getElementById("variables-text");
const stepText=document.getElementById("step-text");
const algoButtons=[...document.querySelectorAll(".algo-btn")];

let array=[5,3,8,4,2,9,7,1,6,10];
let currentAlgorithm="bubble";
let animationSpeed=500;
let isPlaying=false;
let frames=[];
let frameIndex=0;
let comparisons=0,swaps=0,passes=0;
let graphVisited=[];
let graphCurrent=-1;

const algorithms={
 bubble:{name:"Bubble Sort",desc:"Bubble Sort repeatedly compares adjacent elements and swaps them when they are in the wrong order. Larger elements gradually move toward the end.",

  steps:["Compare two adjacent elements.","Swap them if the left value is greater.","Continue across the unsorted part of the array.","After a pass, the largest remaining value is in its final position.","Repeat until no swaps are needed."],
  
  code:["for i = 0 to n - 1","    swapped = false","    for j = 0 to n - i - 2","        if A[j] > A[j + 1]","            swap(A[j], A[j + 1])","            swapped = true","    if swapped == false","        break"],
  
  cx:["O(n)","O(n²)","O(n²)","O(1)"]
},
 
selection:{name:"Selection Sort",desc:"Selection Sort repeatedly finds the smallest value in the unsorted portion and places it at the next sorted position.",
  
  steps:["Start at the first unsorted position.","Find the minimum value in the remaining array.","Swap the minimum with the first unsorted position.","Move the boundary one position right.","Repeat until the whole array is sorted."],
  
  code:["for i = 0 to n - 2","    minIndex = i","    for j = i + 1 to n - 1","        if A[j] < A[minIndex]","            minIndex = j","    swap(A[i], A[minIndex])"],
  
  cx:["O(n²)","O(n²)","O(n²)","O(1)"]
},

 insertion:{name:"Insertion Sort",desc:"Insertion Sort builds a sorted section from left to right by inserting each new value into its correct position.",
  
  steps:["Treat the first element as sorted.","Take the next element as the key.","Shift larger sorted elements one position right.","Insert the key into the open position.","Repeat for every remaining element."],
  
  code:["for i = 1 to n - 1","    key = A[i]","    j = i - 1","    while j >= 0 and A[j] > key","        A[j + 1] = A[j]","        j = j - 1","    A[j + 1] = key"],
  
  cx:["O(n)","O(n²)","O(n²)","O(1)"]
},

 linear:{name:"Linear Search",desc:"Linear Search checks elements one by one from left to right until the target is found or the array ends.",
  
  steps:["Choose a target value.","Start at index 0.","Compare the current value with the target.","Stop when the target is found.","If the array ends, the target is not present."],
  
  code:["for i = 0 to n - 1","    if A[i] == target","        return i","return -1"],
  
  cx:["O(1)","O(n)","O(n)","O(1)"]
},

 binary:{name:"Binary Search",desc:"Binary Search finds a target in a sorted array by repeatedly checking the middle element and discarding half of the remaining search space.",
  
  steps:["Sort the array first.","Set left and right boundaries.","Check the middle element.","Discard the half that cannot contain the target.","Repeat until found or the search range is empty."],
  
  code:["sort(A)","left = 0, right = n - 1","while left <= right","    mid = floor((left + right) / 2)","    if A[mid] == target return mid","    if A[mid] < target left = mid + 1","    else right = mid - 1"],
  
  cx:["O(1)","O(log n)","O(log n)","O(1)"]
},

 bfs:{name:"Breadth-First Search (BFS)",desc:"BFS explores a graph level by level. It uses a queue and visits all immediate neighbors before moving farther away.",
  
  steps:["Start from the first node.","Mark it visited and put it in a queue.","Remove the front node from the queue.","Visit each unvisited neighbor and enqueue it.","Continue until the queue is empty."],
  
  code:["queue = [start]","visited = {start}","while queue is not empty","    node = dequeue(queue)","    for neighbor of node","        if neighbor not in visited","            visit neighbor","            enqueue(neighbor)"],
  
  cx:["O(V + E)","O(V + E)","O(V + E)","O(V)"]
},

 dfs:{name:"Depth-First Search (DFS)",desc:"DFS explores as far as possible along one branch before backtracking. It can be implemented using recursion or a stack.",
  
  steps:["Start from the first node.","Mark the current node visited.","Choose an unvisited neighbor.","Explore that neighbor deeply before backtracking.","Continue until every reachable node is visited."],
  
  code:["DFS(node):","    mark node visited","    for neighbor of node","        if neighbor not visited","            DFS(neighbor)"],
  
  cx:["O(V + E)","O(V + E)","O(V + E)","O(V)"]
}
};

function updateStats(){
  comparisonDisplay.textContent=comparisons;
  swapDisplay.textContent=swaps;
  passesDisplay();
}

function passesDisplay(){
  passDisplay.textContent=passes
}

function setStatus(text,type=""){
  statusBadge.textContent=text;
  statusBadge.className=`status-badge ${type}`
}

function randomArray(){
  return Array.from({length:10},()=>Math.floor(Math.random()*36)+5)
}

function renderArray(frame=frames[frameIndex]){
 container.innerHTML="";
  if(!array.length)
    return;
 const values=frame?.array || array;
 const max=Math.max(...values);
 const sorted=frame?.sorted || [];

 values.forEach((value,i)=>{const bar=document.createElement("div");

  bar.className="bar";
  bar.style.height=`${Math.max(25,(value/max)*330)}px`;
  bar.textContent=value;
  if(sorted.includes(i))bar.classList.add("sorted");
  if(frame?.compare?.includes(i))bar.classList.add("comparing");
  if(frame?.swap?.includes(i))bar.classList.add("swapping");
  if(frame?.found===i)bar.classList.add("found");
  if(frame?.failed?.includes(i))bar.classList.add("failed");
  container.appendChild(bar);
 });
}


function renderGraph(frame={}) {
    graphContainer.innerHTML="";

    const positions=[
        {x:15,y:35},
        {x:42,y:12},
        {x:70,y:35},
        {x:28,y:72},
        {x:58,y:72},
        {x:84,y:70}
    ];

    const edges=[
        [0,1],
        [0,3],
        [1,2],
        [1,4],
        [2,5],
        [3,4],
        [4,5]
    ];

    const visited=frame.visited||graphVisited;
    const current=frame.current??graphCurrent;

    edges.forEach(([a,b])=>{
        const e=document.createElement("div");
        e.className="graph-edge";

        const dx=positions[b].x-positions[a].x;
        const dy=positions[b].y-positions[a].y;

        const len=Math.sqrt(dx*dx+dy*dy)*3.7;

        e.style.width=`${len}px`;
        e.style.left=`${positions[a].x}%`;
        e.style.top=`${positions[a].y}%`;

        e.style.transform=
            `rotate(${Math.atan2(dy,dx)*180/Math.PI}deg)`;

        if(visited.includes(a)&&visited.includes(b))
            e.classList.add("active");

        graphContainer.appendChild(e);
    });

    positions.forEach((p,i)=>{
        const n=document.createElement("div");

        n.className="graph-node";
        n.textContent=String.fromCharCode(65+i);

        n.style.left=`calc(${p.x}% - 24px)`;
        n.style.top=`calc(${p.y}% - 24px)`;

        if(visited.includes(i))
            n.classList.add("visited");

        if(i===current)
            n.classList.add("current");

        graphContainer.appendChild(n);
    });
}

 
 


function updateInfo(activeLine=-1){const a=algorithms[currentAlgorithm];title.textContent=a.name;infoTitle.textContent=a.name;infoDescription.textContent=a.desc;infoSteps.innerHTML=a.steps.map(s=>`<li>${s}</li>`).join("");infoPseudocode.innerHTML=a.code.map((line,i)=>`<span class="code-line ${i===activeLine?'active-line':''}">${line}</span>`).join("");const labels=["Best Case","Average Case","Worst Case","Space"];complexity.innerHTML=a.cx.map((v,i)=>`<div><span>${labels[i]}</span><strong>${v}</strong></div>`).join("")}
function updateExecution(frame){if(!frame){operationText.textContent="Ready to begin";variablesText.textContent="—";stepText.textContent="0 / 0";updateInfo(-1);return}
 operationText.textContent=frame.operation||"Processing";variablesText.textContent=frame.variables||"—";stepText.textContent=`${frameIndex+1} / ${frames.length}`;updateInfo(frame.line??-1);comparisons=frame.comparisons??0;swaps=frame.swaps??0;passes=frame.passes??0;updateStats();renderArray(frame);if(frame.graph)renderGraph(frame.graph)
}
function makeFrame(state){return JSON.parse(JSON.stringify(state))}


function pushFrame(list,state){list.push(makeFrame(state))}

function buildSortFrames(type){
 let a=[...array],list=[];let c=0,s=0,p=0;const sorted=[];pushFrame(list,{array:a,sorted,operation:"Ready — press Start or Step Forward",variables:"—",line:-1,comparisons:c,swaps:s,passes:p});
 if(type==="bubble"){
  for(let i=0;i<a.length;i++){let swapped=false;for(let j=0;j<a.length-i-1;j++){c++;pushFrame(list,{array:a,sorted:[...Array(i).keys()].map(k=>a.length-1-k),compare:[j,j+1],operation:`Compare ${a[j]} and ${a[j+1]}`,variables:`i = ${i}, j = ${j}`,line:3,comparisons:c,swaps:s,passes:p});if(a[j]>a[j+1]){s++;swapped=true;pushFrame(list,{array:a,sorted:[],swap:[j,j+1],operation:`Swap ${a[j]} and ${a[j+1]}`,variables:`i = ${i}, j = ${j}`,line:4,comparisons:c,swaps:s,passes:p});[a[j],a[j+1]]=[a[j+1],a[j]];pushFrame(list,{array:a,sorted:[],operation:"Array updated after swap",variables:`i = ${i}, j = ${j}`,line:5,comparisons:c,swaps:s,passes:p})}}p++;const done=Array.from({length:i+1},(_,k)=>a.length-1-k);pushFrame(list,{array:a,sorted:done,operation:`Pass ${p} complete`,variables:`i = ${i}`,line:6,comparisons:c,swaps:s,passes:p});if(!swapped)break}
  pushFrame(list,{array:a,sorted:a.map((_,i)=>i),operation:"Bubble Sort complete",variables:"All elements sorted",line:-1,comparisons:c,swaps:s,passes:p});
 } else if(type==="selection"){
  for(let i=0;i<a.length-1;i++){let min=i;for(let j=i+1;j<a.length;j++){c++;pushFrame(list,{array:a,sorted:Array.from({length:i},(_,k)=>k),compare:[j,min],operation:`Compare ${a[j]} with current minimum ${a[min]}`,variables:`i = ${i}, j = ${j}, min = ${min}`,line:3,comparisons:c,swaps:s,passes:p});if(a[j]<a[min]){min=j;pushFrame(list,{array:a,sorted:Array.from({length:i},(_,k)=>k),compare:[j],operation:`New minimum found: ${a[min]}`,variables:`i = ${i}, j = ${j}, min = ${min}`,line:4,comparisons:c,swaps:s,passes:p})}}if(min!==i){s++;pushFrame(list,{array:a,sorted:Array.from({length:i},(_,k)=>k),swap:[i,min],operation:`Swap ${a[i]} with minimum ${a[min]}`,variables:`i = ${i}, min = ${min}`,line:5,comparisons:c,swaps:s,passes:p});[a[i],a[min]]=[a[min],a[i]]}p++;pushFrame(list,{array:a,sorted:Array.from({length:i+1},(_,k)=>k),operation:`Position ${i} fixed`,variables:`i = ${i}`,line:5,comparisons:c,swaps:s,passes:p})}pushFrame(list,{array:a,sorted:a.map((_,i)=>i),operation:"Selection Sort complete",variables:"All elements sorted",line:-1,comparisons:c,swaps:s,passes:p})
 } else {
  for(let i=1;i<a.length;i++){let key=a[i],j=i-1;pushFrame(list,{array:a,sorted:Array.from({length:i},(_,k)=>k),compare:[i],operation:`Pick ${key} as key`,variables:`i = ${i}, key = ${key}, j = ${j}`,line:1,comparisons:c,swaps:s,passes:p});while(j>=0&&a[j]>key){c++;s++;pushFrame(list,{array:a,sorted:Array.from({length:i},(_,k)=>k),compare:[j,i],operation:`Shift ${a[j]} right`,variables:`i = ${i}, key = ${key}, j = ${j}`,line:4,comparisons:c,swaps:s,passes:p});a[j+1]=a[j];j--;pushFrame(list,{array:a,sorted:Array.from({length:i},(_,k)=>k),operation:"Shift applied",variables:`i = ${i}, key = ${key}, j = ${j}`,line:5,comparisons:c,swaps:s,passes:p})}a[j+1]=key;p++;pushFrame(list,{array:a,sorted:Array.from({length:i+1},(_,k)=>k),operation:`Inserted ${key} into sorted section`,variables:`i = ${i}, key = ${key}, j = ${j}`,line:6,comparisons:c,swaps:s,passes:p})}pushFrame(list,{array:a,sorted:a.map((_,i)=>i),operation:"Insertion Sort complete",variables:"All elements sorted",line:-1,comparisons:c,swaps:s,passes:p})
 }
 return list
}


function buildSearchFrames(type){let a=type==="binary"?[...array].sort((x,y)=>x-y):[...array],list=[];let c=0,p=0;const target=Number(searchValue.value);pushFrame(list,{array:a,operation:type==="binary"?"Array sorted for Binary Search":"Ready for Linear Search",variables:`target = ${target}`,line:0,comparisons:c,passes:p});
 if(type==="linear"){for(let i=0;i<a.length;i++){c++;p++;pushFrame(list,{array:a,compare:[i],operation:`Check ${a[i]} against target ${target}`,variables:`i = ${i}, target = ${target}`,line:1,comparisons:c,passes:p});if(a[i]===target){pushFrame(list,{array:a,found:i,operation:`Target ${target} found at index ${i}`,variables:`i = ${i}`,line:2,comparisons:c,passes:p});return list}}pushFrame(list,{array:a,failed:a.map((_,i)=>i),operation:`Target ${target} not found`,variables:`target = ${target}`,line:3,comparisons:c,passes:p});return list}
 let left=0,right=a.length-1;while(left<=right){let mid=Math.floor((left+right)/2);c++;p++;pushFrame(list,{array:a,compare:[mid],operation:`Check middle value ${a[mid]}`,variables:`left = ${left}, mid = ${mid}, right = ${right}`,line:3,comparisons:c,passes:p});if(a[mid]===target){pushFrame(list,{array:a,found:mid,operation:`Target ${target} found at index ${mid}`,variables:`left = ${left}, mid = ${mid}, right = ${right}`,line:4,comparisons:c,passes:p});return list}if(a[mid]<target){left=mid+1;pushFrame(list,{array:a,operation:`Target is larger — move left to ${left}`,variables:`left = ${left}, mid = ${mid}, right = ${right}`,line:5,comparisons:c,passes:p})}else{right=mid-1;pushFrame(list,{array:a,operation:`Target is smaller — move right to ${right}`,variables:`left = ${left}, mid = ${mid}, right = ${right}`,line:6,comparisons:c,passes:p})}}pushFrame(list,{array:a,failed:a.map((_,i)=>i),operation:`Target ${target} not found`,variables:`left = ${left}, right = ${right}`,line:6,comparisons:c,passes:p});return list}


const graphAdj=[[1,3],[0,2,4],[1,5],[0,4],[1,3,5],[2,4]];


function buildGraphFrames(type){let list=[],visited=[],stack=[0],seen=new Set(),c=0,p=0;pushFrame(list,{graph:{visited:[],current:-1},operation:`Start ${type.toUpperCase()} at node A`,variables:"start = A",line:0,comparisons:0,passes:0});while(stack.length){let node=type==="bfs"?stack.shift():stack.pop();if(seen.has(node))continue;seen.add(node);visited=[...seen].sort((a,b)=>a-b);p++;pushFrame(list,{graph:{visited,current:node},operation:`Visit node ${String.fromCharCode(65+node)}`,variables:`current = ${String.fromCharCode(65+node)}`,line:type==="bfs"?3:1,comparisons:c,passes:p});for(const n of graphAdj[node]){c++;if(!seen.has(n)){stack.push(n);pushFrame(list,{graph:{visited,current:node},operation:`Discover ${String.fromCharCode(65+n)} from ${String.fromCharCode(65+node)}`,variables:`current = ${String.fromCharCode(65+node)}, neighbor = ${String.fromCharCode(65+n)}`,line:type==="bfs"?5:3,comparisons:c,passes:p})}}}pushFrame(list,{graph:{visited,current:-1},operation:`${type.toUpperCase()} complete`,variables:"All reachable nodes visited",line:-1,comparisons:c,passes:p});return list}


function buildFrames(){frames=currentAlgorithm.includes("sort")?buildSortFrames(currentAlgorithm.replace(" Sort","")):currentAlgorithm==="bubble"?buildSortFrames("bubble"):currentAlgorithm==="selection"?buildSortFrames("selection"):currentAlgorithm==="insertion"?buildSortFrames("insertion"):currentAlgorithm==="linear"||currentAlgorithm==="binary"?buildSearchFrames(currentAlgorithm):buildGraphFrames(currentAlgorithm);frameIndex=0;updateExecution(frames[0]);}


function applyFrame(i){frameIndex=Math.max(0,Math.min(i,frames.length-1));updateExecution(frames[frameIndex]);if(frameIndex===frames.length-1)setStatus("Complete","done");else if(frameIndex>0)setStatus("Paused","running");else setStatus("Ready")}


async function play(){if(isPlaying)return;if(!frames.length)buildFrames();isPlaying=true;setStatus("Running","running");startButton.disabled=true;while(isPlaying&&frameIndex<frames.length-1){await new Promise(r=>setTimeout(r,animationSpeed));if(!isPlaying)break;applyFrame(frameIndex+1)}if(frameIndex>=frames.length-1){isPlaying=false;setStatus("Complete","done")}else if(!isPlaying)setStatus("Paused","running");startButton.disabled=false}


function pause(){isPlaying=false;setStatus("Paused","running");startButton.disabled=false}


function resetVisualization(){pause();resetStats();frames=[];frameIndex=0;array=currentAlgorithm==="binary"?[4,8,13,19,24,29,34,41,45,49]:[5,3,8,4,2,9,7,1,6,10];graphVisited=[];graphCurrent=-1;renderArray();renderGraph();updateExecution();setStatus("Ready")}


function generateData(){pause();resetStats();frames=[];frameIndex=0;if(currentAlgorithm==="binary")array=randomArray().sort((a,b)=>a-b);else if(currentAlgorithm!=="bfs"&&currentAlgorithm!=="dfs")array=randomArray();renderArray();renderGraph();updateExecution();setStatus("Ready")}


function setAlgorithm(name){pause();currentAlgorithm=name;algoButtons.forEach(b=>b.classList.toggle("active",b.dataset.algorithm===name));updateInfo(-1);searchWrap.classList.toggle("hidden",!(name==="linear"||name==="binary"));const graph=name==="bfs"||name==="dfs";container.classList.toggle("hidden",graph);graphContainer.classList.toggle("hidden",!graph);array=name==="binary"?[4,8,13,19,24,29,34,41,45,49]:[5,3,8,4,2,9,7,1,6,10];frames=[];frameIndex=0;resetStats();renderArray();renderGraph();updateExecution();setStatus("Ready")}

startButton.addEventListener("click",()=>{if(frameIndex>=frames.length-1||!frames.length)buildFrames();play()});
pauseButton.addEventListener("click",pause);
prevButton.addEventListener("click",()=>{pause();applyFrame(frameIndex-1)});
nextButton.addEventListener("click",()=>{pause();if(!frames.length)buildFrames();applyFrame(frameIndex+1)});
generateButton.addEventListener("click",generateData);resetButton.addEventListener("click",resetVisualization);
speedSlider.addEventListener("input",()=>{animationSpeed=Number(speedSlider.value);speedValue.textContent=`${animationSpeed} ms`});
algoButtons.forEach(b=>b.addEventListener("click",()=>setAlgorithm(b.dataset.algorithm)));
searchValue.addEventListener("change",()=>{if(!isPlaying&&frames.length)buildFrames()});
updateInfo();renderArray();renderGraph();updateExecution();
