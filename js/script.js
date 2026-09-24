let array = [5, 3, 8, 4, 2];

const container = document.getElementById("array-container");
const generateButton = document.getElementById("generate-btn");
const startButton = document.getElementById("start-btn");


function renderArray(sortedCount = 0) {

    container.innerHTML = "";

    const maxValue = Math.max(...array);

    for (let i = 0; i < array.length; i++) {

        const bar = document.createElement("div");

        bar.classList.add("bar");

        const barHeight = (array[i] / maxValue) * 300;

        bar.style.height = `${barHeight}px`;

        bar.textContent = array[i];

        // Mark the right-side sorted section
        if (i >= array.length - sortedCount) {
            bar.classList.add("sorted");
        }

        container.appendChild(bar);
    }
}

function generateArray() {

    array = [];

    for (let i = 0; i < 5; i++) {

        let randomValue = Math.floor(Math.random() * 35) + 5;

        array.push(randomValue);
    }

// Display the initial array
renderArray();
}

function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSortVisualization() {

    startButton.disabled = true;
    generateButton.disabled = true;

    //const bars = container.children;

    for (let i = 0; i < array.length; i++) {

        for (let j = 0; j < array.length - i - 1; j++) {

            let bars = container.children;

            // Highlight the two bars being compared
            bars[j].classList.add("comparing");
            bars[j + 1].classList.add("comparing");

            await delay(700);

             // Check if a swap is needed
            if (array[j] > array[j + 1]) {

                // Swap values in the array
                let temp = array[j];

                array[j] = array[j + 1];

                array[j + 1] = temp;

                // Re-render the bars
                renderArray(i);

                // Update bars reference
                //bars[j].classList.add("swapping");
                //bars[j + 1].classList.add("swapping");

                await delay(500); // show new state
            }

            // Get current bars again
            bars = container.children;

            // Remove comparison styling
            bars[j].classList.remove("comparing");
            bars[j + 1].classList.remove("comparing");

            // Remove swapping styling
           // bars[j].classList.remove("swapping");
            //bars[j + 1].classList.remove("swapping");

            
        }
        
        // The largest unsorted element is now in its final position
        let sortedIndex = array.length - i - 1;

        let bars = container.children;

        bars[sortedIndex].classList.add("sorted");

        await delay(500);
        
    }

    startButton.disabled = false;
    generateButton.disabled = false;
}    

generateButton.addEventListener("click", generateArray);
startButton.addEventListener("click", bubbleSortVisualization);

renderArray();

