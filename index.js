import express from 'express'; // Importation du module express
import bodyParser from 'body-parser'; // Importation du module body-parser pour gérer les corps de requêtes
import cors from 'cors'; // Importation du module cors pour gérer les requêtes cross-origin
import path from 'path'; // Importation du module path pour travailler avec les chemins de fichiers
import { fileURLToPath } from 'url'; // Importation de fileURLToPath pour travailler avec les URL de fichiers
import writeXlsxFile from 'write-excel-file/node'; // Importation du module write-excel-file pour générer des fichiers Excel

// Conversion de l'URL actuelle en chemin de fichier
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Création d'une application express
const app = express();
const port = process.env.PORT || 3001;

// Options CORS pour autoriser les requêtes provenant d'un domaine spécifique
const corsOptions = {
  origin: 'http://iadvize.breizh-connect.com',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // Utilisation de CORS avec les options spécifiées
app.use(bodyParser.urlencoded({ extended: true })); // Utilisation de body-parser pour parser les corps de requêtes URL-encoded
app.use(bodyParser.json()); // Utilisation de body-parser pour parser les corps de requêtes JSON
app.use(express.static(path.join(__dirname, 'public'))); // Servir les fichiers statiques du dossier 'public'

// Route pour servir la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour traiter les données envoyées via POST et générer un fichier Excel
app.post('/process', async (req, res) => {
  const inputText = req.body.text; // Récupération du texte envoyé dans le corps de la requête
  const inputLines = inputText.split('\n'); // Séparation du texte en lignes

  console.log("Début du traitement des lignes d'entrée.");

  // Fonction pour formater les montants
  function formatAmount(amount) {
	return parseFloat(amount.replace(/\s/g, '').replace('€', '').replace(',', '.'));
  }

  // Fonction pour parser les dates
  function parseDate(dateStr) {
	const [day, month, year] = dateStr.split('/');
	return new Date(`${year}-${month}-${day}`);
  }

  // Fonction pour formater les montants avec des virgules
  function formatAmountWithComma(amount) {
	return amount.toFixed(2).replace('.', ',');
  }

  let entries = []; // Tableau pour stocker les entrées
  let yearlyTotals = {}; // Objet pour stocker les totaux annuels

  // Traitement de chaque ligne d'entrée
  inputLines.forEach(line => {
	try {
	  // Nettoyage de la ligne en supprimant les termes indésirables
	  let cleanedLine = line.replace('Paiement Effectué', '').replace('Télécharger la facture', '').trim();
	  if (cleanedLine === '') {
		return;
	  }

	  let parts = cleanedLine.split('\t').filter(Boolean);
	  if (parts.length >= 3) {
		let date = parts[0].trim();
		let id = parts[1].trim();
		let amount = formatAmount(parts[2].trim());

		if (!date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
		  return;
		}

		entries.push({ date, id, amount });

		let year = date.split('/')[2];
		if (!yearlyTotals[year]) {
		  yearlyTotals[year] = 0;
		}
		yearlyTotals[year] += amount;
	  }
	} catch (error) {
	  console.error(`Error processing line: ${line}`, error);
	}
  });

  // Tri des entrées par date
  entries.sort((a, b) => parseDate(a.date) - parseDate(b.date));

  // Création des lignes pour le fichier Excel
  const rows = [
	[
	  { value: 'Date', fontWeight: 'bold', align: 'center', backgroundColor: '#4CAF50', color: '#FFFFFF', borderStyle: 'medium' },
	  { value: 'Référence', fontWeight: 'bold', align: 'center', backgroundColor: '#4CAF50', color: '#FFFFFF', borderStyle: 'medium' },
	  { value: 'Montant en €', fontWeight: 'bold', align: 'center', backgroundColor: '#4CAF50', color: '#FFFFFF', borderStyle: 'medium' }
	]
  ];

  // Ajout des entrées dans les lignes du fichier Excel
  entries.forEach((entry, index) => {
	rows.push([
	  { type: Date, value: parseDate(entry.date), format: 'dd/MM/yyyy', align: 'center', borderStyle: 'thin', backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' },
	  { type: String, value: entry.id, align: 'center', borderStyle: 'thin', backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' },
	  { type: Number, value: entry.amount, format: '0.00', align: 'center', borderStyle: 'thin', backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }
	]);
  });

  rows.push([]);
  
  // Ajout des totaux annuels dans les lignes du fichier Excel
  for (let year in yearlyTotals) {
	rows.push([
	  { type: String, value: `Total ${year}`, align: 'center', fontWeight: 'bold', borderStyle: 'thin', backgroundColor: '#D3D3D3' },
	  null,
	  { type: Number, value: yearlyTotals[year], format: '0.00', align: 'center', fontWeight: 'bold', borderStyle: 'thin', backgroundColor: '#D3D3D3' }
	]);
  }

  // Chemin du fichier de sortie
  const outputPath = path.join(__dirname, 'output.xlsx');
  
  // Écriture du fichier Excel
  await writeXlsxFile(rows, {
	filePath: outputPath,
	columns: [
	  { width: 15 },
	  { width: 30 },
	  { width: 15 }
	]
  });

  // Envoi du fichier Excel généré au client
  res.download(outputPath, 'output.xlsx', (err) => {
	if (err) {
	  console.error(err);
	  res.status(500).send('Error generating Excel file');
	}
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
