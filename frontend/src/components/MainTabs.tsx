import { Navigate, Route } from "react-router-dom";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from "@ionic/react";
import {
  homeOutline,
  cubeOutline,
  receiptOutline,
  peopleOutline,
} from "ionicons/icons";
import Home from "../pages/Home";
import Products from "../pages/Products";
import NewProduct from "../pages/NewProduct";
import Orders from "../pages/Orders";
import OrderDetail from "../pages/OrderDetail";
import NewOrder from "../pages/NewOrder";
import Partners from "../pages/Partners";
import NewPartner from "../pages/NewPartner";

export default function MainTabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<NewProduct />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/new" element={<NewOrder />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/partners/new" element={<NewPartner />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home">
          <IonIcon icon={homeOutline} />
          <IonLabel>Accueil</IonLabel>
        </IonTabButton>
        <IonTabButton tab="products" href="/products">
          <IonIcon icon={cubeOutline} />
          <IonLabel>Produits</IonLabel>
        </IonTabButton>
        <IonTabButton tab="orders" href="/orders">
          <IonIcon icon={receiptOutline} />
          <IonLabel>Commandes</IonLabel>
        </IonTabButton>
        <IonTabButton tab="partners" href="/partners">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Clients</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
