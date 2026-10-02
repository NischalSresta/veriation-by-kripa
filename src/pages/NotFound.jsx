import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="section empty-state">
      <p className="eyebrow">NOT FOUND</p>
      <h1>This piece went wandering.</h1>
      <p>Let's find something else in the collection.</p>
      <Link className="button" to="/shop">
        Back to shop <ArrowRight size={18} />
      </Link>
    </section>
  );
}
