// Define menu items
import React from 'react';
import { faCamera, faClockRotateLeft, faShirt, faAdd, faShop, faCertificate } from "@fortawesome/free-solid-svg-icons";

export interface MenuItem {
  name: string;
  icon: any;
  route: string;
  hasTab: boolean;
  hasGate: boolean;
  component: any;
}

export const menuItems = [
  { name: 'Product', icon: faShirt, route: '', hasTab: false, hasGate: false, component: React.lazy(() => import('../home/page')) },
  { name: 'Content', icon: faCamera, route: 'content', hasTab: true, hasGate: true, component: React.lazy(() => import('../content/page')) },
  { name: 'History', icon: faClockRotateLeft, route: 'history', hasTab: false, hasGate: false, component: React.lazy(() => import('../history/page')) },
];