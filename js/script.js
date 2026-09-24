let array = [5, 3, 8, 4, 2];

const container = document.getElementById("array-container");
const generateButton = document.getElementById("generate-btn");
const startButton = document.getElementById("start-btn");

let sortedCount = 0;
let isSorting = false;


// -----------------------------
// Render Array
// -----------------------------

function renderArray() {

    container.innerHTML = "";

    const maxValue = Math.max(...array);

    for (let i = 0; i < array.length; i++) {

        const bar = document.createElement("div");

        bar.classList.add("bar");

        const barHeight = (array[i] / maxValue) * 300;

        bar.style.height = `${barHeight}px`;

        bar.textContent = array[i];

        // Mark the sorted section
        if (i >= array.length - sortedCount) {
            bar.classList.add("sorted");
        }

        container.appendChild(bar);
    }
}


// -----------------------------
// Generate Random Array
// -----------------------------

function generateArray() {

    if (isSorting) {
        return;
    }

    array = [];

    for (let i = 0; i < 5; i++) {

        const randomValue =
            Math.floor(Math.random() * 35) + 5;

        array.push(randomValue);
    }

    sortedCount = 0;

    renderArray();
}


// -----------------------------
// Delay Function
// -----------------------------

function delay(ms) {

    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}


// -----------------------------
// Bubble Sort Visualization
// -----------------------------

async function bubbleSortVisualization() {

    if (isSorting) {
        return;
    }

    isSorting = true;

    startButton.disabled = true;
    generateButton.disabled = true;

    sortedCount = 0;

    renderArray();


    // Bubble Sort
    for (let i = 0; i < array.length; i++) {

        let swapped = false;


        for (let j = 0; j < array.length - i - 1; j++) {

            let bars = container.children;


            // Highlight comparison
            bars[j].classList.add("comparing");
            bars[j + 1].classList.add("comparing");

            await delay(600);


            // Compare values
            if (array[j] > array[j + 1]) {

                swapped = true;

                // Remove comparison highlight
                bars[j].classList.remove("comparing");
                bars[j + 1].classList.remove("comparing");

                // Swap values in array
                let temp = array[j];

                array[j] = array[j + 1];

                array[j + 1] = temp;


                // Show swapping state
                bars[j].classList.add("swapping");
                bars[j + 1].classList.add("swapping");

                await delay(300);


                // Redraw
                renderArray();

                await delay(300);

            } else {

                // No swap
                bars[j].classList.remove("comparing");
                bars[j + 1].classList.remove("comparing");
            }
        }


        // One more element is now sorted
        sortedCount++;

        renderArray();

        await delay(500);


        // Optimization:
        // If no swaps occurred, array is already sorted.
        if (!swapped) {
            break;
        }
    }


    // Make sure every element is marked sorted
    sortedCount = array.length;

    renderArray();


    isSorting = false;

    startButton.disabled = false;
    generateButton.disabled = false;
}


// -----------------------------
// Button Events
// -----------------------------

generateButton.addEventListener(
    "click",
    generateArray
);

startButton.addEventListener(
    "click",
    bubbleSortVisualization
);


// -----------------------------
// Initial Display
// -----------------------------

renderArray();