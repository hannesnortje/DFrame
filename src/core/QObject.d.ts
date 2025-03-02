import { QEvent } from './QEvent';
import { QProperty } from './QProperty';
import { QMap } from './containers/QMap';
import { QVariant } from './containers/QVariant';

export type Signal<T = void> = (arg: T) => void;
export type Property = string | number | boolean | object | undefined | null;

export interface ConnectionOptions {
  type?: 'auto' | 'direct' | 'queued' | 'blocking';
  context?: any;
  singleShot?: boolean;
}

export declare class QObject {
  constructor(parent?: QObject | null);
  
  // Object naming and hierarchy
  setObjectName(name: string): void;
  objectName(): string;
  getObjectName(): string;
  setParent(parent: QObject | null): void;
  parent(): QObject | null;
  getParent(): QObject | null;
  children(): QObject[];
  childAt(index: number): QObject | null;
  
  // Finding children
  findChild<T extends QObject>(name: string): T | null;
  findChildren<T extends QObject>(name: string): T[];
  
  // Signal/slot system
  connect<T>(signal: string, slot: (arg?: T) => void, options?: ConnectionOptions): number;
  disconnect<T>(signal: string, slot?: Signal<T>): void;
  disconnectById(id: number): boolean;
  emit<T>(signal: string, arg?: T): void;
  blockSignalsTemporarily(block: boolean): boolean;
  signalsBlocked(): boolean;
  
  // Property system
  setProperty(name: string, value: any): boolean;
  property(name: string, defaultValue?: any): any;
  setDynamicProperty(name: string, value: any): boolean;
  dynamicProperty(name: string): any;
  propertyObject<T>(name: string): QProperty<T> | undefined;
  
  // Relationships
  addRelationship(type: string, object: QObject): void;
  removeRelationship(type: string, object: QObject): void;
  relatedObjects(type: string): QObject[];
  
  // Event handling
  installEventFilter(filter: QObject): void;
  removeEventFilter(filter: QObject): void;
  event(event: QEvent): boolean;
  eventFilter(watched: QObject, event: QEvent): boolean;
  
  // Object lifecycle
  deleteLater(): void;
  destroy(): void;
  dumpObjectInfo(): void;
  
  // Internal API
  _registerProperty<T>(name: string, property: QProperty<T>): void;
}
