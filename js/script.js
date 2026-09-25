const container = document.getElementById("array-container");
const graphContainer = document.getElementById("graph-container");
const graphSvg = document.getElementById("graph-svg");
const svgEdges = document.getElementById("svg-edges");
const svgTempEdge = document.getElementById("svg-temp-edge");
const svgNodes = document.getElementById("svg-nodes");
const graphHint = document.getElementById("graph-hint");
const graphStartSelect = document.getElementById("graph-start-select");
const graphRandomBtn = document.getElementById("graph-random-btn");
const graphClearBtn = document.getElementById("graph-clear-btn");
const graphToolButtons = [...document.querySelectorAll(".graph-tool-btn")];

const generateButton = document.getElementById("generate-btn");
const startButton = document.getElementById("start-btn");
const pauseButton = document.getElementById("pause-btn");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const resetButton = document.getElementById("reset-btn");

const speedSlider = document.getElementById("speed");
const speedValue = document.getElementById("speed-value");

const searchWrap = document.getElementById("search-input-wrap");
const searchValue = document.getElementById("search-value");

const title = document.getElementById("algorithm-title");
const statusBadge = document.getElementById("status-badge");

const infoTitle = document.getElementById("info-title");
const infoDescription = document.getElementById("info-description");
const infoSteps = document.getElementById("info-steps");
const infoPseudocode = document.getElementById("info-pseudocode");
const complexity = document.getElementById("complexity");

const comparisonDisplay = document.getElementById("comparisons");
const swapDisplay = document.getElementById("swaps");
const passDisplay = document.getElementById("passes");
const operationText = document.getElementById("operation-text");
const variablesText = document.getElementById("variables-text");
const stepText = document.getElementById("step-text");

const stat1Title = document.getElementById("stat-1-title");
const stat2Title = document.getElementById("stat-2-title");
const stat3Title = document.getElementById("stat-3-title");

const algoButtons = [...document.querySelectorAll(".algo-btn")];

let array = [5, 3, 8, 4, 2, 9, 7, 1, 6, 10];
let currentAlgorithm = "bubble";
let animationSpeed = 500;
let isPlaying = false;
let frames = [];
let frameIndex = 0;
let comparisons = 0, swaps = 0, passes = 0;

const DEFAULT_GRAPH_NODES = [
  { id: 0, label: "A", x: 130, y: 160 },
  { id: 1, label: "B", x: 270, y: 85 },
  { id: 2, label: "C", x: 270, y: 275 },
  { id: 3, label: "D", x: 450, y: 85 },
  { id: 4, label: "E", x: 450, y: 275 },
  { id: 5, label: "F", x: 600, y: 180 },
  { id: 6, label: "G", x: 720, y: 180 }
];

const DEFAULT_GRAPH_EDGES = [
  { u: 0, v: 1 },
  { u: 0, v: 2 },
  { u: 1, v: 3 },
  { u: 2, v: 4 },
  { u: 3, v: 4 },
  { u: 3, v: 5 },
  { u: 4, v: 5 },
  { u: 5, v: 6 }
];

let graphNodes = JSON.parse(JSON.stringify(DEFAULT_GRAPH_NODES));
let graphEdges = JSON.parse(JSON.stringify(DEFAULT_GRAPH_EDGES));
let startNodeId = 0;
let nextNodeId = 7;
let graphMode = "drag";
let edgeSourceNodeId = null;
let draggingNodeId = null;
let dragOffset = { x: 0, y: 0 };
let hasMovedDuringDrag = false;

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

function resetStats() {
  comparisons = 0;
  swaps = 0;
  passes = 0;
  updateStats();
}

function updateStats() {
  comparisonDisplay.textContent = comparisons;
  swapDisplay.textContent = swaps;
  passesDisplay();
}

