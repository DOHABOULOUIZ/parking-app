import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createApiClient } from '../config/api';
import './ChatBot.css';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: '👋 Bonjour! Comment puis-je vous aider?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { token, user } = useSelector(state => state.user);

  // Questions rapides disponibles
  const quickQuestions = [
    { text: 'Combien de places disponibles?', icon: '🅿️', label: 'Places libres' },
    { text: 'Comment payer?', icon: '💳', label: 'Comment payer' },
    { text: 'Quel est mon ticket?', icon: '🎟️', label: 'Mon ticket' },
    { text: 'Comment utiliser le QR code?', icon: '📱', label: 'QR Code' },
    { text: 'Support', icon: '📞', label: 'Contact' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ❌ Ne pas afficher le chatbot si pas connecté - DOIT être APRÈS tous les hooks
  if (!token) return null;

  // ============ CHATBOT RESPONSES ============
  const getBotResponse = async (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();

    // 🅿️ Question: Combien de places disponibles?
    if (lowerMsg.includes('place') || lowerMsg.includes('disponible') || lowerMsg.includes('libre')) {
      try {
        const apiClient = createApiClient(token);
        const response = await apiClient.get('/api/places/available');
        const availablePlaces = response.data.available_count || response.data.count || 0;
        const totalPlaces = response.data.total_count || 100;
        return `✅ Il y a actuellement **${availablePlaces} places disponibles** sur ${totalPlaces} au total.`;
      } catch (err) {
        return '✅ Nous avons actuellement plusieurs places libres. Vous pouvez les réserver via l\'application!';
      }
    }

    // 🎟️ Question: Quel est mon ticket?
    if (lowerMsg.includes('ticket') || lowerMsg.includes('réservation') || lowerMsg.includes('mon')) {
      if (!user?.id) {
        return '📋 Vous devez d\'abord vous connecter pour voir vos réservations. Connectez-vous via le bouton en haut à droite.';
      }
      try {
        const apiClient = createApiClient(token);
        const response = await apiClient.get('/api/reservations/my');
        const reservations = response.data.data || response.data || [];
        
        if (reservations.length === 0) {
          return '📋 Vous n\'avez pas encore de réservation. Réservez une place dès maintenant!';
        }

        const latest = reservations[0];
        return `🎟️ Votre dernière réservation:\n📍 **${latest.place?.name || 'Place #' + latest.place_id}**\n📅 **Date:** ${new Date(latest.start_time).toLocaleDateString('fr-FR')}\n⏱️ **Durée:** ${latest.duration || '2'} heures`;
      } catch (err) {
        return '📋 Vous pouvez voir vos réservations dans votre profil!';
      }
    }

    // 💳 Question: Comment payer?
    if (lowerMsg.includes('payer') || lowerMsg.includes('payment') || lowerMsg.includes('prix') || lowerMsg.includes('coût')) {
      return `💳 **Comment payer votre réservation:**\n1️⃣ Sélectionnez une place et la durée\n2️⃣ Cliquez sur "Réserver"\n3️⃣ ⏳ Attendez l'approbation de l'administrateur (vous recevrez une notification)\n4️⃣ Une fois approuvé, choisissez votre méthode de paiement\n5️⃣ Complétez le paiement sécurisé\n\n💳 Nous acceptons: Cartes bancaires, PayPal et portefeuilles mobiles.`;
    }

    // 🔐 Question: Comment me connecter?
    if (lowerMsg.includes('connecter') || lowerMsg.includes('login') || lowerMsg.includes('inscription')) {
      return `🔐 **Pour vous connecter:**\n1️⃣ Cliquez sur "Connexion" en haut à droite\n2️⃣ Entrez votre email et mot de passe\n3️⃣ Ou créez un nouveau compte en cliquant "S'inscrire"\n\nVous recevrez une confirmation par email.`;
    }

    // 📱 Question: Comment utiliser le QR code?
    if (lowerMsg.includes('qr') || lowerMsg.includes('code') || lowerMsg.includes('entrée') || lowerMsg.includes('sortie')) {
      return `📱 **QR Code Check-in/out:**\n✅ À l'entrée: Scannez le QR code pour enregistrer votre arrivée\n✅ À la sortie: Scannez le QR code pour enregistrer votre départ\n\nLe QR code est dans votre profil sous "Mes Réservations".`;
    }

    // 📞 Question: Contact / Support
    if (lowerMsg.includes('support') || lowerMsg.includes('contact') || lowerMsg.includes('aider') || lowerMsg.includes('problème')) {
      return `📞 **Besoin d\'aide?**\n📧 Email: support@parking.com\n📱 Téléphone: +212 5XX XXX XXX\n💬 Chat en direct: Disponible 24/7\n🕐 Horaires: Lun-Dim 8h-22h`;
    }

    // 💰 Question: Tarifs / Pricing
    if (lowerMsg.includes('tarif') || lowerMsg.includes('prix') || lowerMsg.includes('tarification')) {
      return `💰 **Nos tarifs:**\n🕐 1 heure: 5€\n🕐 2 heures: 9€\n🕐 4 heures: 15€\n🕐 Journée (24h): 25€\n\n📉 Réductions disponibles pour les abonnements mensuels!`;
    }

    // Default response
    return `😊 Je n'ai pas bien compris votre question. Essayez de demander:\n✅ "Combien de places disponibles?"\n✅ "Quel est mon ticket?"\n✅ "Comment payer?"\n✅ "Comment utiliser le QR code?"\n✅ "Contactez le support"`;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMsg = input;
    setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    // Get bot response
    const botResponse = await getBotResponse(userMsg);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
      setLoading(false);
    }, 500);
  };

  const handleQuickQuestion = (question) => {
    setMessages(prev => [...prev, { type: 'user', text: question }]);
    setLoading(true);

    getBotResponse(question).then(response => {
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'bot', text: response }]);
        setLoading(false);
      }, 300);
    });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Ouvrir le chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div>
              <h4>🤖 Assistant Parking</h4>
              <p>En ligne 24/7</p>
            </div>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}`}>
                <div className="message-content">
                  {msg.text.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions - Affichées après chaque réponse du bot */}
          {!loading && messages.length > 1 && (
            <div className="quick-questions">
              <p className="quick-questions-label">📋 Autres questions:</p>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q.text)}
                  className="quick-btn"
                >
                  {q.icon} {q.label}
                </button>
              ))}
            </div>
          )}

          {/* Quick Questions au démarrage */}
          {messages.length === 1 && (
            <div className="quick-questions">
              <p className="quick-questions-label">💬 Comment puis-je vous aider?</p>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q.text)}
                  className="quick-btn"
                >
                  {q.icon} {q.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSendMessage} className="chatbot-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              disabled={loading}
              className="chatbot-input"
            />
            <button type="submit" disabled={loading} className="btn-professional btn-success btn-sm">
              {loading ? '⏳' : '➤'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
