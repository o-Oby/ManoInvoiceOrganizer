# ManoInvoiceOrganizer

ManoInvoiceOrganizer est un outil conçu pour aider les conseillers de ManoMano à trier et organiser les factures chaotiques, facilitant ainsi leur utilisation dans le cadre de procès au prud'homme. Le programme permet de convertir des textes bruts contenant les données du tableau Workbench en un fichier CSV bien structuré et organisé par date, avec des totaux annuels calculés automatiquement.

## Table des matières

- [Description](#description)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [License](#license)

## Description

ManoInvoiceOrganizer est un outil web conçu pour aider les conseillers de ManoMano à trier et organiser les factures issues de Workbench. Il permet de convertir les données brutes du tableau Workbench en un fichier CSV bien structuré. Le fichier CSV inclut la date, la référence et le montant de chaque facture, ainsi que le total des montants pour chaque année.

## Prérequis

- Node.js (v12.0.0 ou version ultérieure)
- npm (Node Package Manager)

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votreutilisateur/ManoInvoiceOrganizer.git
   cd ManoInvoiceOrganizer

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Mettez en place votre structure de répertoires publics :
   ```
   ManoInvoiceOrganizer/
   ├── index.js
   ├── public/
   │   ├── index.html
   │   └── script.js
   └── README.md
   ```

## Utilisation

1. **Démarrez le serveur :**

   ```bash
   node index.js
   ```

2. **Accédez à l'interface web :**

   Ouvrez votre navigateur web et allez à l'adresse `http://localhost:3000` (ou l'adresse IP de votre serveur).

3. **Utiliser ManoInvoiceOrganizer :**

   - **Connexion à Workbench :** Connectez-vous à votre compte ManoMano sur la plateforme Workbench.
   - **Sélection des factures :** Sélectionnez avec votre souris tout le tableau où sont affichées vos factures. Ce tableau comprend les champs : Date, Référence, Valeur, État du paiement, et même Télécharger la facture. Bien que les deux derniers champs ne seront pas pris en compte, il est plus simple de copier l'ensemble du tableau.
   - **Navigation entre les pages :** Cliquez sur la petite flèche en bas de la page pour passer à la page suivante des factures. Le texte restera sélectionné, mais ce sont les valeurs de la deuxième page qui s'afficheront.
   - **Copie et collage :** Copiez le contenu sélectionné (Ctrl+C ou Cmd+C). Accédez à l'interface web de ManoInvoiceOrganizer. Collez le contenu dans la zone de texte prévue à cet effet (Ctrl+V ou Cmd+V). Répétez l'opération pour toutes les pages de factures afin d'avoir toutes les données dans la zone de texte.
   - **Génération du CSV :** Une fois toutes les pages copiées et collées, cliquez sur le bouton "Convertir en CSV". Un tableau au format CSV sera généré. Ce tableau comprendra le montant, la référence et la date de chaque facture, ainsi que la somme totale des factures pour chaque année.

## License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
```