function passesDisplay() {
  passDisplay.textContent = passes;
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
// -------------------------------------------------------------
// Graph Helper Functions
// -------------------------------------------------------------
function getEdgeKey(u, v) {
  return Math.min(u, v) + "-" + Math.max(u, v);
}

function getNode(id) {
  return graphNodes.find(n => n.id === id);
}

function getNodeLabel(id) {
  return getNode(id)?.label || String(id);
}

function getNeighbors(nodeId) {
  const neighbors = [];
  for (const edge of graphEdges) {
    if (edge.u === nodeId) neighbors.push(edge.v);
    else if (edge.v === nodeId) neighbors.push(edge.u);
  }
  return neighbors.sort((a, b) => getNodeLabel(a).localeCompare(getNodeLabel(b)));
}

function getAvailableLabel() {
  const used = new Set(graphNodes.map(n => n.label));
  for (let i = 0; i < 26; i++) {
    const char = String.fromCharCode(65 + i);
    if (!used.has(char)) return char;
  }
  for (let i = 1; i <= 99; i++) {
    const label = "N" + i;
    if (!used.has(label)) return label;
  }
  return "N" + (graphNodes.length + 1);
}

function updateHint(text) {
  if (graphHint) graphHint.textContent = text;
}

function populateStartSelect() {
  if (!graphStartSelect) return;
  graphStartSelect.innerHTML = "";
  graphNodes.forEach(node => {
    const opt = document.createElement("option");
    opt.value = node.id;
    opt.textContent = `Node ${node.label}`;
    if (node.id === startNodeId) opt.selected = true;
    graphStartSelect.appendChild(opt);
  });
}

function getSvgCoordinates(evt) {
  const pt = graphSvg.createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  const ctm = graphSvg.getScreenCTM();
  if (!ctm) return { x: 400, y: 220 };
  const local = pt.matrixTransform(ctm.inverse());
  return {
    x: Math.max(35, Math.min(765, Math.round(local.x))),
    y: Math.max(35, Math.min(405, Math.round(local.y)))
  };
}

// -------------------------------------------------------------
// SVG Graph Rendering
// -------------------------------------------------------------
function renderGraph(frame = null) {
  if (!svgEdges || !svgNodes) return;
  svgEdges.innerHTML = "";
  svgNodes.innerHTML = "";
  if (svgTempEdge) svgTempEdge.innerHTML = "";

  const nodeStates = frame?.nodeStates || {};
  const edgeStates = frame?.edgeStates || {};

  // Render edges
  graphEdges.forEach(edge => {
    const uNode = getNode(edge.u);
    const vNode = getNode(edge.v);
    if (!uNode || !vNode) return;

    const edgeKey = getEdgeKey(edge.u, edge.v);
    const state = edgeStates[edgeKey] || "normal";

    const hitLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    hitLine.setAttribute("x1", uNode.x);
    hitLine.setAttribute("y1", uNode.y);
    hitLine.setAttribute("x2", vNode.x);
    hitLine.setAttribute("y2", vNode.y);
    hitLine.setAttribute("class", "graph-edge-hitarea");
    hitLine.addEventListener("click", e => {
      e.stopPropagation();
      if (graphMode === "delete") {
        graphEdges = graphEdges.filter(ge => !(ge.u === edge.u && ge.v === edge.v) && !(ge.u === edge.v && ge.v === edge.u));
        frames = [];
        frameIndex = 0;
        renderGraph();
        updateHint(`Deleted edge between ${uNode.label} and ${vNode.label}.`);
      }
    });

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", uNode.x);
    line.setAttribute("y1", uNode.y);
    line.setAttribute("x2", vNode.x);
    line.setAttribute("y2", vNode.y);
    line.setAttribute("id", `edge-${edgeKey}`);

    let edgeClass = "graph-edge";
    if (state === "traversed") edgeClass += " traversed";
    else if (state === "exploring") edgeClass += " exploring";
    line.setAttribute("class", edgeClass);

    svgEdges.appendChild(hitLine);
    svgEdges.appendChild(line);
  });

  // Render nodes
  graphNodes.forEach(node => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "graph-node-group");
    g.setAttribute("id", `node-${node.id}`);
    g.setAttribute("transform", `translate(${node.x}, ${node.y})`);

    if (edgeSourceNodeId === node.id) {
      g.classList.add("connecting-source");
    }

    const isStart = node.id === startNodeId;
    const state = nodeStates[node.id] || (isStart ? "start" : "normal");

    if (isStart) {
      const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      ring.setAttribute("class", "node-start-ring");
      ring.setAttribute("r", "28");
      g.appendChild(ring);

      const badge = document.createElementNS("http://www.w3.org/2000/svg", "text");
      badge.setAttribute("class", "node-badge-text");
      badge.setAttribute("y", "-31");
      badge.textContent = "START";
      g.appendChild(badge);
    }

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", "22");

    let circleClass = "node-circle";
    if (state === "current") circleClass += " current";
    else if (state === "exploring") circleClass += " exploring";
    else if (state === "queued") circleClass += " queued";
    else if (state === "visited") circleClass += " visited";
    circle.setAttribute("class", circleClass);
    g.appendChild(circle);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("class", "node-label");
    text.textContent = node.label;
    g.appendChild(text);

    attachNodeEvents(g, node);
    svgNodes.appendChild(g);
  });
}

