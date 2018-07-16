import React from "react";

import LogoWhiteSrc from "./Logo.png";
import LogoBlackSrc from "./Logo-Black.png";

const src = { "black": LogoBlackSrc, "white": LogoWhiteSrc};

const Logo = ({ className, color }) => (
  <img src={src[color]} alt="Wibson" className={className} />
);

Logo.defaultProps = {
  color: "white"
}

export default Logo;
