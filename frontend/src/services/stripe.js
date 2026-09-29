const API_URL = import.meta.env.VITE_API_URL || '';

export const createCheckoutSession = async (items, customerEmail, customerName) => {
  try {
    const response = await fetch(`${API_URL}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        customerEmail,
        customerName
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw error;
  }
};

export const getSessionDetails = async (sessionId) => {
  try {
    const response = await fetch(`${API_URL}/api/stripe/session/${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get session details');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Session details error:', error);
    throw error;
  }
};