function attachNodeEvents(groupElement, node) {
  groupElement.addEventListener("pointerdown", e => {
    if (graphMode === "drag") {
      draggingNodeId = node.id;
      hasMovedDuringDrag = false;
      const pt = getSvgCoordinates(e);
      dragOffset = { x: pt.x - node.x, y: pt.y - node.y };
      groupElement.classList.add("dragging");
      groupElement.setPointerCapture?.(e.pointerId);
    }
  });

  groupElement.addEventListener("click", e => {
    e.stopPropagation();
    if (hasMovedDuringDrag) {
      hasMovedDuringDrag = false;
      return;
    }

    if (graphMode === "set-start") {
      startNodeId = node.id;
      if (graphStartSelect) graphStartSelect.value = node.id;
      frames = [];
      frameIndex = 0;
      renderGraph();
      updateHint(`Start node set to ${node.label}.`);
    } else if (graphMode === "add-edge") {
      if (edgeSourceNodeId === null) {
        edgeSourceNodeId = node.id;
        updateHint(`Selected node ${node.label}. Now click second node to connect edge.`);
        renderGraph();
      } else if (edgeSourceNodeId === node.id) {
        edgeSourceNodeId = null;
        updateHint("Cancelled edge connection.");
        renderGraph();
      } else {
        const exists = graphEdges.some(
          ge => (ge.u === edgeSourceNodeId && ge.v === node.id) || (ge.u === node.id && ge.v === edgeSourceNodeId)
        );
        if (!exists) {
          graphEdges.push({ u: edgeSourceNodeId, v: node.id });
          updateHint(`Connected node ${getNodeLabel(edgeSourceNodeId)} and ${node.label}.`);
        } else {
          updateHint(`Edge already exists between ${getNodeLabel(edgeSourceNodeId)} and ${node.label}.`);
        }
        edgeSourceNodeId = null;
        frames = [];
        frameIndex = 0;
        renderGraph();
      }
    } else if (graphMode === "delete") {
      if (graphNodes.length <= 1) {
        updateHint("Cannot delete the last node. Graph must have at least 1 node.");
        return;
      }
      graphNodes = graphNodes.filter(n => n.id !== node.id);
      graphEdges = graphEdges.filter(ge => ge.u !== node.id && ge.v !== node.id);
      if (startNodeId === node.id) {
        startNodeId = graphNodes[0].id;
      }
      populateStartSelect();
      frames = [];
      frameIndex = 0;
      renderGraph();
      updateHint(`Deleted node ${node.label}.`);
    } else if (graphMode === "drag") {
      startNodeId = node.id;
      if (graphStartSelect) graphStartSelect.value = node.id;
      frames = [];
      frameIndex = 0;
      renderGraph();
      updateHint(`Start node set to ${node.label}. Drag node to reposition.`);
    }
  });
}

// Global SVG pointer events for dragging
graphSvg.addEventListener("pointermove", e => {
  if (draggingNodeId !== null) {
    hasMovedDuringDrag = true;
    const pt = getSvgCoordinates(e);
    const node = getNode(draggingNodeId);
    if (!node) return;

    node.x = Math.max(35, Math.min(765, pt.x - dragOffset.x));
    node.y = Math.max(35, Math.min(405, pt.y - dragOffset.y));

    const nodeGroup = document.getElementById(`node-${node.id}`);
    if (nodeGroup) {
      nodeGroup.setAttribute("transform", `translate(${node.x}, ${node.y})`);
    }

    graphEdges.forEach(edge => {
      if (edge.u === node.id || edge.v === node.id) {
        const uNode = getNode(edge.u);
        const vNode = getNode(edge.v);
        if (uNode && vNode) {
          const edgeKey = getEdgeKey(edge.u, edge.v);
          const line = document.getElementById(`edge-${edgeKey}`);
          if (line) {
            line.setAttribute("x1", uNode.x);
            line.setAttribute("y1", uNode.y);
            line.setAttribute("x2", vNode.x);
            line.setAttribute("y2", vNode.y);
          }
        }
      }
    });
  }
});

function finishDrag() {
  if (draggingNodeId !== null) {
    const nodeGroup = document.getElementById(`node-${draggingNodeId}`);
    if (nodeGroup) nodeGroup.classList.remove("dragging");
    draggingNodeId = null;
    frames = [];
    frameIndex = 0;
    renderGraph();
  }
}

