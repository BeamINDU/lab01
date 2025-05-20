// declare module 'react-image-annotate' {
//   const Annotator: any;
//   export default Annotator;
// }

declare module 'react-image-annotate' {
  import * as React from "react";

  export interface Region {
    id: string;
    cls: string;
    tags: string[];
    type: "box" | "polygon";
    [key: string]: any;
  }

  export interface Image {
    src: string;
    name: string;
    regions: Region[];
  }

  interface AnnotatorProps {
    selectedImage?: string;
    images: Image[];
    regionClsList?: string[];
    regionTagList?: string[];
    enabledTools?: string[];
    showTags?: boolean;
    onExit?: (output: any) => void;
  }

  const Annotator: React.FC<AnnotatorProps>;

  export default Annotator;
}
