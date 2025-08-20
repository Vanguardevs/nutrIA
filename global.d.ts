declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg" {
  import * as React from "react";
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}
declare module "*.gif";
declare module "*.webp";
declare module "*.ttf";