window.addEventListener("pointerup", finishDrag);
window.addEventListener("pointercancel", finishDrag);

graphSvg.addEventListener("click", e => {
  if (e.target !== graphSvg && e.target.id !== "svg-edges" && e.target.id !== "svg-nodes") {
    return;
  }

  if (graphMode === "add-node") {
    const pt = getSvgCoordinates(e);
    const tooClose = graphNodes.some(n => Math.hypot(n.x - pt.x, n.y - pt.y) < 55);
    if (tooClose) {
      updateHint("Too close to another node. Please choose an open area.");
      return;
    }
    const label = getAvailableLabel();
    const newId = nextNodeId++;
    graphNodes.push({ id: newId, label, x: pt.x, y: pt.y });
    populateStartSelect();
    frames = [];
    frameIndex = 0;
    renderGraph();
    updateHint(`Added node ${label}. Connect edges using "+ Edge" mode.`);
  } else if (edgeSourceNodeId !== null) {
    edgeSourceNodeId = null;
    updateHint("Cancelled edge connection.");
    renderGraph();
  }
});

function generateRandomGraph() {
  pause();
  resetStats();
  frames = [];
  frameIndex = 0;

  const count = Math.floor(Math.random() * 3) + 6;
  graphNodes = [];
  graphEdges = [];

  const cx = 400, cy = 220;
  const rx = 290, ry = 145;

  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count + (Math.random() * 0.3 - 0.15);
    const rFactor = 0.82 + Math.random() * 0.28;
    const x = Math.round(cx + rx * rFactor * Math.cos(angle));
    const y = Math.round(cy + ry * rFactor * Math.sin(angle));
    graphNodes.push({
      id: i,
      label: String.fromCharCode(65 + i),
      x: Math.max(50, Math.min(750, x)),
      y: Math.max(50, Math.min(390, y))
    });
  }

  const connected = [0];
  const remaining = Array.from({ length: count - 1 }, (_, i) => i + 1);

  while (remaining.length > 0) {
    const u = connected[Math.floor(Math.random() * connected.length)];
    const remIndex = Math.floor(Math.random() * remaining.length);
    const v = remaining.splice(remIndex, 1)[0];
    graphEdges.push({ u, v });
    connected.push(v);
  }

  const extraEdges = Math.floor(Math.random() * 3) + 2;
  for (let k = 0; k < extraEdges; k++) {
    const u = Math.floor(Math.random() * count);
    const v = Math.floor(Math.random() * count);
    if (u !== v && !graphEdges.some(e => (e.u === u && e.v === v) || (e.u === v && e.v === u))) {
      graphEdges.push({ u, v });
    }
  }

  startNodeId = 0;
  nextNodeId = count;
  populateStartSelect();
  renderGraph();
  updateExecution();
  setStatus("Ready");
  updateHint(`Generated random connected graph with ${count} nodes.`);
}

function updateInfo(activeLine = -1) {
  const a = algorithms[currentAlgorithm];
  title.textContent = a.name;
  infoTitle.textContent = a.name;
  infoDescription.textContent = a.desc;
  infoSteps.innerHTML = a.steps.map(s => `<li>${s}</li>`).join("");
  infoPseudocode.innerHTML = a.code
    .map((line, i) => `<span class="code-line ${i === activeLine ? "active-line" : ""}">${line}</span>`)
    .join("");
  const labels = ["Best Case", "Average Case", "Worst Case", "Space"];
  complexity.innerHTML = a.cx.map((v, i) => `<div><span>${labels[i]}</span><strong>${v}</strong></div>`).join("");
}

function updateExecution(frame) {
  if (!frame) {
    operationText.textContent = "Ready to begin";
    variablesText.textContent = "—";
    stepText.textContent = "0 / 0";
    updateInfo(-1);
    return;
  }
  operationText.textContent = frame.operation || "Processing";
  variablesText.textContent = frame.variables || "—";
  stepText.textContent = `${frameIndex + 1} / ${frames.length}`;
  updateInfo(frame.line ?? -1);
  comparisons = frame.comparisons ?? 0;
  swaps = frame.swaps ?? 0;
  passes = frame.passes ?? 0;
  updateStats();

  if (currentAlgorithm === "bfs" || currentAlgorithm === "dfs") {
    renderGraph(frame.graph);
  } else {
    renderArray(frame);
  }
}

function makeFrame(state) {
  return JSON.parse(JSON.stringify(state));
}


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


