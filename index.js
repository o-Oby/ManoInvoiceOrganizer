import express from 'express'; // Importer le module express
import bodyParser from 'body-parser'; // Importer le module body-parser pour parser les requêtes entrantes
import cors from 'cors'; // Importer le module cors pour gérer les requêtes cross-origin
import path from 'path'; // Importer le module path pour gérer les chemins de fichiers
import { fileURLToPath } from 'url'; // Importer fileURLToPath pour convertir import.meta.url en chemin de fichier

// Convertir `import.meta.url` en un chemin de fichier
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialiser l'application express
const app = express();
const port = process.env.PORT || 3000; // Définir le port, par défaut 3000

// Configurer les options CORS
const corsOptions = {
	origin: 'http://127.0.0.1', // Remplacez par le domaine distant où le HTML est hébergé
	optionsSuccessStatus: 200
};

// Appliquer les middlewares
app.use(cors(corsOptions)); // Activer CORS avec les options définies
app.use(bodyParser.urlencoded({ extended: true })); // Parser les requêtes URL-encoded
app.use(bodyParser.json()); // Parser les requêtes JSON
app.use(express.static(path.join(__dirname, 'public'))); // Servir les fichiers statiques depuis le répertoire 'public'

// Définir une route pour l'URL racine pour servir le fichier index.html
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route POST pour traiter les données envoyées
app.post('/process', (req, res) => {
	const inputText = req.body.text; // Obtenir le texte d'entrée depuis le corps de la requête
	const inputLines = inputText.split('\n'); // Diviser le texte en lignes

	console.log("Début du traitement des lignes d'entrée.");

	// Fonction pour formater les montants en nombres
	function formatAmount(amount) {
		return parseFloat(amount.replace(/\s/g, '').replace('€', '').replace(',', '.'));
	}

	// Fonction pour formater les montants avec des virgules
	function formatAmountWithComma(amount) {
		return `"${amount.toFixed(2).replace('.', ',')}"`;
	}

	// Fonction pour parser les dates
	function parseDate(dateStr) {
		const [day, month, year] = dateStr.split('/');
		return new Date(`${year}-${month}-${day}`);
	}

	let csvLines = []; // Tableau pour stocker les lignes du fichier CSV
	let seenIDs = new Set(); // Ensemble pour suivre les IDs déjà vus
	let yearlyTotals = {}; // Objet pour stocker les totaux annuels

	let entries = []; // Tableau pour stocker les entrées triées

	inputLines.forEach(line => {
		// Nettoyer la ligne en supprimant les termes indésirables
		let cleanedLine = line.replace('Paiement Effectué', '').replace('Télécharger la facture', '').trim();
		console.log(`Ligne nettoyée: "${cleanedLine}"`);
		
		if (cleanedLine === '') {
			console.log('Ligne vide ignorée.');
			return;
		}

		let parts = cleanedLine.split('\t').filter(Boolean); // Diviser la ligne en parties
		console.log(`Parts après split: ${parts}`);
		
		if (parts.length >= 3) { // S'assurer qu'il y a au moins 3 parties (date, ID, montant)
			let date = parts[0].trim(); // Obtenir la date
			let id = parts[1].trim(); // Obtenir l'ID
			let amount = formatAmount(parts[2].trim()); // Obtenir le montant

			// Vérification du format de la date et des champs non vides
			if (!date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
				console.log(`Format de date invalide ignoré: ${date}`);
				return;
			}

			if (!seenIDs.has(id)) {
				seenIDs.add(id); // Ajouter l'ID à l'ensemble des IDs vus
				entries.push({ date, id, amount }); // Ajouter l'entrée au tableau des entrées

				let year = date.split('/')[2]; // Obtenir l'année de la date
				if (!yearlyTotals[year]) {
					yearlyTotals[year] = 0;
				}
				yearlyTotals[year] += amount; // Ajouter le montant au total annuel
			}
		} else {
			console.log(`Ligne ignorée (format incorrect): "${line}"`);
		}
	});

	console.log("Entrées après traitement : ", entries);

	entries.sort((a, b) => parseDate(a.date) - parseDate(b.date)); // Trier les entrées par date

	csvLines.push("Date,ID,Amount"); // Ajouter l'en-tête CSV
	entries.forEach(entry => {
		csvLines.push(`${entry.date},${entry.id},${formatAmountWithComma(entry.amount)}`);
	});

	csvLines.push(""); // Ajouter une ligne vide
	for (let year in yearlyTotals) {
		csvLines.push(`Total ${year},,${formatAmountWithComma(yearlyTotals[year])}`);
	}

	const csvContent = csvLines.join('\n'); // Joindre les lignes CSV en une seule chaîne
	res.setHeader('Content-disposition', 'attachment; filename=output.csv'); // Définir le nom du fichier à télécharger
	res.set('Content-Type', 'text/csv'); // Définir le type de contenu
	console.log("CSV Content: \n" + csvContent);
	res.status(200).send(csvContent); // Envoyer le contenu CSV au client
});

// Démarrer le serveur
app.listen(port, '0.0.0.0', () => {
	console.log(`Server is running on http://0.0.0.0:${port}`);
});
