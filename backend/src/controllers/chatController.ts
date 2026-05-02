import { Request, Response } from 'express';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ChatResponse {
  reply: string;
  category: 'simple' | 'sensible' | 'complexe';
  topic: string;
}

function detectTopic(msg: string): ChatResponse {
  const m = msg.toLowerCase();

  // ─── 1. CARTE SIM ──────────────────────────────────────────────────────────
  if (m.includes('puk') || m.includes('p u k')) {
    return { topic: 'sim', category: 'sensible', reply: "Pour récupérer votre code PUK, composez le **#123# ** ou appelez le 900 gratuitement. Vous pouvez aussi vous rendre en agence avec votre pièce d'identité. Souhaitez-vous que je contacte un conseiller ?" };
  }
  if (m.includes('pin') || m.includes('code pin')) {
    return { topic: 'sim', category: 'simple', reply: "Pour débloquer votre code PIN, composez votre code PUK suivi de votre nouveau PIN (2 fois). Composer *123# puis suivez les instructions. Avez-vous votre code PUK sous la main ?" };
  }
  if (m.includes('sim bloquée') || m.includes('carte bloquée') || m.includes('sim non valide') || m.includes('puce bloquée')) {
    return { topic: 'sim', category: 'sensible', reply: "Une SIM bloquée ou invalide nécessite souvent une visite en agence avec votre pièce d'identité valide. Je peux aussi déclencher une procédure de déblocage à distance. Confirmez-vous votre identité ?" };
  }
  if (m.includes('remplacer') && (m.includes('sim') || m.includes('puce') || m.includes('carte'))) {
    return { topic: 'sim', category: 'complexe', reply: "Pour remplacer votre carte SIM perdue ou abîmée, rendez-vous dans une agence Orange CI avec votre pièce d'identité valide. Un conseiller vous remet une nouvelle SIM avec votre numéro conservé. Je peux localiser l'agence la plus proche !" };
  }
  if (m.includes('réidentification') || m.includes('identifier') || m.includes('reidentifier') || m.includes('identification')) {
    return { topic: 'sim', category: 'sensible', reply: "La réidentification SIM se fait en agence Orange avec votre CNI/passeport valide. Depuis le 2023, toute SIM non identifiée peut être suspendue. Je vous accompagne dans la procédure si vous le souhaitez." };
  }
  if (m.includes('mon numéro') || m.includes('connaitre mon numéro') || m.includes('quel est mon numéro')) {
    return { topic: 'sim', category: 'simple', reply: "Pour connaître votre numéro Orange, composez simplement **#123#** sur votre téléphone. Le numéro s'affichera immédiatement à l'écran. 📱" };
  }
  if (m.includes('nouvelle puce') || m.includes('acheter une puce') || m.includes('nouvelle sim')) {
    return { topic: 'sim', category: 'simple', reply: "Vous pouvez acheter une nouvelle SIM Orange dans toutes nos agences, supermarchés partenaires, et points de vente agréés. Elle est vendue avec votre first crédit. Y a-t-il autre chose ?" };
  }
  if (m.includes('ligne suspendue') || m.includes('ligne inactive') || m.includes('ligne coupée')) {
    return { topic: 'sim', category: 'sensible', reply: "Votre ligne peut être suspendue pour non-identification, impayé ou signalement de fraude. Je vais vérifier le statut de votre ligne. Confirmez d'abord votre identité via le capteur d'empreinte." };
  }
  if (m.includes('perte téléphone') || m.includes('volé') || m.includes('récupérer ligne') || m.includes('téléphone perdu')) {
    return { topic: 'sim', category: 'sensible', reply: "En cas de perte ou vol de téléphone, je vais immédiatement bloquer votre SIM pour protéger votre compte Orange Money. Confirmez-vous cette action de sécurité ? Pour valider, nous avons besoin de vérifier votre identité." };
  }

  // ─── 2. CRÉDIT, APPELS & FORFAITS ──────────────────────────────────────────
  if (m.includes('solde') || m.includes('mon crédit') || m.includes('combien il me reste')) {
    return { topic: 'credit', category: 'simple', reply: "Votre solde principal est de **4 500 FCFA**. Vous pouvez aussi le vérifier à tout moment en composant **#111#**. Souhaitez-vous recharger ?" };
  }
  if (m.includes('crédit disparu') || m.includes('crédit débit') || m.includes('argent parti') || m.includes('consommation anormale')) {
    return { topic: 'credit', category: 'complexe', reply: "Des débits anormaux peuvent être causés par des services en abonnement actifs (sonneries, météo, etc.). Je vais analyser votre historique de consommation. Pour tout remboursement, je passe le dossier à un conseiller." };
  }
  if (m.includes('transférer crédit') || m.includes('envoyer crédit') || m.includes('transfert de crédit')) {
    return { topic: 'credit', category: 'simple', reply: "Pour transférer du crédit, composez **#111*2*[numéro]*[montant]#**. Exemple : *111*2*0700000000*500#. Le transfert minimum est de 100 FCFA. ✅" };
  }
  if (m.includes('activer offre') || m.includes('changer offre') || m.includes('forfait') || m.includes('activation')) {
    return { topic: 'credit', category: 'simple', reply: "Pour voir et activer vos offres, composez **#123#** ou ouvrez l'application Max it. Quelle offre vous intéresse ? Appels, SMS, Data ou une offre combinée ?" };
  }
  if (m.includes('numéro préféré') || m.includes('numéros favoris') || m.includes('meilleur ami')) {
    return { topic: 'credit', category: 'simple', reply: "Pour gérer vos numéros préférés (jusqu'à 5 numéros avec tarifs réduits), composez **#123#** > Gérer mes services > Numéros préférés. Souhaitez-vous ajouter ou modifier un numéro ?" };
  }
  if (m.includes('acheter du crédit') || m.includes('recharger') || m.includes('recharge')) {
    return { topic: 'credit', category: 'simple', reply: "Vous pouvez recharger votre crédit Orange avec un code de recharge (carte scratch), via Orange Money (**#144#**), ou via Max it. Les recharges vont de 100 FCFA à 50 000 FCFA. Besoin d'aide ?" };
  }

  // ─── 3. INTERNET MOBILE ────────────────────────────────────────────────────
  if (m.includes('pass internet') || m.includes('forfait data') || m.includes('internet') && m.includes('acheter')) {
    return { topic: 'internet', category: 'simple', reply: "Voici nos Pass Internet populaires :\n• **1Go / 24h** — 200 FCFA → composez *124*1#\n• **3Go / 7 jours** — 800 FCFA → composez *124*3#\n• **10Go / 30 jours** — 2 500 FCFA → composez *124*5#\n\nQuel pass vous convient ?" };
  }
  if (m.includes('solde internet') || m.includes('volume internet') || m.includes('combien data') || m.includes('data restant')) {
    return { topic: 'internet', category: 'simple', reply: "Votre solde Data actuel est de **2,3 Go** valables jusqu'au 10 mai. Composez **#124#** pour vérifier en temps réel. Voulez-vous acheter un Pass supplémentaire ?" };
  }
  if (m.includes('internet ne fonctionne pas') || m.includes('pas de connexion') || m.includes('connexion coupée')) {
    return { topic: 'internet', category: 'complexe', reply: "Voici les premières vérifications :\n1. Assurez-vous que les données mobiles sont activées.\n2. Vérifiez votre solde Data (#124#).\n3. Redémarrez votre téléphone.\n\nSi le problème persiste, je signale un incident réseau dans votre zone. Puis-je avoir votre localisation ?" };
  }
  if (m.includes('configurer internet') || m.includes('configuration apn') || m.includes('régler internet')) {
    return { topic: 'internet', category: 'simple', reply: "Configuration APN Orange CI :\n• **Nom** : Orange CI\n• **APN** : internet.orange.ci\n• **Proxy** : vide\n• **MCC** : 612 | **MNC** : 03\n\nVoulez-vous que je vous guide étape par étape dans votre téléphone ?" };
  }
  if (m.includes('pass non reçu') || m.includes('pass activé') && m.includes('fonctionne pas')) {
    return { topic: 'internet', category: 'complexe', reply: "Si votre Pass Internet est activé mais non fonctionnel, c'est souvent un délai de propagation (max 15 min). Si c'est plus long, je crée une réclamation prioritaire pour remboursement ou réactivation. Puis-je continuer ?" };
  }
  if (m.includes('connexion lente') || m.includes('internet lent') || m.includes('réseau lent')) {
    return { topic: 'internet', category: 'complexe', reply: "Une connexion lente peut être due à une forte affluence dans votre zone ou un problème réseau localisé. Je vais vérifier le statut réseau à votre position. Pouvez-vous m'indiquer votre quartier ou commune ?" };
  }

  // ─── 4. ORANGE MONEY ───────────────────────────────────────────────────────
  if (m.includes('ouvrir compte') || m.includes('créer compte orange money') || m.includes('ouverture orange money')) {
    return { topic: 'orange_money', category: 'simple', reply: "Pour ouvrir un compte Orange Money, il vous faut :\n• Une pièce d'identité valide (CNI, passeport, permis)\n• Une ligne Orange active\n\nComposez **#144#** ou téléchargez **Max it**. Nos agences vous accompagnent aussi gratuitement. Souhaitez-vous de l'aide ?" };
  }
  if ((m.includes('débloquer') || m.includes('déblocage') || m.includes('réinitialiser')) && (m.includes('orange money') || m.includes('om') || m.includes('compte'))) {
    return { topic: 'orange_money', category: 'sensible', reply: "Le déblocage/réinitialisation de compte Orange Money nécessite une vérification d'identité stricte pour votre protection. Veuillez préparer votre pièce d'identité. Je vais lancer la procédure sécurisée." };
  }
  if (m.includes('transaction échouée') || m.includes('transfert échoué') || m.includes('envoi échoué')) {
    return { topic: 'orange_money', category: 'complexe', reply: "Pour une transaction échouée, vérifiez :\n1. Le numéro du destinataire\n2. Votre solde Orange Money\n3. Votre connexion réseau\n\nSi l'argent a déjà été débité, je crée immédiatement une réclamation de remboursement. Confirmez-vous ?" };
  }
  if (m.includes('mauvais numéro') || m.includes('envoyé par erreur') || m.includes('annuler transfert') || m.includes('geler') && m.includes('transfert')) {
    return { topic: 'orange_money', category: 'sensible', reply: "🚨 URGENCE ! Pour geler un transfert envoyé au mauvais numéro, composez immédiatement **#144*967#** ou ouvrez Max it > Historique > Bloquer. Agissez vite, la fenêtre est limitée ! Je lance la procédure maintenant." };
  }
  if (m.includes('code secret') || m.includes('modifier code') || m.includes('changer code om')) {
    return { topic: 'orange_money', category: 'sensible', reply: "Pour modifier votre code secret Orange Money, composez **#144#** > Mon compte > Modifier code secret. Ne communiquez JAMAIS votre code à personne, même un agent Orange. Je vais vérifier votre identité avant de continuer." };
  }
  if (m.includes('payer facture') || m.includes('paiement facture') || m.includes('régler facture')) {
    return { topic: 'orange_money', category: 'simple', reply: "Payez vos factures (CIE, SODECI, CANAL+...) facilement via :\n• **Max it** > Payer > Factures\n• **#144#** > Paiements\n• En agence Orange\n\nQuelle facture souhaitez-vous régler ?" };
  }
  if (m.includes('dépôt') || m.includes('retrait') || m.includes('cash out') || m.includes('cash in')) {
    return { topic: 'orange_money', category: 'simple', reply: "Pour un dépôt/retrait Orange Money :\n• **Dépôt** : chez tout agent Orange Money ou en agence\n• **Retrait** : composez **#144#** > Retrait, ou passez chez un agent\n\nSouhaitez-vous localiser l'agent le plus proche ?" };
  }
  if (m.includes('arnaque') || m.includes('fraude') || m.includes('fraudeur') || m.includes('escroc')) {
    return { topic: 'orange_money', category: 'sensible', reply: "🚨 ATTENTION ARNAQUES ! Orange ne vous demandera JAMAIS votre code secret par SMS ou appel. Si vous suspectez une fraude, bloquez immédiatement votre compte en composant **#144*9#** et appelez le **17** (Police). Je sécurise votre compte maintenant." };
  }
  if (m.includes('transfert') && m.includes('argent') || m.includes('envoyer argent') || m.includes('transférer de l\'argent')) {
    return { topic: 'orange_money', category: 'sensible', reply: "Pour transférer de l'argent via Orange Money, composez **#144#** > Transférer. Les frais varient selon le montant. Pour votre sécurité, je dois confirmer votre identité avant de procéder." };
  }

  // ─── 5. FACTURES ───────────────────────────────────────────────────────────
  if (m.includes('obtenir facture') || m.includes('télécharger facture') || m.includes('avoir ma facture')) {
    return { topic: 'facture', category: 'simple', reply: "Vos factures Orange sont disponibles sur **Max it** > Mon compte > Factures. Vous pouvez aussi les recevoir par email en contactant le 900 ou en agence. Quelle période vous intéresse ?" };
  }
  if (m.includes('contester facture') || m.includes('facture incorrecte') || m.includes('mauvaise facturation')) {
    return { topic: 'facture', category: 'complexe', reply: "Pour contester une facture, je crée un dossier de réclamation. Vous avez 30 jours pour contester une facture après émission. Fournissez le numéro et la période contestée. Puis-je procéder ?" };
  }
  if (m.includes('service coupé') || m.includes('réactiver') && m.includes('facture') || m.includes('impayé')) {
    return { topic: 'facture', category: 'sensible', reply: "Pour réactiver un service coupé suite à une facture impayée, réglez d'abord le montant dû via Orange Money (#144#) ou en agence. La réactivation est généralement immédiate. Souhaitez-vous connaître le montant exact ?" };
  }

  // ─── 6. INTERNET À DOMICILE (FIBRE, FLYBOX, 4G HOME) ──────────────────────
  if (m.includes('fibre') || m.includes('installation fibre') || m.includes('internet maison') || m.includes('internet domicile')) {
    return { topic: 'domicile', category: 'complexe', reply: "Pour souscrire à la Fibre Optique Orange CI :\n1. Vérifiez l'éligibilité de votre adresse au **0703 030 303**\n2. Choisissez votre offre (20 Mbps à 200 Mbps)\n3. Planifiez l'installation avec un technicien\n\nVoulez-vous vérifier votre éligibilité maintenant ?" };
  }
  if (m.includes('flybox') || m.includes('easybox') || m.includes('recharge flybox') || m.includes('volume flybox')) {
    return { topic: 'domicile', category: 'simple', reply: "Pour votre Flybox Orange :\n• **Recharger** : composez *124*[code]# ou via Max it\n• **Solde** : composez **#124#**\n• **Problème** : éteignez/rallumez la Flybox (30 secondes)\n\nQuel est votre problème exact ?" };
  }
  if (m.includes('box') && (m.includes('panne') || m.includes('problème') || m.includes('fonctionne pas')) || m.includes('coupure internet')) {
    return { topic: 'domicile', category: 'complexe', reply: "Pour une panne de box/coupure internet à domicile :\n1. Redémarrez la box (débranchez 30 sec)\n2. Vérifiez les voyants (doit être vert fixe)\n3. Vérifiez le câble si fibre\n\nSi le problème persiste, je demande l'intervention d'un technicien chez vous. Souhaitez-vous ?" };
  }
  if (m.includes('4g home') || m.includes('déménagement') || m.includes('changer adresse') || m.includes('résiliation')) {
    return { topic: 'domicile', category: 'complexe', reply: "Pour un déménagement, changement d'adresse ou résiliation de votre abonnement internet, un traitement en agence est nécessaire avec votre pièce d'identité et le numéro de contrat. Je peux préparer votre dossier. Souhaitez-vous continuer ?" };
  }

  // ─── 7. RÉCLAMATIONS ───────────────────────────────────────────────────────
  if (m.includes('réclamation') || m.includes('remboursement') || m.includes('plainte') || m.includes('service non reçu') || m.includes('recharge non reçue')) {
    return { topic: 'reclamation', category: 'complexe', reply: "Je crée votre dossier de réclamation. Vous pouvez aussi soumettre une réclamation en ligne sur **orange.ci** > Assistance > Réclamation. Délai de traitement : 48–72h ouvrables. Donnez-moi votre numéro et décrivez le problème :" };
  }
  if (m.includes('suivi dossier') || m.includes('statut réclamation') || m.includes('ma réclamation')) {
    return { topic: 'reclamation', category: 'simple', reply: "Pour suivre votre dossier de réclamation, communiquez votre numéro de dossier. Vous pouvez aussi appeler le **900** (gratuit) ou écrire à **serviceClient@orange.ci**. Avez-vous un numéro de dossier ?" };
  }

  // ─── 8. MAX IT & SERVICES DIGITAUX ─────────────────────────────────────────
  if (m.includes('max it') || m.includes('application orange') || m.includes('application mobile')) {
    return { topic: 'maxit', category: 'simple', reply: "**Max it** est l'application officielle Orange CI. Elle permet :\n• Gérer Orange Money 💰\n• Acheter des pass internet 📶\n• Payer des factures 🧾\n• Consulter votre solde\n\nTéléchargez-la gratuitement sur le **Play Store** ou **App Store**. Besoin d'aide pour l'installation ?" };
  }
  if (m.includes('esim') || m.includes('e-sim')) {
    return { topic: 'maxit', category: 'complexe', reply: "L'eSIM Orange CI est disponible pour les téléphones compatibles (iPhone XS+, Samsung S20+). Activez-la via Max it > Mon compte > eSIM, ou en agence avec votre pièce d'identité. Votre appareil est-il compatible ?" };
  }

  // ─── 9. ÉQUIPEMENTS ────────────────────────────────────────────────────────
  if (m.includes('acheter téléphone') || m.includes('smartphone') || m.includes('acheter un appareil')) {
    return { topic: 'equipement', category: 'simple', reply: "La boutique Orange CI propose des smartphones à partir de **15 000 FCFA**, des accessoires, et des box internet. Disponible dans toutes nos agences et sur **orange.ci**. Quel type d'équipement recherchez-vous ?" };
  }
  if (m.includes('configurer') && m.includes('téléphone') || m.includes('paramètre') && m.includes('téléphone')) {
    return { topic: 'equipement', category: 'simple', reply: "Pour configurer internet ou Orange Money sur votre téléphone, nos techniciens en agence peuvent faire cela rapidement sur place. Souhaitez-vous les horaires et localisations des agences ?" };
  }

  // ─── 10. SÉCURITÉ ──────────────────────────────────────────────────────────
  if (m.includes('bloquer') && (m.includes('compte') || m.includes('carte') || m.includes('sim'))) {
    return { topic: 'securite', category: 'sensible', reply: "🔒 Pour bloquer immédiatement votre compte/SIM, composez **#144*9#** pour Orange Money ou appelez le **900** (gratuit, 24h/24) pour la SIM. Cette action est irréversible sans visite en agence. Je lance la procédure ?" };
  }
  if (m.includes('sécuriser') || m.includes('protéger mon compte') || m.includes('vol de données')) {
    return { topic: 'securite', category: 'sensible', reply: "Pour sécuriser votre compte Orange :\n1. Changez régulièrement votre code PIN et code Orange Money\n2. N'utilisez jamais le même code partout\n3. Activez les notifications de transaction\n4. Ne partagez jamais vos codes\n\nVoulez-vous activer la protection renforcée ?" };
  }

  // ─── 11. ENTREPRISES ───────────────────────────────────────────────────────
  if (m.includes('entreprise') || m.includes('professionnel') || m.includes('flotte') || m.includes('pme') || m.includes('cloud') || m.includes('cybersécurité')) {
    return { topic: 'entreprise', category: 'complexe', reply: "Pour les solutions **Orange Business CI** (Fibre entreprise, Flotte mobile, Cloud, Cybersécurité, Orange Money Pro), contactez notre équipe dédiée au **0703 030 303** ou écrivez à **business@orange.ci**. Souhaitez-vous qu'un commercial vous rappelle ?" };
  }
  if (m.includes('distributeur') || m.includes('devenir partenaire') || m.includes('point de vente')) {
    return { topic: 'entreprise', category: 'complexe', reply: "Pour devenir distributeur ou point de vente agréé Orange CI, rendez-vous en agence principale avec votre registre de commerce et pièce d'identité. Notre équipe commerciale étudie votre dossier sous 5 jours. Souhaitez-vous plus d'infos ?" };
  }

  // ─── 12. INFORMATION GÉNÉRALE & ORIENTATION ────────────────────────────────
  if (m.includes('agence') || m.includes('trouver agence') || m.includes('horaires') || m.includes('localiser')) {
    return { topic: 'info', category: 'simple', reply: "Les agences Orange CI sont ouvertes **lundi au samedi de 8h à 17h30** (variables selon le point de vente). Les principales agences sont à :\n• Abidjan (Plateau, Cocody, Yopougon, Adjamé...)\n• San Pedro, Bouaké, Korhogo, Man...\n\nSouhaitez-vous la localisation exacte d'une agence ?" };
  }
  if (m.includes('tarif') || m.includes('prix') || m.includes('coût') || m.includes('combien coûte')) {
    return { topic: 'info', category: 'simple', reply: "Pour consulter tous nos tarifs et offres Orange CI, rendez-vous sur **orange.ci** ou composez **#123#**. Vous pouvez aussi appeler le **900** (gratuit) du lundi au samedi 7h-22h. Sur quelle offre souhaitez-vous des infos ?" };
  }
  if (m.includes('rendez-vous') || m.includes('prendre rdv') || m.includes('rendez vous')) {
    return { topic: 'info', category: 'simple', reply: "Pour prendre rendez-vous en agence Orange CI, appelez le **900** (gratuit) ou rendez-vous directement en agence. Certaines agences acceptent aussi les rendez-vous sur **orange.ci**. Pour quelle démarche ?" };
  }

  // ─── DÉFAUT ─────────────────────────────────────────────────────────────────
  return {
    topic: 'general',
    category: 'simple',
    reply: "Bonjour ! Je suis l'Assistant Orange CI. Je peux vous aider avec :\n\n📱 **SIM & Ligne** | 💳 **Crédit & Forfaits** | 📶 **Internet Mobile** | 💰 **Orange Money** | 🏠 **Internet Domicile** | 📄 **Factures** | 🔒 **Sécurité** | 📞 **Réclamations**\n\nDecrivez votre problème ou cliquez sur un thème !"
  };
}

export const handleChat = async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ error: 'Message requis' });
    return;
  }

  await delay(1200);
  const result = detectTopic(message);
  res.json({ reply: result.reply, category: result.category, topic: result.topic });
};