// -------------------------------------------------------------
// BFS & DFS Frame Generators
// -------------------------------------------------------------
function buildBFSFrames() {
  const list = [];
  const startNode = getNode(startNodeId) || graphNodes[0];
  if (!startNode) return list;

  const nodeStates = {};
  const edgeStates = {};
  graphNodes.forEach(n => {
    nodeStates[n.id] = n.id === startNode.id ? "start" : "normal";
  });
  graphEdges.forEach(e => {
    edgeStates[getEdgeKey(e.u, e.v)] = "normal";
  });

  let edgeChecks = 0;
  let visitedCount = 0;
  let step = 0;

  pushFrame(list, {
    graph: {
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates }
    },
    operation: `Initialize BFS at Start Node ${startNode.label}. Queue is empty.`,
    variables: `Queue: [] | Visited: []`,
    line: 0,
    comparisons: edgeChecks,
    swaps: visitedCount,
    passes: step
  });

  const queue = [startNode.id];
  const inQueue = new Set([startNode.id]);
  const visited = new Set();
  nodeStates[startNode.id] = "queued";

  step++;
  pushFrame(list, {
    graph: {
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates }
    },
    operation: `Enqueued start node ${startNode.label} (Queued: Violet).`,
    variables: `Queue: [${startNode.label}] | Visited: []`,
    line: 0,
    comparisons: edgeChecks,
    swaps: visitedCount,
    passes: step
  });

  while (queue.length > 0) {
    const u = queue.shift();
    inQueue.delete(u);
    visited.add(u);
    visitedCount++;
    nodeStates[u] = "current";

    step++;
    pushFrame(list, {
      graph: {
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates }
      },
      operation: `Dequeued node ${getNodeLabel(u)} (Current: Cyan). Inspecting adjacent edges.`,
      variables: `Current: ${getNodeLabel(u)} | Queue: [${queue.map(id => getNodeLabel(id)).join(", ")}] | Visited: [${Array.from(visited).map(id => getNodeLabel(id)).join(", ")}]`,
      line: 3,
      comparisons: edgeChecks,
      swaps: visitedCount,
      passes: step
    });

    const neighbors = getNeighbors(u);
    for (const v of neighbors) {
      edgeChecks++;
      const edgeKey = getEdgeKey(u, v);
      const isVisited = visited.has(v);
      const isQueued = inQueue.has(v);

      const prevEdgeState = edgeStates[edgeKey];
      const prevVState = nodeStates[v];

      edgeStates[edgeKey] = "exploring";
      if (!isVisited && !isQueued) {
        nodeStates[v] = "exploring";
      }

      step++;
      pushFrame(list, {
        graph: {
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates }
        },
        operation: `Checking edge (${getNodeLabel(u)}, ${getNodeLabel(v)}). Neighbor ${getNodeLabel(v)} is Exploring (Amber).`,
        variables: `Examining edge: ${getNodeLabel(u)} -> ${getNodeLabel(v)} | Queue: [${queue.map(id => getNodeLabel(id)).join(", ")}]`,
        line: 4,
        comparisons: edgeChecks,
        swaps: visitedCount,
        passes: step
      });

      if (!isVisited && !isQueued) {
        queue.push(v);
        inQueue.add(v);
        nodeStates[v] = "queued";
        edgeStates[edgeKey] = "traversed";

        step++;
        pushFrame(list, {
          graph: {
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates }
          },
          operation: `Neighbor ${getNodeLabel(v)} is unvisited. Enqueued ${getNodeLabel(v)} (Queued: Violet), marked edge as Traversed (Magenta).`,
          variables: `Queue: [${queue.map(id => getNodeLabel(id)).join(", ")}] | Visited: [${Array.from(visited).map(id => getNodeLabel(id)).join(", ")}]`,
          line: 6,
          comparisons: edgeChecks,
          swaps: visitedCount,
          passes: step
        });
      } else {
        edgeStates[edgeKey] = prevEdgeState === "traversed" ? "traversed" : "normal";
        nodeStates[v] = prevVState;

        step++;
        pushFrame(list, {
          graph: {
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates }
          },
          operation: `Neighbor ${getNodeLabel(v)} already ${isVisited ? "visited" : "in queue"}. Skip edge.`,
          variables: `Queue: [${queue.map(id => getNodeLabel(id)).join(", ")}] | Visited: [${Array.from(visited).map(id => getNodeLabel(id)).join(", ")}]`,
          line: 5,
          comparisons: edgeChecks,
          swaps: visitedCount,
          passes: step
        });
      }
    }

    nodeStates[u] = "visited";
    step++;
    pushFrame(list, {
      graph: {
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates }
      },
      operation: `Finished all neighbors of node ${getNodeLabel(u)}. Node marked as Visited (Green).`,
      variables: `Queue: [${queue.map(id => getNodeLabel(id)).join(", ")}] | Visited: [${Array.from(visited).map(id => getNodeLabel(id)).join(", ")}]`,
      line: 2,
      comparisons: edgeChecks,
      swaps: visitedCount,
      passes: step
    });
  }

  step++;
  pushFrame(list, {
    graph: {
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates }
    },
    operation: `BFS Traversal complete! Visited ${visited.size} node${visited.size === 1 ? "" : "s"}.`,
    variables: `Queue: [] | Visited: [${Array.from(visited).map(id => getNodeLabel(id)).join(", ")}]`,
    line: -1,
    comparisons: edgeChecks,
    swaps: visitedCount,
    passes: step
  });

  return list;
}

