// @project
import branding from '@/branding.json';

export const faq = {
  heading: 'Questions Fréquentes',
  caption: `Réponses aux questions les plus courantes sur ${branding.brandName}.`,
  defaultExpanded: 'Essai gratuit',
  faqList: [
    {
      question: `Est-ce que ${branding.brandName} propose un essai gratuit ?`,
      answer: `Oui ! Le forfait Starter est entièrement gratuit et sans engagement. Vous pouvez gérer jusqu'à 50 produits, 100 transactions par mois et 1 utilisateur. C'est idéal pour tester la plateforme avant de passer à un forfait supérieur.`,
      category: 'Général'
    },
    {
      question: `Quels modules sont inclus dans ${branding.brandName} ?`,
      answer: `${branding.brandName} propose plus de 16 catégories de modules : POS, Facturation, Gestion de Stock, CRM, Ressources Humaines, Comptabilité, E-Commerce, Site Web, Réservation, Production, Analytics, IA et bien plus. Les modules disponibles dépendent de votre forfait.`,
      category: 'Général'
    },
    {
      question: `${branding.brandName} est-il adapté à mon secteur d'activité ?`,
      answer: `Absolument ! ${branding.brandName} supporte plus de 15 types d'activité : commerce de détail, restauration, services, santé, éducation, immobilier, transport, agriculture, technologie, construction, et plus encore. Chaque secteur bénéficie de modules spécialisés.`,
      category: 'Général'
    },
    {
      question: 'La facturation est-elle conforme à la réglementation tunisienne ?',
      answer: `Oui, ${branding.brandName} génère des factures, devis, bons de livraison et avoirs conformes à la législation tunisienne. Le système gère les taux de TVA (19%, 7%, 0%), le matricule fiscal et la numérotation séquentielle obligatoire.`,
      category: 'Général'
    },
    {
      question: 'Comment fonctionnent les tarifs ?',
      answer: {
        content: `${branding.brandName} propose 4 forfaits adaptés à chaque taille d'entreprise :`,
        type: 'list',
        data: [
          { primary: 'Starter : Gratuit — 1 utilisateur, POS basique, 50 produits' },
          { primary: 'Business : 79 TND/mois — 5 utilisateurs, POS complet, CRM, site web' },
          { primary: 'Professionnel : 199 TND/mois — 15 utilisateurs, multi-succursales, BI' },
          { primary: 'Entreprise : Dès 499 TND/mois — illimité, IA, white-label, sur mesure' }
        ]
      },
      category: 'Tarifs'
    },
    {
      question: 'Puis-je changer de forfait à tout moment ?',
      answer: `Oui, vous pouvez passer à un forfait supérieur à tout moment. La différence sera calculée au prorata. Si vous souhaitez réduire votre forfait, le changement prendra effet à la fin de votre période de facturation en cours.`,
      category: 'Tarifs'
    },
    {
      question: 'Existe-t-il une réduction pour le paiement annuel ?',
      answer: 'Oui ! En optant pour le paiement annuel, vous bénéficiez de 2 mois offerts sur les forfaits Business et Professionnel. Par exemple, Business passe de 948 TND/an à 790 TND/an.',
      category: 'Tarifs'
    },
    {
      question: 'Mes données sont-elles sécurisées ?',
      answer: {
        content: `La sécurité est notre priorité. ${branding.brandName} utilise les meilleures pratiques de l'industrie :`,
        type: 'list',
        data: [
          { primary: 'Chiffrement SSL/TLS pour toutes les communications' },
          { primary: 'Authentification JWT avec tokens sécurisés' },
          { primary: 'Sauvegardes automatiques quotidiennes' },
          { primary: 'Hébergement sécurisé avec SLA 99.9%' }
        ]
      },
      category: 'Sécurité & Support'
    },
    {
      question: 'Quel support est disponible ?',
      answer: {
        content: 'Nous offrons plusieurs canaux de support selon votre forfait :',
        type: 'list',
        data: [
          { primary: 'Starter : Documentation en ligne et FAQ' },
          { primary: 'Business : Support par email (réponse sous 24h)' },
          { primary: 'Professionnel : Support prioritaire par email et chat' },
          { primary: 'Entreprise : Account manager dédié, support 4h, formation' }
        ]
      },
      category: 'Sécurité & Support'
    },
    {
      question: `${branding.brandName} fonctionne-t-il hors ligne ?`,
      answer: `Le module POS fonctionne en mode hors-ligne pour garantir la continuité de vos ventes même en cas de coupure internet. Les données se synchronisent automatiquement dès que la connexion est rétablie.`,
      category: 'Général'
    }
  ],
  getInTouch: {
    link: { children: 'Contactez-nous', href: '/contact' }
  },
  categories: ['Général', 'Tarifs', 'Sécurité & Support'],
  activeCategory: 'Général'
};
