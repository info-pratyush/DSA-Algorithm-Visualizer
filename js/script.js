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

const themeToggleBtn = document.getElementById("theme-toggle");
const algoButtons = [...document.querySelectorAll(".algo-btn")];

let array = [5, 3, 8, 4, 2, 9, 7, 1, 6, 10];
let currentAlgorithm = "bubble";
let animationSpeed = 450;
let isPlaying = false;
let frames = [];
let frameIndex = 0;
let comparisons = 0, swaps = 0, passes = 0;

// Graph state
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

const algorithms = {
  bubble: {
    name: "Bubble Sort",
    desc: "Bubble Sort repeatedly compares adjacent elements and swaps them when they are in the wrong order. Larger elements gradually bubble toward the end.",
    steps: [
      "Compare two adjacent elements.",
      "Swap them if the left value is greater than the right value.",
      "Continue across the unsorted part of the array.",
      "After each pass, the largest remaining value settles in position.",
      "Repeat until no swaps occur during a pass."
    ],
    code: [
      "for i = 0 to n - 1",
      "    swapped = false",
      "    for j = 0 to n - i - 2",
      "        if A[j] > A[j + 1]",
      "            swap(A[j], A[j + 1])",
      "            swapped = true",
      "    if swapped == false: break"
    ],
    cx: ["O(n)", "O(n²)", "O(n²)", "O(1)"]
  },
  selection: {
    name: "Selection Sort",
    desc: "Selection Sort repeatedly identifies the minimum element in the unsorted section and places it at the beginning of that section.",
    steps: [
      "Start at the current unsorted boundary.",
      "Scan remaining array to find index of minimum element.",
      "Swap the minimum element with boundary position.",
      "Advance boundary index right by one position.",
      "Repeat until entire array is partitioned as sorted."
    ],
    code: [
      "for i = 0 to n - 2",
      "    minIndex = i",
      "    for j = i + 1 to n - 1",
      "        if A[j] < A[minIndex]: minIndex = j",
      "    swap(A[i], A[minIndex])"
    ],
    cx: ["O(n²)", "O(n²)", "O(n²)", "O(1)"]
  },
  insertion: {
    name: "Insertion Sort",
    desc: "Insertion Sort builds a sorted array one element at a time by repeatedly taking the next key and inserting it into its correct position among already sorted elements.",
    steps: [
      "Treat index 0 as sorted prefix.",
      "Pick current item as the insertion key.",
      "Shift larger sorted elements rightward to make space.",
      "Insert key into the newly vacated slot.",
      "Repeat for all subsequent array indices."
    ],
    code: [
      "for i = 1 to n - 1",
      "    key = A[i], j = i - 1",
      "    while j >= 0 and A[j] > key",
      "        A[j + 1] = A[j]",
      "        j = j - 1",
      "    A[j + 1] = key"
    ],
    cx: ["O(n)", "O(n²)", "O(n²)", "O(1)"]
  },
  merge: {
    name: "Merge Sort",
    desc: "Merge Sort recursively divides the array in half until single elements remain, then merges sorted subarrays back together in order.",
    steps: [
      "Divide the array into left and right halves at midpoint.",
      "Recursively apply Merge Sort to each half.",
      "Compare front elements of both sorted halves.",
      "Merge elements in ascending order into temporary buffer.",
      "Copy sorted elements back into main array slice."
    ],
    code: [
      "mergeSort(A, left, right):",
      "    if left < right:",
      "        mid = floor((left + right) / 2)",
      "        mergeSort(A, left, mid)",
      "        mergeSort(A, mid + 1, right)",
      "        merge(A, left, mid, right)"
    ],
    cx: ["O(n log n)", "O(n log n)", "O(n log n)", "O(n)"]
  },
  quick: {
    name: "Quick Sort",
    desc: "Quick Sort selects a pivot element and partitions the array such that all items less than the pivot precede all items greater than it.",
    steps: [
      "Choose a pivot value (here, the last element).",
      "Scan array and partition values relative to pivot.",
      "Swap pivot into its definitive final sorted position.",
      "Recursively invoke Quick Sort on left partition.",
      "Recursively invoke Quick Sort on right partition."
    ],
    code: [
      "quickSort(A, low, high):",
      "    if low < high:",
      "        p = partition(A, low, high)",
      "        quickSort(A, low, p - 1)",
      "        quickSort(A, p + 1, high)"
    ],
    cx: ["O(n log n)", "O(n log n)", "O(n²)", "O(log n)"]
  },
  heap: {
    name: "Heap Sort",
    desc: "Heap Sort transforms the input into a binary max-heap, then repeatedly extracts the root maximum to the end of the array and sifts down.",
    steps: [
      "Construct a Max-Heap where each parent >= children.",
      "Swap heap root (maximum) with the last element.",
      "Decrease active heap size by one.",
      "Sift down new root to restore max-heap property.",
      "Repeat until all items are moved to sorted tail."
    ],
    code: [
      "buildMaxHeap(A)",
      "for i = n - 1 down to 1:",
      "    swap(A[0], A[i])",
      "    heapify(A, i, 0)"
    ],
    cx: ["O(n log n)", "O(n log n)", "O(n log n)", "O(1)"]
  },
  counting: {
    name: "Counting Sort",
    desc: "Counting Sort tallies frequencies of distinct key values, computes prefix sums for index boundaries, and places keys directly in sorted order.",
    steps: [
      "Determine maximum key value across array.",
      "Initialize count array and record frequencies.",
      "Compute running cumulative prefix sums.",
      "Iterate in reverse to place items into output array.",
      "Copy sorted elements back into input array."
    ],
    code: [
      "count = array of zeros(max + 1)",
      "for x in A: count[x]++",
      "for i = 1 to max: count[i] += count[i - 1]",
      "for x in reverse(A): output[--count[x]] = x",
      "A = copy(output)"
    ],
    cx: ["O(n + k)", "O(n + k)", "O(n + k)", "O(k)"]
  },
  linear: {
    name: "Linear Search",
    desc: "Linear Search checks elements sequentially from index 0 until the target value is matched or the array ends.",
    steps: [
      "Set target search value.",
      "Inspect current element starting from index 0.",
      "If element matches target, return current index.",
      "Otherwise proceed to next index.",
      "If end reached without match, return not found."
    ],
    code: [
      "for i = 0 to n - 1",
      "    if A[i] == target: return i",
      "return -1"
    ],
    cx: ["O(1)", "O(n)", "O(n)", "O(1)"]
  },
  binary: {
    name: "Binary Search",
    desc: "Binary Search repeatedly divides a sorted search interval in half by evaluating the midpoint against the target value.",
    steps: [
      "Array must be sorted prior to search.",
      "Initialize left and right search boundaries.",
      "Compute midpoint index and inspect value.",
      "Discard half that cannot contain target.",
      "Repeat until found or left exceeds right."
    ],
    code: [
      "left = 0, right = n - 1",
      "while left <= right",
      "    mid = floor((left + right) / 2)",
      "    if A[mid] == target return mid",
      "    if A[mid] < target: left = mid + 1",
      "    else: right = mid - 1"
    ],
    cx: ["O(1)", "O(log n)", "O(log n)", "O(1)"]
  },
  bfs: {
    name: "Breadth-First Search (BFS)",
    desc: "BFS explores a graph level by level using a FIFO queue, visiting all immediate neighbors before advancing outward.",
    steps: [
      "Start from the designated start node.",
      "Mark it visited and enqueue it.",
      "Dequeue current front node.",
      "Visit and enqueue all unvisited neighbors.",
      "Repeat until queue is empty."
    ],
    code: [
      "queue = [start], visited = {start}",
      "while queue is not empty:",
      "    node = dequeue(queue)",
      "    for neighbor of node:",
      "        if neighbor not in visited:",
      "            visit & enqueue(neighbor)"
    ],
    cx: ["O(V + E)", "O(V + E)", "O(V + E)", "O(V)"]
  },
  dfs: {
    name: "Depth-First Search (DFS)",
    desc: "DFS explores deeply along each branch using recursion or a stack before backtracking to unvisited paths.",
    steps: [
      "Start from designated start node.",
      "Push current node to execution call stack.",
      "Explore first unvisited neighbor deeply.",
      "Backtrack when all neighbors are visited.",
      "Repeat until all reachable nodes are visited."
    ],
    code: [
      "DFS(node):",
      "    mark node visited",
      "    for neighbor of node:",
      "        if neighbor not visited:",
      "            DFS(neighbor)"
    ],
    cx: ["O(V + E)", "O(V + E)", "O(V + E)", "O(V)"]
  }
};