function buildDFSFrames() {
  const list = [];
  const startNode = getNode(startNodeId) || graphNodes[0];
  if (!startNode) return list;

  const nodeStates = {};
  const edgeStates = {};
  graphNodes.forEach(n => {
    nodeStates[n.id] = n.id === startNode.id ? "start" : "normal";
  });
  graphEdges.forEach(e => {
    edgeStates[getEdgeKey(e.u, e.v)] = "normal";
  });

  let edgeChecks = 0;
  let visitedCount = 0;
  let step = 0;

  pushFrame(list, {
    graph: {
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates }
    },
    operation: `Initialize DFS at Start Node ${startNode.label}. Call stack is empty.`,
    variables: `Stack: [] | Visited: []`,
    line: 0,
    comparisons: edgeChecks,
    swaps: visitedCount,
    passes: step
  });

  const visited = new Set();
  const stack = [];

  function dfsVisit(u, parent = null) {
    stack.push(u);
    visited.add(u);
    visitedCount++;
    nodeStates[u] = "current";

    if (parent !== null) {
      edgeStates[getEdgeKey(parent, u)] = "traversed";
    }

    step++;
    pushFrame(list, {
      graph: {
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates }
      },
      operation: `Exploring node ${getNodeLabel(u)} (Current: Cyan). Added to Call Stack.`,
      variables: `Current: ${getNodeLabel(u)} | Stack: [${stack.map(id => getNodeLabel(id)).join(", ")}] | Visited: [${Array.from(visited).map(id => getNodeLabel(id)).join(", ")}]`,
      line: 1,
      comparisons: edgeChecks,
      swaps: visitedCount,
      passes: step
    });

    const neighbors = getNeighbors(u);
    for (const v of neighbors) {
      edgeChecks++;
      const edgeKey = getEdgeKey(u, v);
      const isVisited = visited.has(v);

      const prevEdgeState = edgeStates[edgeKey];
      const prevVState = nodeStates[v];

      edgeStates[edgeKey] = "exploring";
      if (!isVisited) {
        nodeStates[v] = "exploring";
      }

      step++;
      pushFrame(list, {
        graph: {
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates }
        },
        operation: `Checking edge (${getNodeLabel(u)}, ${getNodeLabel(v)}). Neighbor ${getNodeLabel(v)} is Exploring (Amber).`,
        variables: `Examining edge: ${getNodeLabel(u)} -> ${getNodeLabel(v)} | Stack: [${stack.map(id => getNodeLabel(id)).join(", ")}]`,
        line: 2,
        comparisons: edgeChecks,
        swaps: visitedCount,
        passes: step
      });

      if (!isVisited) {
        nodeStates[v] = "queued";

        step++;
        pushFrame(list, {
          graph: {
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates }
          },
          operation: `Neighbor ${getNodeLabel(v)} is unvisited. Preparing to branch into ${getNodeLabel(v)} (Queued: Violet).`,
          variables: `Branching to: ${getNodeLabel(v)} | Stack: [${stack.map(id => getNodeLabel(id)).join(", ")}]`,
          line: 3,
          comparisons: edgeChecks,
          swaps: visitedCount,
          passes: step
        });

        dfsVisit(v, u);

        nodeStates[u] = "current";
        step++;
        pushFrame(list, {
          graph: {
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates }
          },
          operation: `Backtracked to node ${getNodeLabel(u)} (Current: Cyan) from finished branch ${getNodeLabel(v)}.`,
          variables: `Current: ${getNodeLabel(u)} | Stack: [${stack.map(id => getNodeLabel(id)).join(", ")}]`,
          line: 4,
          comparisons: edgeChecks,
          swaps: visitedCount,
          passes: step
        });
      } else {
        edgeStates[edgeKey] = prevEdgeState === "traversed" ? "traversed" : "normal";
        nodeStates[v] = prevVState;

        step++;
        pushFrame(list, {
          graph: {
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates }
          },
          operation: `Neighbor ${getNodeLabel(v)} already visited. Backtracking/skipping edge (${getNodeLabel(u)}, ${getNodeLabel(v)}).`,
          variables: `Stack: [${stack.map(id => getNodeLabel(id)).join(", ")}] | Visited: [${Array.from(visited).map(id => getNodeLabel(id)).join(", ")}]`,
          line: 2,
          comparisons: edgeChecks,
          swaps: visitedCount,
          passes: step
        });
      }
    }

    nodeStates[u] = "visited";
    stack.pop();

    step++;
    pushFrame(list, {
      graph: {
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates }
      },
      operation: `Finished all branches for node ${getNodeLabel(u)}. Marked as Visited (Green) and popped from Call Stack.`,
      variables: `Stack: [${stack.map(id => getNodeLabel(id)).join(", ")}] | Visited: [${Array.from(visited).map(id => getNodeLabel(id)).join(", ")}]`,
      line: 4,
      comparisons: edgeChecks,
      swaps: visitedCount,
      passes: step
    });
  }

  dfsVisit(startNode.id);

  step++;
  pushFrame(list, {
    graph: {
      nodeStates: { ...nodeStates },
      edgeStates: { ...edgeStates }
    },
    operation: `DFS Traversal complete! Visited ${visited.size} node${visited.size === 1 ? "" : "s"}.`,
    variables: `Stack: [] | Visited: [${Array.from(visited).map(id => getNodeLabel(id)).join(", ")}]`,
    line: -1,
    comparisons: edgeChecks,
    swaps: visitedCount,
    passes: step
  });

  return list;
}

