// Fonction pour convertir le texte en CSV
function convertToCSV() {
	// Récupérer le contenu de la zone de texte
	const inputText = document.getElementById('inputText').value;

	// Envoyer une requête POST au serveur avec le texte en entrée
	fetch('/process', {
		method: 'POST', // Méthode HTTP POST
		headers: {
			'Content-Type': 'application/json' // Définir le type de contenu comme JSON
		},
		body: JSON.stringify({ text: inputText }) // Convertir le texte en JSON et l'envoyer dans le corps de la requête
	})
	.then(response => response.blob()) // Convertir la réponse en un Blob
	.then(blob => {
		// Créer une URL pour le Blob
		const url = window.URL.createObjectURL(blob);
		// Créer un élément <a> pour télécharger le fichier
		const a = document.createElement('a');
		a.style.display = 'none'; // Masquer l'élément <a>
		a.href = url; // Définir l'URL du Blob comme href de l'élément <a>
		a.download = 'output.csv'; // Définir le nom du fichier à télécharger
		document.body.appendChild(a); // Ajouter l'élément <a> au corps du document
		a.click(); // Simuler un clic sur l'élément <a> pour déclencher le téléchargement
		window.URL.revokeObjectURL(url); // Révoquer l'URL du Blob après le téléchargement
	})
	.catch(error => console.error('Error:', error)); // Gérer les erreurs en les affichant dans la console
}
