const stripe = Stripe('your-stripe-publishable-key');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

const paymentButton = document.querySelector('.payment button');
paymentButton.addEventListener('click', async () => {
  const response = await fetch('https://the-100-marriage-backend.herokuapp.com/api/payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@example.com', amount: 4900 }) // $49 in cents
  });
  const { clientSecret } = await response.json();

  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: { card: cardElement }
  });

  if (result.paymentIntent.status === 'succeeded') {
    window.location.href = '/results';
  } else {
    alert('Payment failed. Please try again.');
  }
});