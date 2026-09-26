import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonSpinner,
} from "@ionic/react";
import {
  cubeOutline,
  alertCircleOutline,
  documentTextOutline,
  checkmarkCircleOutline,
  logOutOutline,
} from "ionicons/icons";
import { api, clearToken } from "../services/api";
import { Product } from "../models/Product";
import { Order } from "../models/Order";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [draftCount, setDraftCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const productsData = await api.get("/products/");
        const products: Product[] = productsData.results;
        setProductCount(products.length);
        setLowStockCount(products.filter((p) => p.stock <= 10).length);

        const ordersData = await api.get("/orders/");
        const orders: Order[] = ordersData.results;
        setDraftCount(orders.filter((o) => o.status === "draft").length);
        setConfirmedCount(
          orders.filter((o) => o.status === "confirmed").length,
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  async function handleLogout() {
    await clearToken();
    navigate("/login");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Mini-ERP</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="home-banner">
          <h1>Bonjour 👋</h1>
          <p>Voici l'état de votre activité aujourd'hui</p>
        </div>

        {loading ? (
          <div className="ion-text-center ion-padding">
            <IonSpinner />
          </div>
        ) : (
          <IonGrid className="ion-padding">
            <IonRow>
              <IonCol size="6">
                <IonCard>
                  <IonCardContent className="ion-text-center">
                    <IonIcon
                      icon={cubeOutline}
                      color="primary"
                      className="stat-card-icon"
                    />
                    <h2 className="stat-card-value">{productCount}</h2>
                    <p className="stat-card-label">Produits</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard>
                  <IonCardContent className="ion-text-center">
                    <IonIcon
                      icon={alertCircleOutline}
                      color="warning"
                      className="stat-card-icon"
                    />
                    <h2 className="stat-card-value">{lowStockCount}</h2>
                    <p className="stat-card-label">Stock faible</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard>
                  <IonCardContent className="ion-text-center">
                    <IonIcon
                      icon={documentTextOutline}
                      color="medium"
                      className="stat-card-icon"
                    />
                    <h2 className="stat-card-value">{draftCount}</h2>
                    <p className="stat-card-label">Brouillons</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size="6">
                <IonCard>
                  <IonCardContent className="ion-text-center">
                    <IonIcon
                      icon={checkmarkCircleOutline}
                      color="success"
                      className="stat-card-icon"
                    />
                    <h2 className="stat-card-value">{confirmedCount}</h2>
                    <p className="stat-card-label">Confirmées</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
}
