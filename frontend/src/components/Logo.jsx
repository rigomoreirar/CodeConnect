import React from 'react';
import { Link } from 'react-router-dom';
import Logo_ from '../assets/500-nbg-logo.png';

const Logo = ({ size, link, isResponsive, phoneSize }) => {
  const styles = {
    width: phoneSize || size,
    height: 'auto',
    maxWidth: isResponsive ? '100%' : 'none',
  };

  return link ? (
    <Link to={link}>
      <img src={Logo_} style={styles} alt="Logo" />
    </Link>
  ) : (
    <img src={Logo_} style={styles} alt="Logo" />
  );
};

export default Logo;
