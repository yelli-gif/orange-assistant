import type { VercelRequest, VercelResponse } from '@vercel/node';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function detectTopic(msg: string, lang: string) {
  const m = msg.toLowerCase();
  
  // Système de traduction simplifiée pour la démo
  const translations: any = {
    dioula: {
      welcome: "A ni sé ! Assistant Orange lo. Moun bè sé ka i dèmè ?",
      puk: "I ka code PUK sôrô yôrô ye #123# lo. A ni sôrô dèmè ?",
      credit: "I ka fǎng (crédit) bè 4 500 FCFA lo. I bè mogo dèmè ?",
      general: "I ka moun fǎng (problème) bè ? N'bè i dèmè."
    },
    baoule: {
      welcome: "Mo ! Assistant Orange o. Nzu yɛ n kwla yo m man wɔ ?",
      puk: "Sɛ a klo a sika code PUK o, kpan #123#. Nzu ekun ?",
      credit: "O sika (crédit) ti 4 500 FCFA. A klo kɛ un uka wɔ ?",
      general: "Nzu yɛ o yo wɔ o ? N'ti uka wɔ."
    },
    nouchi: {
      welcome: "Y'a quoi ! C'est ton Assistant Orange. On dit quoi ?",
      puk: "Pour ton PUK là, tape seulement #123# mon kôrô. C'est propre ?",
      credit: "Il te reste 4 500 balles sur ton compte. On recharge ?",
      general: "C'est quel gawa tu as ? Je vais te dja (aider)."
    },
    en: {
      welcome: "Hello! I am your Orange Assistant. How can I help you?",
      puk: "To get your PUK code, dial **#123#**. Need more help?",
      credit: "Your balance is 4,500 FCFA. Want to top up?",
      general: "What is your issue today? I'm here to help."
    }
  };

  // Logique de réponse (priorité aux langues locales si sélectionnées)
  if (lang !== 'fr' && translations[lang]) {
    const t = translations[lang];
    if (m.includes('puk')) return { topic: 'sim', category: 'sensible', reply: t.puk };
    if (m.includes('solde') || m.includes('credit')) return { topic: 'credit', category: 'simple', reply: t.credit };
    if (m.includes('bienvenue') || m.includes('bonjour') || m.includes('start')) return { topic: 'info', category: 'simple', reply: t.welcome };
    return { topic: 'general', category: 'simple', reply: t.general };
  }

  // --- LOGIQUE FRANÇAISE (EXISTANTE) ---
  // ─── CARTE SIM ──────────────────────────────────────────────────────────
  if (m.includes('puk') || m.includes('p u k')) {
    return { topic: 'sim', category: 'sensible', reply: "Pour récupérer votre code PUK, composez le **#123#** ou appelez le **900** gratuitement. Vous pouvez aussi vous rendre en agence avec votre pièce d'identité. Souhaitez-vous que je contacte un conseiller ?" };
  }

  if (m.includes('pin') || m.includes('code pin')) {
    return { topic: 'sim', category: 'simple', reply: "Pour débloquer votre code PIN, composez votre code PUK suivi de votre nouveau PIN (2 fois). Composez **#123#** puis suivez les instructions. Avez-vous votre code PUK sous la main ?" };
  }
  if (m.includes('sim bloquée') || m.includes('carte bloquée') || m.includes('sim non valide') || m.includes('puce bloquée')) {
    return { topic: 'sim', category: 'sensible', reply: "Une SIM bloquée ou invalide nécessite souvent une visite en agence avec votre pièce d'identité valide. Je peux déclencher une procédure de déblocage. Confirmez votre identité pour continuer." };
  }
  if ((m.includes('remplacer') || m.includes('nouvelle')) && (m.includes('sim') || m.includes('puce') || m.includes('carte'))) {
    return { topic: 'sim', category: 'complexe', reply: "Pour remplacer votre carte SIM perdue ou abîmée, rendez-vous en agence Orange CI avec votre pièce d'identité valide. Votre numéro sera conservé. Souhaitez-vous localiser l'agence la plus proche ?" };
  }
  if (m.includes('réidentification') || m.includes('identifier') || m.includes('identification')) {
    return { topic: 'sim', category: 'sensible', reply: "La réidentification SIM se fait en agence Orange avec votre CNI/passeport valide. Depuis 2023, toute SIM non identifiée peut être suspendue. Je vous accompagne dans la procédure." };
  }
  if (m.includes('mon numéro') || m.includes('connaitre mon numéro') || m.includes('quel est mon numéro')) {
    return { topic: 'sim', category: 'simple', reply: "Pour connaître votre numéro Orange, composez simplement **#123#** sur votre téléphone. Le numéro s'affichera immédiatement à l'écran. 📱" };
  }
  if (m.includes('ligne suspendue') || m.includes('ligne inactive') || m.includes('ligne coupée')) {
    return { topic: 'sim', category: 'sensible', reply: "Votre ligne peut être suspendue pour non-identification, impayé ou signalement de fraude. Je vais vérifier le statut de votre ligne. Veuillez confirmer votre identité via l'authentification biométrique." };
  }
  if (m.includes('perte téléphone') || m.includes('volé') || m.includes('téléphone perdu')) {
    return { topic: 'sim', category: 'sensible', reply: "En cas de perte ou vol de téléphone, je vais immédiatement bloquer votre SIM pour protéger votre compte Orange Money. Confirmez-vous cette action de sécurité ? Une vérification d'identité est requise." };
  }

  // ─── CRÉDIT, APPELS & FORFAITS ──────────────────────────────────────────
  if (m.includes('solde') || m.includes('mon crédit') || m.includes('combien il me reste') || m.includes('mon solde')) {
    return { topic: 'credit', category: 'simple', reply: "Votre solde principal est de **4 500 FCFA**. Vous pouvez aussi le vérifier à tout moment en composant **#111#**. Souhaitez-vous recharger ou activer un forfait ?" };
  }
  if (m.includes('crédit disparu') || m.includes('consommation anormale') || m.includes('débit')) {
    return { topic: 'credit', category: 'complexe', reply: "Des débits anormaux peuvent être causés par des services en abonnement actifs. Je vais analyser votre historique de consommation. Pour un remboursement, je transfère le dossier à un conseiller." };
  }
  if (m.includes('transférer crédit') || m.includes('envoyer du crédit') || m.includes('transfert de crédit')) {
    return { topic: 'credit', category: 'simple', reply: "Pour transférer du crédit, composez **#111*2*[numéro]*[montant]#**. Exemple : *111*2*0700000000*500# pour envoyer 500 FCFA. Le transfert minimum est de 100 FCFA. ✅" };
  }
  if (m.includes('activer offre') || m.includes('changer offre') || m.includes('forfait')) {
    return { topic: 'credit', category: 'simple', reply: "Pour voir et activer vos offres Orange, composez **#123#** ou ouvrez l'application **Max it**. Quelle offre vous intéresse ? Appels, SMS, Data ou une offre combinée ?" };
  }
  if (m.includes('recharger') || m.includes('recharge') || m.includes('acheter du crédit')) {
    return { topic: 'credit', category: 'simple', reply: "Vous pouvez recharger votre crédit Orange avec un code de recharge (carte scratch), via Orange Money (**#144#**), ou via Max it. Les recharges vont de 100 FCFA à 50 000 FCFA." };
  }

  // ─── INTERNET MOBILE ────────────────────────────────────────────────────
  if (m.includes('pass internet') || (m.includes('internet') && m.includes('acheter'))) {
    return { topic: 'internet', category: 'simple', reply: "Voici nos Pass Internet populaires :\n• **1Go / 24h** — 200 FCFA → composez *124*1#\n• **3Go / 7 jours** — 800 FCFA → composez *124*3#\n• **10Go / 30 jours** — 2 500 FCFA → composez *124*5#\n\nQuel pass vous convient ?" };
  }
  if (m.includes('solde internet') || m.includes('volume internet') || m.includes('data restant')) {
    return { topic: 'internet', category: 'simple', reply: "Votre solde Data actuel est de **2,3 Go** valables jusqu'au 10 mai. Composez **#124#** pour vérifier en temps réel. Voulez-vous acheter un Pass supplémentaire ?" };
  }
  if (m.includes('internet ne fonctionne pas') || m.includes('pas de connexion') || m.includes('internet lent') || m.includes('connexion lente')) {
    return { topic: 'internet', category: 'complexe', reply: "Pour diagnostiquer votre connexion :\n1. Activez les données mobiles dans les paramètres\n2. Vérifiez votre solde Data (#124#)\n3. Redémarrez votre téléphone\n\nSi le problème persiste, je signale un incident réseau dans votre zone. Pouvez-vous me donner votre commune ?" };
  }
  if (m.includes('configurer internet') || m.includes('configuration apn') || m.includes('régler internet')) {
    return { topic: 'internet', category: 'simple', reply: "Configuration APN Orange CI :\n• **Nom** : Orange CI\n• **APN** : internet.orange.ci\n• **MCC** : 612 | **MNC** : 03\n\nVoulez-vous que je vous guide étape par étape ?" };
  }

  // ─── ORANGE MONEY ───────────────────────────────────────────────────────
  if (m.includes('ouvrir compte') || m.includes('créer compte orange money') || m.includes('ouverture orange money')) {
    return { topic: 'orange_money', category: 'simple', reply: "Pour ouvrir un compte Orange Money :\n• Une pièce d'identité valide (CNI, passeport, permis)\n• Une ligne Orange active\n\nComposez **#144#** ou téléchargez **Max it**. Nos agences vous accompagnent gratuitement. Souhaitez-vous de l'aide ?" };
  }
  if ((m.includes('débloquer') || m.includes('réinitialiser')) && (m.includes('orange money') || m.includes('om') || m.includes('compte'))) {
    return { topic: 'orange_money', category: 'sensible', reply: "Le déblocage/réinitialisation de compte Orange Money nécessite une vérification d'identité stricte pour votre protection. Veuillez préparer votre pièce d'identité. Je lance la procédure sécurisée." };
  }
  if (m.includes('transaction échouée') || m.includes('transfert échoué') || m.includes('envoi échoué')) {
    return { topic: 'orange_money', category: 'complexe', reply: "Pour une transaction échouée :\n1. Vérifiez le numéro du destinataire\n2. Vérifiez votre solde Orange Money\n3. Vérifiez votre réseau\n\nSi l'argent a été débité sans succès, je crée une réclamation de remboursement prioritaire. Confirmez-vous ?" };
  }
  if (m.includes('mauvais numéro') || m.includes('envoyé par erreur') || m.includes('annuler transfert') || (m.includes('geler') && m.includes('transfert'))) {
    return { topic: 'orange_money', category: 'sensible', reply: "🚨 URGENCE ! Pour geler un transfert envoyé au mauvais numéro, composez immédiatement **#144*967#** ou ouvrez Max it > Historique > Bloquer. La fenêtre de blocage est limitée dans le temps. Je lance la procédure maintenant !" };
  }
  if (m.includes('code secret') || m.includes('modifier code') || m.includes('changer code om')) {
    return { topic: 'orange_money', category: 'sensible', reply: "Pour modifier votre code secret Orange Money, composez **#144#** > Mon compte > Modifier code secret. ⚠️ Ne communiquez JAMAIS votre code à personne, même un agent Orange. Je vais vérifier votre identité avant de continuer." };
  }
  if (m.includes('transférer de l\'argent') || m.includes('envoyer argent') || m.includes('transfert argent')) {
    return { topic: 'orange_money', category: 'sensible', reply: "Pour transférer de l'argent via Orange Money, composez **#144#** > Transférer. Les frais varient selon le montant. Pour votre sécurité, je dois confirmer votre identité avant de procéder." };
  }
  if (m.includes('arnaque') || m.includes('fraude') || m.includes('escroc')) {
    return { topic: 'orange_money', category: 'sensible', reply: "🚨 ALERTE ! Orange ne vous demandera JAMAIS votre code secret par SMS ou appel. Si vous suspectez une fraude, bloquez immédiatement votre compte en composant **#144*9#** et appelez le **17** (Police). Je sécurise votre compte maintenant." };
  }
  if (m.includes('dépôt') || m.includes('retrait')) {
    return { topic: 'orange_money', category: 'simple', reply: "Pour un dépôt/retrait Orange Money :\n• **Dépôt** : chez tout agent Orange Money ou en agence\n• **Retrait** : composez **#144#** > Retrait, ou passez chez un agent\n\nSouhaitez-vous localiser l'agent le plus proche ?" };
  }
  if (m.includes('payer facture') || m.includes('régler facture')) {
    return { topic: 'orange_money', category: 'simple', reply: "Payez vos factures (CIE, SODECI, CANAL+...) facilement via :\n• **Max it** > Payer > Factures\n• **#144#** > Paiements\n• En agence Orange\n\nQuelle facture souhaitez-vous régler ?" };
  }

  // ─── FACTURES ──────────────────────────────────────────────────────────
  if (m.includes('obtenir facture') || m.includes('télécharger facture') || m.includes('facture')) {
    return { topic: 'facture', category: 'simple', reply: "Vos factures Orange sont disponibles sur **Max it** > Mon compte > Factures. Vous pouvez aussi les recevoir par email en contactant le **900** ou en agence. Quelle période vous intéresse ?" };
  }

  // ─── INTERNET DOMICILE ────────────────────────────────────────────────
  if (m.includes('fibre') || m.includes('internet maison') || m.includes('internet domicile')) {
    return { topic: 'domicile', category: 'complexe', reply: "Pour souscrire à la Fibre Optique Orange CI :\n1. Vérifiez l'éligibilité de votre adresse au **0703 030 303**\n2. Choisissez votre offre (20 Mbps à 200 Mbps)\n3. Planifiez l'installation gratuite\n\nSouhaitez-vous vérifier votre éligibilité ?" };
  }
  if (m.includes('flybox') || m.includes('easybox') || m.includes('recharge flybox')) {
    return { topic: 'domicile', category: 'simple', reply: "Pour votre Flybox Orange :\n• **Solde** : composez **#124#**\n• **Recharger** : composez *124*[code]# ou via Max it\n• **Panne** : éteignez/rallumez la box (30 secondes)\n\nQuel est votre problème exact ?" };
  }
  if ((m.includes('box') && (m.includes('panne') || m.includes('fonctionne pas'))) || m.includes('coupure internet')) {
    return { topic: 'domicile', category: 'complexe', reply: "Pour une panne de box :\n1. Redémarrez la box (débranchez 30 sec)\n2. Vérifiez les voyants (doit être vert fixe)\n3. Vérifiez les câbles\n\nSi le problème persiste, je demande l'intervention d'un technicien. Souhaitez-vous ?" };
  }

  // ─── RÉCLAMATIONS ──────────────────────────────────────────────────────
  if (m.includes('réclamation') || m.includes('remboursement') || m.includes('plainte') || m.includes('service non reçu')) {
    return { topic: 'reclamation', category: 'complexe', reply: "Je crée votre dossier de réclamation. Vous pouvez aussi soumettre une réclamation sur **orange.ci** > Assistance > Réclamation. Délai de traitement : 48–72h ouvrables. Décrivez votre problème :" };
  }

  // ─── MAX IT & DIGITAL ──────────────────────────────────────────────────
  if (m.includes('max it') || m.includes('application orange')) {
    return { topic: 'maxit', category: 'simple', reply: "**Max it** est l'application officielle Orange CI. Elle permet de :\n• Gérer Orange Money 💰\n• Acheter des pass internet 📶\n• Payer des factures 🧾\n• Consulter votre solde\n\nTéléchargez-la gratuitement sur **Play Store** ou **App Store**." };
  }

  // ─── SÉCURITÉ ──────────────────────────────────────────────────────────
  if (m.includes('bloquer') && (m.includes('compte') || m.includes('carte') || m.includes('sim'))) {
    return { topic: 'securite', category: 'sensible', reply: "🔒 Pour bloquer votre compte/SIM immédiatement, composez **#144*9#** (Orange Money) ou appelez le **900** (SIM, gratuit 24h/24). Je lance la procédure sécurisée. Confirmez-vous ?" };
  }

  // ─── ENTREPRISES ──────────────────────────────────────────────────────
  if (m.includes('entreprise') || m.includes('professionnel') || m.includes('flotte') || m.includes('cloud')) {
    return { topic: 'entreprise', category: 'complexe', reply: "Pour les solutions **Orange Business CI** (Fibre entreprise, Flotte mobile, Cloud, Cybersécurité), contactez notre équipe au **0703 030 303** ou sur **orange.ci/business**. Souhaitez-vous qu'un commercial vous rappelle ?" };
  }

  // ─── INFO GÉNÉRALE ──────────────────────────────────────────────────────
  if (m.includes('agence') || m.includes('horaires') || m.includes('localiser')) {
    return { topic: 'info', category: 'simple', reply: "Les agences Orange CI sont ouvertes **lundi au samedi de 8h à 17h30**. Principales agences à Abidjan : Plateau, Cocody, Yopougon, Adjamé, Marcory. Souhaitez-vous la localisation exacte ?" };
  }

  // ─── DÉFAUT ─────────────────────────────────────────────────────────────
  return {
    topic: 'general',
    category: 'simple',
    reply: "Bonjour ! Je suis l'Assistant Orange CI. Je peux vous aider avec :\n\n📱 **SIM & Ligne** | 💳 **Crédit & Forfaits** | 📶 **Internet Mobile** | 💰 **Orange Money** | 🏠 **Internet Domicile** | 📄 **Factures** | 🔒 **Sécurité** | ⚠️ **Réclamations**\n\nDécrivez votre problème et je vous guide !"
  };
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { message, language } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message requis' });
  }

  const result = detectTopic(message, language || 'fr');

  
  // Simulation de données riches pour la démo
  let visual = null;
  let actions = [];

  if (result.topic === 'sim' && message.toLowerCase().includes('puk')) {
    visual = "https://www.orange.ci/media/puk_guide.png"; // Image illustrative
  }

  if (result.topic === 'credit') {
    actions.push({ label: "Recharger sur Max it", type: "maxit", url: "https://maxit.orange.ci/recharge" });
  }

  if (result.category === 'complexe') {
    actions.push({ label: "Parler à un agent (WhatsApp)", type: "whatsapp", url: "https://wa.me/2250707070707" });
  }

  if (result.topic === 'orange_money') {
    actions.push({ label: "Ouvrir mon compte", type: "maxit", url: "https://maxit.orange.ci/om" });
  }

  return res.status(200).json({ 
    reply: result.reply, 
    category: result.category, 
    topic: result.topic,
    visual,
    actions
  });
}

