let array = [5, 3, 8, 4, 2];

console.log("Before sorting:", array);

for (let i = 0; i < array.length; i++) {

    for (let j = 0; j < array.length - i - 1; j++) {

        console.log(
            "Comparing:",
            array[j],
            array[j + 1]
        );

        if (array[j] > array[j + 1]) {

            console.log("SWAP NEEDED");

            let temp = array[j];

            array[j] = array[j + 1];

            array[j + 1] = temp;
        }
    }
}

console.log("After sorting:", array);