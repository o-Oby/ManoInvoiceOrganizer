function convertToExcel() {
    // Get the input text from the textarea with id 'inputText'
    const inputText = document.getElementById('inputText').value;

    // Send a POST request to the server with the input text
    fetch('/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // Convert the input text to a JSON string and send it in the request body
        body: JSON.stringify({ text: inputText })
    })
    .then(response => response.blob()) // Convert the response to a blob
    .then(blob => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        // Create a temporary link element
        const a = document.createElement('a');
        // Hide the link element
        a.style.display = 'none';
        // Set the href of the link to the blob URL
        a.href = url;
        // Set the download attribute of the link to the desired file name
        a.download = 'output.xlsx'; // The name for the downloaded file
        // Append the link to the body
        document.body.appendChild(a);
        // Programmatically click the link to trigger the download
        a.click();
        // Revoke the blob URL to free up memory
        window.URL.revokeObjectURL(url);
    })
    // Log any errors to the console
    .catch(error => console.error('Error:', error));
}