// -------------------------------------------------------------
// Theme Management
// -------------------------------------------------------------
function initTheme() {
  const saved = localStorage.getItem("dsa_theme") || "dark";
  applyTheme(saved);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.body.className = theme === "dark" ? "dark-theme" : "light-theme";
  localStorage.setItem("dsa_theme", theme);
  if (themeToggleBtn) {
    const isDark = theme === "dark";
    const icon = themeToggleBtn.querySelector(".theme-icon");
    const label = themeToggleBtn.querySelector(".theme-label");
    if (icon) icon.textContent = isDark ? "☀️" : "🌙";
    if (label) label.textContent = isDark ? "Light Mode" : "Dark Mode";
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  });
}

// -------------------------------------------------------------
// Loading Screen Dismissal
// -------------------------------------------------------------
function dismissLoader() {
  const loader = document.getElementById("loading-screen");
  if (loader && !loader.classList.contains("hidden")) {
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 450);
  }
}
window.addEventListener("load", dismissLoader);
if (document.readyState === "complete") {
  dismissLoader();
}

// -------------------------------------------------------------
// Core Visualizer Helpers
// -------------------------------------------------------------
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

function setStatus(text, type = "") {
  statusBadge.textContent = text;
  statusBadge.className = `status-badge ${type}`;
}

