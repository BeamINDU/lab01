import { ClassName } from "@/app/types/class-name";
import { ShapeType } from "@/app/constants/shape-type";

export type Annotation =
  | CircleAnnotation
  | RectangleAnnotation
  | PolygonAnnotation
  | PointAnnotation;

interface BaseAnnotation {
  id: string; 
  type: string;
  color?: ShapeType;
  class: ClassName;
}

export interface CircleAnnotation extends BaseAnnotation {
  type: "circle";
  center: [number, number];
  radius: number;
}

export interface RectangleAnnotation extends BaseAnnotation {
  type: "rectangle";
  bbox: [number, number, number, number]; // [x_min, y_min, x_max, y_max]
}

export interface PolygonAnnotation extends BaseAnnotation {
  type: "polygon";
  points: [number, number][];
}

export interface PointAnnotation extends BaseAnnotation {
  type: "point";
  position: [number, number];
}
