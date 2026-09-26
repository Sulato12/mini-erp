import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Order } from "../models/Order";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  RefresherCustomEvent,
  IonSegment,
  IonSegmentButton,
  IonButtons,
  IonButton,
  IonIcon,
  IonText,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";

export default function Orders() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterState, setFilterState] = useState("all");

  const filteredOrders =
    filterState == "all"
      ? orders
      : orders.filter((o) => o.status == filterState);

  async function getOrders() {
    setError(null);
    try {
      const data = await api.get("/orders/");
      setOrders(data.results);
    } catch (e) {
      console.error(e);
      setError("Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrders();
  }, []);

  function handleRefresh(event: RefresherCustomEvent) {
    getOrders().finally(() => event.detail.complete());
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Liste des commandes</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/orders/new">
              <IonIcon icon={addOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        {loading && <p>Chargement...</p>}
        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}
        <IonSegment
          value={filterState}
          onIonChange={(e) => setFilterState(e.detail.value as string)}
        >
          <IonSegmentButton value="all">
            <IonLabel>Toutes</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="draft">
            <IonLabel>Brouillon</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="confirmed">
            <IonLabel>Confirmée</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="canceled">
            <IonLabel>Annulée</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="delivered">
            <IonLabel>Livrée</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <IonList>
          {filteredOrders.map((order: Order) => (
            <IonItem key={order.id} routerLink={`/orders/${order.id}`} button>
              <IonLabel>
                {order.id} : {order.partner}
                {order.status == "draft" && (
                  <IonBadge color="warning">{order.status}</IonBadge>
                )}
                {order.status == "confirmed" && (
                  <IonBadge color="primary">{order.status}</IonBadge>
                )}
                {order.status == "delivered" && (
                  <IonBadge color="success">{order.status}</IonBadge>
                )}
                {order.status == "canceled" && (
                  <IonBadge color="danger">{order.status}</IonBadge>
                )}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