function randomArray() {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 36) + 5);
}

function renderArray(frame = frames[frameIndex]) {
  container.innerHTML = "";
  if (!array.length) return;
  const values = frame?.array || array;
  const max = Math.max(...values);
  const sorted = frame?.sorted || [];

  values.forEach((value, i) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${Math.max(25, (value / max) * 320)}px`;
    bar.textContent = value;
    if (sorted.includes(i)) bar.classList.add("sorted");
    if (frame?.compare?.includes(i)) bar.classList.add("comparing");
    if (frame?.swap?.includes(i)) bar.classList.add("swapping");
    if (frame?.pivot === i) bar.classList.add("pivot");
    if (frame?.found === i) bar.classList.add("found");
    if (frame?.failed?.includes(i)) bar.classList.add("failed");
    container.appendChild(bar);
  });
}

// -------------------------------------------------------------
// Graph Helper Functions (SVG)
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

function pushFrame(list, state) {
  list.push(makeFrame(state));
}

// -------------------------------------------------------------
// Sorting Algorithms Frame Builders
// -------------------------------------------------------------
function buildBubbleSortFrames(a) {
  let list = [];
  let c = 0, s = 0, p = 0;
  pushFrame(list, { array: [...a], sorted: [], operation: "Ready for Bubble Sort", variables: "—", line: -1, comparisons: c, swaps: s, passes: p });

  for (let i = 0; i < a.length; i++) {
    let swapped = false;
    for (let j = 0; j < a.length - i - 1; j++) {
      c++;
      pushFrame(list, {
        array: [...a],
        sorted: [...Array(i).keys()].map(k => a.length - 1 - k),
        compare: [j, j + 1],
        operation: `Compare A[${j}] (${a[j]}) and A[${j + 1}] (${a[j + 1]})`,
        variables: `i = ${i}, j = ${j}`,
        line: 3,
        comparisons: c,
        swaps: s,
        passes: p
      });
      if (a[j] > a[j + 1]) {
        s++;
        swapped = true;
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        pushFrame(list, {
          array: [...a],
          sorted: [...Array(i).keys()].map(k => a.length - 1 - k),
          swap: [j, j + 1],
          operation: `Swap elements: ${a[j + 1]} > ${a[j]}`,
          variables: `i = ${i}, j = ${j}`,
          line: 4,
          comparisons: c,
          swaps: s,
          passes: p
        });
      }
    }
    p++;
    const done = Array.from({ length: i + 1 }, (_, k) => a.length - 1 - k);
    pushFrame(list, {
      array: [...a],
      sorted: done,
      operation: `Pass ${p} complete. Element ${a[a.length - 1 - i]} locked.`,
      variables: `Pass ${p}`,
      line: 6,
      comparisons: c,
      swaps: s,
      passes: p
    });
    if (!swapped) break;
  }
  pushFrame(list, { array: [...a], sorted: a.map((_, i) => i), operation: "Bubble Sort complete", variables: "All elements sorted", line: -1, comparisons: c, swaps: s, passes: p });
  return list;
}

function buildSelectionSortFrames(a) {
  let list = [];
  let c = 0, s = 0, p = 0;
  pushFrame(list, { array: [...a], sorted: [], operation: "Ready for Selection Sort", variables: "—", line: -1, comparisons: c, swaps: s, passes: p });

  for (let i = 0; i < a.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      c++;
      pushFrame(list, {
        array: [...a],
        sorted: Array.from({ length: i }, (_, k) => k),
        compare: [j, min],
        operation: `Compare A[${j}] (${a[j]}) with current min A[${min}] (${a[min]})`,
        variables: `i = ${i}, j = ${j}, minIndex = ${min}`,
        line: 3,
        comparisons: c,
        swaps: s,
        passes: p
      });
      if (a[j] < a[min]) {
        min = j;
        pushFrame(list, {
          array: [...a],
          sorted: Array.from({ length: i }, (_, k) => k),
          compare: [j],
          operation: `New minimum detected: ${a[min]} at index ${min}`,
          variables: `minIndex = ${min}`,
          line: 4,
          comparisons: c,
          swaps: s,
          passes: p
        });
      }
    }
    if (min !== i) {
      s++;
      [a[i], a[min]] = [a[min], a[i]];
      pushFrame(list, {
        array: [...a],
        sorted: Array.from({ length: i }, (_, k) => k),
        swap: [i, min],
        operation: `Swap minimum ${a[i]} into position ${i}`,
        variables: `Swapped A[${i}] and A[${min}]`,
        line: 5,
        comparisons: c,
        swaps: s,
        passes: p
      });
    }
    p++;
    pushFrame(list, {
      array: [...a],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      operation: `Position ${i} fixed with ${a[i]}`,
      variables: `i = ${i}`,
      line: 5,
      comparisons: c,
      swaps: s,
      passes: p
    });
  }
  pushFrame(list, { array: [...a], sorted: a.map((_, i) => i), operation: "Selection Sort complete", variables: "All elements sorted", line: -1, comparisons: c, swaps: s, passes: p });
  return list;
}

function buildInsertionSortFrames(a) {
  let list = [];
  let c = 0, s = 0, p = 0;
  pushFrame(list, { array: [...a], sorted: [0], operation: "Ready for Insertion Sort", variables: "—", line: -1, comparisons: c, swaps: s, passes: p });

  for (let i = 1; i < a.length; i++) {
    let key = a[i], j = i - 1;
    pushFrame(list, {
      array: [...a],
      sorted: Array.from({ length: i }, (_, k) => k),
      compare: [i],
      operation: `Select key = ${key} at index ${i}`,
      variables: `key = ${key}, i = ${i}`,
      line: 1,
      comparisons: c,
      swaps: s,
      passes: p
    });
    while (j >= 0 && a[j] > key) {
      c++;
      s++;
      pushFrame(list, {
        array: [...a],
        sorted: Array.from({ length: i }, (_, k) => k),
        compare: [j, i],
        operation: `Shift ${a[j]} rightwards (${a[j]} > ${key})`,
        variables: `A[${j + 1}] = A[${j}]`,
        line: 4,
        comparisons: c,
        swaps: s,
        passes: p
      });
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
    p++;
    pushFrame(list, {
      array: [...a],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      swap: [j + 1],
      operation: `Inserted key ${key} into slot ${j + 1}`,
      variables: `A[${j + 1}] = ${key}`,
      line: 6,
      comparisons: c,
      swaps: s,
      passes: p
    });
  }
  pushFrame(list, { array: [...a], sorted: a.map((_, i) => i), operation: "Insertion Sort complete", variables: "All elements sorted", line: -1, comparisons: c, swaps: s, passes: p });
  return list;
}

function buildMergeSortFrames(initialArray) {
  let a = [...initialArray];
  let list = [];
  let c = 0, s = 0, p = 0;
  pushFrame(list, { array: [...a], sorted: [], operation: "Ready for Merge Sort", variables: "Divide and conquer", line: 0, comparisons: c, swaps: s, passes: p });

  function merge(low, mid, high) {
    p++;
    let leftSub = a.slice(low, mid + 1);
    let rightSub = a.slice(mid + 1, high + 1);
    let i = 0, j = 0, k = low;

    pushFrame(list, {
      array: [...a],
      compare: [mid, mid + 1],
      operation: `Merge subarrays [${low}..${mid}] and [${mid + 1}..${high}]`,
      variables: `Left: [${leftSub.join(", ")}], Right: [${rightSub.join(", ")}]`,
      line: 5,
      comparisons: c,
      swaps: s,
      passes: p
    });

    while (i < leftSub.length && j < rightSub.length) {
      c++;
      pushFrame(list, {
        array: [...a],
        compare: [low + i, mid + 1 + j],
        operation: `Compare ${leftSub[i]} with ${rightSub[j]}`,
        variables: `Left[${i}]=${leftSub[i]}, Right[${j}]=${rightSub[j]}`,
        line: 5,
        comparisons: c,
        swaps: s,
        passes: p
      });

      if (leftSub[i] <= rightSub[j]) {
        s++;
        a[k] = leftSub[i];
        pushFrame(list, {
          array: [...a],
          swap: [k],
          operation: `Write ${leftSub[i]} into index ${k}`,
          variables: `A[${k}] = ${leftSub[i]}`,
          line: 5,
          comparisons: c,
          swaps: s,
          passes: p
        });
        i++;
      } else {
        s++;
        a[k] = rightSub[j];
        pushFrame(list, {
          array: [...a],
          swap: [k],
          operation: `Write ${rightSub[j]} into index ${k}`,
          variables: `A[${k}] = ${rightSub[j]}`,
          line: 5,
          comparisons: c,
          swaps: s,
          passes: p
        });
        j++;
      }
      k++;
    }

    while (i < leftSub.length) {
      s++;
      a[k] = leftSub[i];
      pushFrame(list, {
        array: [...a],
        swap: [k],
        operation: `Copy remaining left item ${leftSub[i]} to index ${k}`,
        variables: `A[${k}] = ${leftSub[i]}`,
        line: 5,
        comparisons: c,
        swaps: s,
        passes: p
      });
      i++;
      k++;
    }

    while (j < rightSub.length) {
      s++;
      a[k] = rightSub[j];
      pushFrame(list, {
        array: [...a],
        swap: [k],
        operation: `Copy remaining right item ${rightSub[j]} to index ${k}`,
        variables: `A[${k}] = ${rightSub[j]}`,
        line: 5,
        comparisons: c,
        swaps: s,
        passes: p
      });
      j++;
      k++;
    }
  }

  function sort(low, high) {
    if (low < high) {
      const mid = Math.floor((low + high) / 2);
      sort(low, mid);
      sort(mid + 1, high);
      merge(low, mid, high);
    }
  }

  sort(0, a.length - 1);
  pushFrame(list, { array: [...a], sorted: a.map((_, idx) => idx), operation: "Merge Sort complete", variables: "All elements sorted", line: -1, comparisons: c, swaps: s, passes: p });
  return list;
}

function buildQuickSortFrames(initialArray) {
  let a = [...initialArray];
  let list = [];
  let c = 0, s = 0, p = 0;
  const sorted = [];

  pushFrame(list, { array: [...a], sorted: [], operation: "Ready for Quick Sort", variables: "—", line: 0, comparisons: c, swaps: s, passes: p });

  function partition(low, high) {
    p++;
    const pivot = a[high];
    let i = low - 1;

    pushFrame(list, {
      array: [...a],
      sorted: [...sorted],
      pivot: high,
      operation: `Select pivot ${pivot} at index ${high}`,
      variables: `low = ${low}, high = ${high}, pivot = ${pivot}`,
      line: 2,
      comparisons: c,
      swaps: s,
      passes: p
    });

    for (let j = low; j < high; j++) {
      c++;
      pushFrame(list, {
        array: [...a],
        sorted: [...sorted],
        pivot: high,
        compare: [j, high],
        operation: `Compare A[${j}] (${a[j]}) with pivot ${pivot}`,
        variables: `j = ${j}, i = ${i}, pivot = ${pivot}`,
        line: 2,
        comparisons: c,
        swaps: s,
        passes: p
      });

      if (a[j] < pivot) {
        i++;
        if (i !== j) {
          s++;
          [a[i], a[j]] = [a[j], a[i]];
          pushFrame(list, {
            array: [...a],
            sorted: [...sorted],
            pivot: high,
            swap: [i, j],
            operation: `Swap A[${i}] and A[${j}] (${a[j]} < pivot)`,
            variables: `Swapped ${a[j]} and ${a[i]}`,
            line: 2,
            comparisons: c,
            swaps: s,
            passes: p
          });
        }
      }
    }

    if (i + 1 !== high) {
      s++;
      [a[i + 1], a[high]] = [a[high], a[i + 1]];
      pushFrame(list, {
        array: [...a],
        sorted: [...sorted],
        swap: [i + 1, high],
        operation: `Position pivot ${pivot} at index ${i + 1}`,
        variables: `Pivot locked at index ${i + 1}`,
        line: 2,
        comparisons: c,
        swaps: s,
        passes: p
      });
    }

    sorted.push(i + 1);
    return i + 1;
  }

  function sort(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    } else if (low === high) {
      sorted.push(low);
    }
  }

  sort(0, a.length - 1);
  pushFrame(list, { array: [...a], sorted: a.map((_, idx) => idx), operation: "Quick Sort complete", variables: "All elements sorted", line: -1, comparisons: c, swaps: s, passes: p });
  return list;
}

function buildHeapSortFrames(initialArray) {
  let a = [...initialArray];
  let list = [];
  let c = 0, s = 0, p = 0;
  const sorted = [];

  pushFrame(list, { array: [...a], sorted: [], operation: "Ready for Heap Sort", variables: "Building Max-Heap", line: 0, comparisons: c, swaps: s, passes: p });

  function heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      c++;
      pushFrame(list, {
        array: [...a],
        sorted: [...sorted],
        compare: [largest, left],
        operation: `Compare parent A[${largest}] (${a[largest]}) with left child A[${left}] (${a[left]})`,
        variables: `i = ${i}, left = ${left}`,
        line: 3,
        comparisons: c,
        swaps: s,
        passes: p
      });
      if (a[left] > a[largest]) {
        largest = left;
      }
    }

    if (right < n) {
      c++;
      pushFrame(list, {
        array: [...a],
        sorted: [...sorted],
        compare: [largest, right],
        operation: `Compare largest A[${largest}] (${a[largest]}) with right child A[${right}] (${a[right]})`,
        variables: `i = ${i}, right = ${right}`,
        line: 3,
        comparisons: c,
        swaps: s,
        passes: p
      });
      if (a[right] > a[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      s++;
      [a[i], a[largest]] = [a[largest], a[i]];
      pushFrame(list, {
        array: [...a],
        sorted: [...sorted],
        swap: [i, largest],
        operation: `Swap parent ${a[largest]} with larger child ${a[i]}`,
        variables: `Swapped index ${i} and ${largest}`,
        line: 3,
        comparisons: c,
        swaps: s,
        passes: p
      });
      heapify(n, largest);
    }
  }

  for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--) {
    heapify(a.length, i);
  }

  pushFrame(list, {
    array: [...a],
    sorted: [],
    operation: "Max-Heap established. Root holds maximum element.",
    variables: `Heap Root = ${a[0]}`,
    line: 0,
    comparisons: c,
    swaps: s,
    passes: p
  });

  for (let i = a.length - 1; i > 0; i--) {
    p++;
    s++;
    [a[0], a[i]] = [a[i], a[0]];
    sorted.push(i);
    pushFrame(list, {
      array: [...a],
      sorted: [...sorted],
      swap: [0, i],
      operation: `Extract max element ${a[i]} to sorted index ${i}`,
      variables: `Locked ${a[i]} at index ${i}`,
      line: 2,
      comparisons: c,
      swaps: s,
      passes: p
    });

    heapify(i, 0);
  }

  sorted.push(0);
  pushFrame(list, { array: [...a], sorted: a.map((_, idx) => idx), operation: "Heap Sort complete", variables: "All elements sorted", line: -1, comparisons: c, swaps: s, passes: p });
  return list;
}

function buildCountingSortFrames(initialArray) {
  let a = [...initialArray];
  let list = [];
  let c = 0, s = 0, p = 0;

  pushFrame(list, { array: [...a], sorted: [], operation: "Ready for Counting Sort", variables: "—", line: 0, comparisons: c, swaps: s, passes: p });

  const maxVal = Math.max(...a);
  const count = new Array(maxVal + 1).fill(0);

  for (let i = 0; i < a.length; i++) {
    p++;
    count[a[i]]++;
    pushFrame(list, {
      array: [...a],
      compare: [i],
      operation: `Tally frequency of value ${a[i]}`,
      variables: `count[${a[i]}] = ${count[a[i]]}`,
      line: 1,
      comparisons: c,
      swaps: s,
      passes: p
    });
  }

  for (let i = 1; i <= maxVal; i++) {
    count[i] += count[i - 1];
  }

  pushFrame(list, {
    array: [...a],
    operation: "Calculated cumulative prefix frequencies",
    variables: `Max element = ${maxVal}`,
    line: 2,
    comparisons: c,
    swaps: s,
    passes: p
  });

  const output = new Array(a.length);
  for (let i = a.length - 1; i >= 0; i--) {
    p++;
    s++;
    const val = a[i];
    const targetIdx = count[val] - 1;
    output[targetIdx] = val;
    count[val]--;

    pushFrame(list, {
      array: [...a],
      compare: [i],
      operation: `Place ${val} at designated target index ${targetIdx}`,
      variables: `output[${targetIdx}] = ${val}`,
      line: 3,
      comparisons: c,
      swaps: s,
      passes: p
    });
  }

  const sorted = [];
  for (let i = 0; i < a.length; i++) {
    s++;
    a[i] = output[i];
    sorted.push(i);
    pushFrame(list, {
      array: [...a],
      sorted: [...sorted],
      swap: [i],
      operation: `Write sorted value ${a[i]} into main array index ${i}`,
      variables: `A[${i}] = ${a[i]}`,
      line: 4,
      comparisons: c,
      swaps: s,
      passes: p
    });
  }

  pushFrame(list, { array: [...a], sorted: a.map((_, idx) => idx), operation: "Counting Sort complete", variables: "All elements sorted", line: -1, comparisons: c, swaps: s, passes: p });
  return list;
}

function buildSearchFrames(type) {
  let a = type === "binary" ? [...array].sort((x, y) => x - y) : [...array], list = [];
  let c = 0, p = 0;
  const target = Number(searchValue.value);
  pushFrame(list, {
    array: a,
    operation: type === "binary" ? "Array sorted for Binary Search" : "Ready for Linear Search",
    variables: `target = ${target}`,
    line: 0,
    comparisons: c,
    passes: p
  });

  if (type === "linear") {
    for (let i = 0; i < a.length; i++) {
      c++;
      p++;
      pushFrame(list, {
        array: a,
        compare: [i],
        operation: `Check A[${i}] (${a[i]}) against target ${target}`,
        variables: `i = ${i}, target = ${target}`,
        line: 1,
        comparisons: c,
        passes: p
      });
      if (a[i] === target) {
        pushFrame(list, {
          array: a,
          found: i,
          operation: `Target ${target} found at index ${i}!`,
          variables: `Match at index ${i}`,
          line: 1,
          comparisons: c,
          passes: p
        });
        return list;
      }
    }
    pushFrame(list, {
      array: a,
      failed: a.map((_, i) => i),
      operation: `Target ${target} not present in array`,
      variables: `target = ${target} not found`,
      line: 2,
      comparisons: c,
      passes: p
    });
    return list;
  }

  let left = 0, right = a.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    c++;
    p++;
    pushFrame(list, {
      array: a,
      compare: [mid],
      operation: `Check midpoint A[${mid}] (${a[mid]})`,
      variables: `left = ${left}, mid = ${mid}, right = ${right}`,
      line: 3,
      comparisons: c,
      passes: p
    });
    if (a[mid] === target) {
      pushFrame(list, {
        array: a,
        found: mid,
        operation: `Target ${target} found at index ${mid}!`,
        variables: `Match at index ${mid}`,
        line: 3,
        comparisons: c,
        passes: p
      });
      return list;
    }
    if (a[mid] < target) {
      left = mid + 1;
      pushFrame(list, {
        array: a,
        operation: `Target > ${a[mid]} — advance left boundary to ${left}`,
        variables: `left = ${left}, right = ${right}`,
        line: 4,
        comparisons: c,
        passes: p
      });
    } else {
      right = mid - 1;
      pushFrame(list, {
        array: a,
        operation: `Target < ${a[mid]} — move right boundary to ${right}`,
        variables: `left = ${left}, right = ${right}`,
        line: 5,
        comparisons: c,
        passes: p
      });
    }
  }
  pushFrame(list, {
    array: a,
    failed: a.map((_, i) => i),
    operation: `Target ${target} not found in range`,
    variables: `Search exhausted`,
    line: 5,
    comparisons: c,
    passes: p
  });
  return list;
}

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
    graph: { nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates } },
    operation: `Initialize BFS at Start Node ${startNode.label}. Queue is empty.`,
    variables: "Queue: [] | Visited: []",
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
    graph: { nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates } },
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
      graph: { nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates } },
      operation: `Dequeued node ${getNodeLabel(u)} (Current: Cyan). Inspecting adjacent edges.`,
      variables: `Current: ${getNodeLabel(u)} | Queue: [${queue.map(id => getNodeLabel(id)).join(", ")}] | Visited: [${Array.from(visited).map(id => getNodeLabel(id)).join(", ")}]`,
      line: 2,
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
        graph: { nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates } },
        operation: `Checking edge (${getNodeLabel(u)}, ${getNodeLabel(v)}). Neighbor ${getNodeLabel(v)} is Exploring (Amber).`,
        variables: `Edge: ${getNodeLabel(u)} -> ${getNodeLabel(v)} | Queue: [${queue.map(id => getNodeLabel(id)).join(", ")}]`,
        line: 3,
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
          graph: { nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates } },
          operation: `Neighbor ${getNodeLabel(v)} is unvisited. Enqueued ${getNodeLabel(v)} (Queued: Violet), marked edge as Traversed (Magenta).`,
          variables: `Queue: [${queue.map(id => getNodeLabel(id)).join(", ")}] | Visited: [${Array.from(visited).map(id => getNodeLabel(id)).join(", ")}]`,
          line: 5,
          comparisons: edgeChecks,
          swaps: visitedCount,
          passes: step
        });
      } else {
        edgeStates[edgeKey] = prevEdgeState === "traversed" ? "traversed" : "normal";
        nodeStates[v] = prevVState;

        step++;
        pushFrame(list, {
          graph: { nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates } },
          operation: `Neighbor ${getNodeLabel(v)} already ${isVisited ? "visited" : "in queue"}. Skip edge.`,
          variables: `Queue: [${queue.map(id => getNodeLabel(id)).join(", ")}] | Visited: [${Array.from(visited).map(id => getNodeLabel(id)).join(", ")}]`,
          line: 4,
          comparisons: edgeChecks,
          swaps: visitedCount,
          passes: step
        });
      }
    }

    nodeStates[u] = "visited";
    step++;
    pushFrame(list, {
      graph: { nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates } },
      operation: `Finished all neighbors of node ${getNodeLabel(u)}. Marked as Visited (Green).`,
      variables: `Queue: [${queue.map(id => getNodeLabel(id)).join(", ")}] | Visited: [${Array.from(visited).map(id => getNodeLabel(id)).join(", ")}]`,
      line: 2,
      comparisons: edgeChecks,
      swaps: visitedCount,
      passes: step
    });
  }

  step++;
  pushFrame(list, {
    graph: { nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates } },
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
    graph: { nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates } },
    operation: `Initialize DFS at Start Node ${startNode.label}. Call stack is empty.`,
    variables: "Stack: [] | Visited: []",
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
      graph: { nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates } },
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
        graph: { nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates } },
        operation: `Checking edge (${getNodeLabel(u)}, ${getNodeLabel(v)}). Neighbor ${getNodeLabel(v)} is Exploring (Amber).`,
        variables: `Examining: ${getNodeLabel(u)} -> ${getNodeLabel(v)} | Stack: [${stack.map(id => getNodeLabel(id)).join(", ")}]`,
        line: 2,
        comparisons: edgeChecks,
        swaps: visitedCount,
        passes: step
      });

      if (!isVisited) {
        nodeStates[v] = "queued";

        step++;
        pushFrame(list, {
          graph: { nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates } },
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
          graph: { nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates } },
          operation: `Backtracked to node ${getNodeLabel(u)} (Current: Cyan) from branch ${getNodeLabel(v)}.`,
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
          graph: { nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates } },
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
      graph: { nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates } },
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
    graph: { nodeStates: { ...nodeStates }, edgeStates: { ...edgeStates } },
    operation: `DFS Traversal complete! Visited ${visited.size} node${visited.size === 1 ? "" : "s"}.`,
    variables: `Stack: [] | Visited: [${Array.from(visited).map(id => getNodeLabel(id)).join(", ")}]`,
    line: -1,
    comparisons: edgeChecks,
    swaps: visitedCount,
    passes: step
  });

  return list;
}

// -------------------------------------------------------------
// Frame Generator Dispatcher
// -------------------------------------------------------------
function buildFrames() {
  const a = [...array];
  if (currentAlgorithm === "bubble") {
    frames = buildBubbleSortFrames(a);
  } else if (currentAlgorithm === "selection") {
    frames = buildSelectionSortFrames(a);
  } else if (currentAlgorithm === "insertion") {
    frames = buildInsertionSortFrames(a);
  } else if (currentAlgorithm === "merge") {
    frames = buildMergeSortFrames(a);
  } else if (currentAlgorithm === "quick") {
    frames = buildQuickSortFrames(a);
  } else if (currentAlgorithm === "heap") {
    frames = buildHeapSortFrames(a);
  } else if (currentAlgorithm === "counting") {
    frames = buildCountingSortFrames(a);
  } else if (currentAlgorithm === "linear" || currentAlgorithm === "binary") {
    frames = buildSearchFrames(currentAlgorithm);
  } else if (currentAlgorithm === "bfs") {
    frames = buildBFSFrames();
  } else if (currentAlgorithm === "dfs") {
    frames = buildDFSFrames();
  }
  frameIndex = 0;
  if (frames.length > 0) {
    updateExecution(frames[0]);
  }
}

function applyFrame(i) {
  frameIndex = Math.max(0, Math.min(i, frames.length - 1));
  updateExecution(frames[frameIndex]);
  if (frameIndex === frames.length - 1) {
    setStatus("Complete", "done");
    startButton.textContent = "Start";
  } else if (frameIndex > 0) {
    setStatus("Paused", "running");
    startButton.textContent = "Resume";
  } else {
    setStatus("Ready");
    startButton.textContent = "Start";
  }
}

async function play() {
  if (isPlaying) return;
  if (!frames.length || frameIndex >= frames.length - 1) {
    buildFrames();
  }
  isPlaying = true;
  setStatus("Running", "running");
  startButton.textContent = "Running";
  startButton.disabled = true;

  while (isPlaying && frameIndex < frames.length - 1) {
    await new Promise(r => setTimeout(r, animationSpeed));
    if (!isPlaying) break;
    applyFrame(frameIndex + 1);
  }

  if (frameIndex >= frames.length - 1) {
    isPlaying = false;
    setStatus("Complete", "done");
    startButton.textContent = "Start";
  } else if (!isPlaying) {
    setStatus("Paused", "running");
    startButton.textContent = "Resume";
  }
  startButton.disabled = false;
}

function pause() {
  isPlaying = false;
  setStatus("Paused", "running");
  startButton.textContent = "Resume";
  startButton.disabled = false;
}

function resetVisualization() {
  pause();
  resetStats();
  frames = [];
  frameIndex = 0;
  startButton.textContent = "Start";

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
  startButton.textContent = "Start";

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
    generateButton.textContent = "Randomise Graph";
    if (stat1Title) stat1Title.textContent = "Edge Checks";
    if (stat2Title) stat2Title.textContent = "Visited Nodes";
    if (stat3Title) stat3Title.textContent = "Steps";
    populateStartSelect();
  } else {
    generateButton.textContent = "Generate";
    if (stat1Title) stat1Title.textContent = "Comparisons";
    if (stat2Title) stat2Title.textContent = "Swaps / Writes";
    if (stat3Title) stat3Title.textContent = "Passes / Steps";
  }

  array = name === "binary" ? [4, 8, 13, 19, 24, 29, 34, 41, 45, 49] : [5, 3, 8, 4, 2, 9, 7, 1, 6, 10];
  frames = [];
  frameIndex = 0;
  startButton.textContent = "Start";
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
  if (isPlaying) {
    pause();
  } else {
    play();
  }
});

pauseButton.addEventListener("click", pause);

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

// Initialize Application
initTheme();
updateInfo();
renderArray();
populateStartSelect();
renderGraph();
updateExecution();