function buildFrames() {
  if (currentAlgorithm === "bfs") {
    frames = buildBFSFrames();
  } else if (currentAlgorithm === "dfs") {
    frames = buildDFSFrames();
  } else if (
    currentAlgorithm.includes("sort") ||
    currentAlgorithm === "bubble" ||
    currentAlgorithm === "selection" ||
    currentAlgorithm === "insertion"
  ) {
    frames = buildSortFrames(currentAlgorithm.replace(" Sort", ""));
  } else if (currentAlgorithm === "linear" || currentAlgorithm === "binary") {
    frames = buildSearchFrames(currentAlgorithm);
  }
  frameIndex = 0;
  if (frames.length > 0) {
    updateExecution(frames[0]);
  }
}

function applyFrame(i) {
  frameIndex = Math.max(0, Math.min(i, frames.length - 1));
  updateExecution(frames[frameIndex]);
  if (frameIndex === frames.length - 1) setStatus("Complete", "done");
  else if (frameIndex > 0) setStatus("Paused", "running");
  else setStatus("Ready");
}

async function play() {
  if (isPlaying) return;
  if (!frames.length) buildFrames();
  isPlaying = true;
  setStatus("Running", "running");
  startButton.disabled = true;

  while (isPlaying && frameIndex < frames.length - 1) {
    await new Promise(r => setTimeout(r, animationSpeed));
    if (!isPlaying) break;
    applyFrame(frameIndex + 1);
  }

  if (frameIndex >= frames.length - 1) {
    isPlaying = false;
    setStatus("Complete", "done");
  } else if (!isPlaying) {
    setStatus("Paused", "running");
  }
  startButton.disabled = false;
}

function pause() {
  isPlaying = false;
  setStatus("Paused", "running");
  startButton.disabled = false;
}

function resetVisualization() {
  pause();
  resetStats();
  frames = [];
  frameIndex = 0;

  if (currentAlgorithm === "bfs" || currentAlgorithm === "dfs") {
    renderGraph();
  } else {
    array = currentAlgorithm === "binary" ? [4, 8, 13, 19, 24, 29, 34, 41, 45, 49] : [5, 3, 8, 4, 2, 9, 7, 1, 6, 10];
    renderArray();
  }
  updateExecution();
  setStatus("Ready");
}

