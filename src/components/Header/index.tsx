import Link from 'next/link';

import styles from './header.module.scss';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div>
        <Link href="/">
          <img src="/spacetraveling.svg" alt="logo" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
