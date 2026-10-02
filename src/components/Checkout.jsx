import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { formatPrice } from '../data/catalog';

export default function Checkout({ subtotal, onDismiss }) {
  const [step, setStep] = useState('delivery');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const total = subtotal + 200;

  if (step === 'complete') return (
    <div className="checkout-success" role="status">
      <Check size={32} />
      <h3>Your demo order is ready.</h3>
      <p>Thanks, {name}. This is a preview confirmation. No order was sent and no payment was taken.</p>
      <p className="detail-price">{formatPrice(total)}</p>
      <button className="button" onClick={onDismiss}>Back to your bag <ArrowRight size={17} /></button>
    </div>
  );

  return (
    <form className="checkout-form" onSubmit={event => {
      event.preventDefault();
      setStep(step === 'delivery' ? 'payment' : 'complete');
    }}>
      <p className="demo-note">Demo checkout. Use sample details. Nothing is sent or charged.</p>
      {step === 'delivery' ? <>
        <label>Full name<input required autoComplete="name" value={name} onChange={event => setName(event.target.value)} placeholder="Your name" /></label>
        <label>Phone number<input required type="tel" autoComplete="tel" value={phone} onChange={event => setPhone(event.target.value)} placeholder="98XXXXXXXX" /></label>
        <label>Delivery address<textarea required autoComplete="street-address" value={address} onChange={event => setAddress(event.target.value)} placeholder="Street, area and city" rows={3} /></label>
      </> : <>
        <div className="checkout-delivery"><h3>Delivery details</h3><p>{name}<br />{phone}<br />{address}</p><button type="button" className="plain-button" onClick={() => setStep('delivery')}>Edit details</button></div>
        <label className="payment-option"><input type="radio" name="payment" checked readOnly /> Cash on delivery <span>Demo</span></label>
      </>}
      <div className="checkout-totals"><div><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div><span>Estimated delivery</span><span>{formatPrice(200)}</span></div><div><strong>Total</strong><strong>{formatPrice(total)}</strong></div></div>
      <button className="button" type="submit">{step === 'delivery' ? 'Continue to payment' : 'Place demo order'} <ArrowRight size={17} /></button>
    </form>
  );
}