function generateData() {
  pause();
  resetStats();
  frames = [];
  frameIndex = 0;

  if (currentAlgorithm === "bfs" || currentAlgorithm === "dfs") {
    generateRandomGraph();
    return;
  }

  if (currentAlgorithm === "binary") {
    array = randomArray().sort((a, b) => a - b);
  } else {
    array = randomArray();
  }
  renderArray();
  updateExecution();
  setStatus("Ready");
}

function setAlgorithm(name) {
  pause();
  currentAlgorithm = name;
  algoButtons.forEach(b => b.classList.toggle("active", b.dataset.algorithm === name));
  updateInfo(-1);
  searchWrap.classList.toggle("hidden", !(name === "linear" || name === "binary"));

  const isGraph = name === "bfs" || name === "dfs";
  container.classList.toggle("hidden", isGraph);
  graphContainer.classList.toggle("hidden", !isGraph);

  if (isGraph) {
    generateButton.textContent = "Generate Random Graph";
    if (stat1Title) stat1Title.textContent = "Edge Checks";
    if (stat2Title) stat2Title.textContent = "Visited Nodes";
    if (stat3Title) stat3Title.textContent = "Steps";
    populateStartSelect();
  } else {
    generateButton.textContent = "Generate Data";
    if (stat1Title) stat1Title.textContent = "Comparisons";
    if (stat2Title) stat2Title.textContent = "Swaps";
    if (stat3Title) stat3Title.textContent = "Passes / Steps";
  }

  array = name === "binary" ? [4, 8, 13, 19, 24, 29, 34, 41, 45, 49] : [5, 3, 8, 4, 2, 9, 7, 1, 6, 10];
  frames = [];
  frameIndex = 0;
  resetStats();

  if (isGraph) {
    renderGraph();
  } else {
    renderArray();
  }
  updateExecution();
  setStatus("Ready");
}

// -------------------------------------------------------------
// Event Listeners
// -------------------------------------------------------------
startButton.addEventListener("click", () => {
  if (frameIndex >= frames.length - 1 || !frames.length) buildFrames();
  play();
});

pauseButton.addEventListener("click", pause);

prevButton.addEventListener("click", () => {
  pause();
  applyFrame(frameIndex - 1);
});

nextButton.addEventListener("click", () => {
  pause();
  if (!frames.length) buildFrames();
  applyFrame(frameIndex + 1);
});

generateButton.addEventListener("click", generateData);
resetButton.addEventListener("click", resetVisualization);

speedSlider.addEventListener("input", () => {
  animationSpeed = Number(speedSlider.value);
  speedValue.textContent = `${animationSpeed} ms`;
});

algoButtons.forEach(b => b.addEventListener("click", () => setAlgorithm(b.dataset.algorithm)));
searchValue.addEventListener("change", () => {
  if (!isPlaying && frames.length) buildFrames();
});

// Graph Toolbar Button Events
graphToolButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    graphToolButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    graphMode = btn.dataset.mode;
    edgeSourceNodeId = null;

    switch (graphMode) {
      case "drag":
        updateHint("Mode: Move & Drag nodes around the canvas. Click a node to set as Start.");
        break;
      case "add-node":
        updateHint("Mode: Click anywhere on canvas to place a new node.");
        break;
      case "add-edge":
        updateHint("Mode: Click a node to start, then click second node to connect edge.");
        break;
      case "delete":
        updateHint("Mode: Click any node or edge to delete it.");
        break;
      case "set-start":
        updateHint("Mode: Click any node to designate it as the Start node.");
        break;
    }
    renderGraph();
  });
});

if (graphStartSelect) {
  graphStartSelect.addEventListener("change", () => {
    startNodeId = Number(graphStartSelect.value);
    frames = [];
    frameIndex = 0;
    renderGraph();
    updateHint(`Start node set to ${getNodeLabel(startNodeId)}.`);
  });
}

if (graphRandomBtn) graphRandomBtn.addEventListener("click", generateRandomGraph);

if (graphClearBtn) {
  graphClearBtn.addEventListener("click", () => {
    pause();
    resetStats();
    frames = [];
    frameIndex = 0;
    graphNodes = JSON.parse(JSON.stringify(DEFAULT_GRAPH_NODES));
    graphEdges = JSON.parse(JSON.stringify(DEFAULT_GRAPH_EDGES));
    startNodeId = 0;
    populateStartSelect();
    renderGraph();
    updateExecution();
    setStatus("Ready");
    updateHint("Reset to default graph layout.");
  });
}

// Initial Initialization
updateInfo();
renderArray();
populateStartSelect();
renderGraph();
updateExecution();
