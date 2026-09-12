import Library from '../components/library.jsx';
import { listGuides } from '../lib/catalog.js';
export default function HomePage() { return <Library initialGuides={listGuides()} />; }
