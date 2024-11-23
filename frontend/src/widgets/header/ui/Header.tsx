import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from '@tanstack/react-router';

export const Header: React.FC = () => {
  return (
    <>
      <div className="full-width container mx-auto flex justify-between">
        <div className="flex gap-2 p-2">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>{' '}
          <Link to="/counter" className="[&.active]:font-bold">
            Counter
          </Link>
          <Link to="/about" className="[&.active]:font-bold">
            About
          </Link>
        </div>
        <div>
          <ConnectButton />
        </div>
      </div>
      <hr />
    </>
  );
};
