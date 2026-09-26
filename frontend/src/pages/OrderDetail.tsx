import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonToast,
  IonSpinner,
} from "@ionic/react";
import { api } from "../services/api";
import { Order } from "../models/Order";

const statusColor: Record<Order["status"], string> = {
  draft: "warning",
  confirmed: "primary",
  delivered: "success",
  canceled: "danger",
};

const statusLabel: Record<Order["status"], string> = {
  draft: "Brouillon",
  confirmed: "Confirmée",
  delivered: "Livrée",
  canceled: "Annulée",
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  async function getOrder() {
    setLoading(true);
    try {
      const data = await api.get(`/orders/${id}/`);
      setOrder(data);
    } catch (e) {
      console.error(e);
      setToastMessage("Impossible de charger la commande");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrder();
  }, [id]);

  async function handleConfirm() {
    setActionLoading(true);
    try {
      const data = await api.post(`/orders/${id}/confirm/`);
      setOrder(data);
      setToastMessage("Commande confirmée");
    } catch (e) {
      setToastMessage((e as Error).message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    setActionLoading(true);
    try {
      const data = await api.post(`/orders/${id}/cancel/`);
      setOrder(data);
      setToastMessage("Commande annulée");
    } catch (e) {
      setToastMessage((e as Error).message);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/orders" />
          </IonButtons>
          <IonTitle>Commande #{id}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading && <IonSpinner />}

        {!loading && order && (
          <>
            <IonBadge color={statusColor[order.status]}>
              {statusLabel[order.status]}
            </IonBadge>
            <p>Client #{order.partner}</p>
            <p>Date : {new Date(order.date).toLocaleString("fr-FR")}</p>
            <p>Total : {order.total} €</p>

            <IonList>
              {order.lines.map((line) => (
                <IonItem key={line.id}>
                  <IonLabel>
                    Produit #{line.product} — {line.quantity} ×{" "}
                    {line.unit_price} €
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>

            {order.status === "draft" && (
              <IonButton
                expand="block"
                color="primary"
                disabled={actionLoading}
                onClick={handleConfirm}
              >
                Confirmer
              </IonButton>
            )}

            {order.status === "confirmed" && (
              <IonButton
                expand="block"
                color="danger"
                disabled={actionLoading}
                onClick={handleCancel}
              >
                Annuler
              </IonButton>
            )}
          </>
        )}

        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage ?? ""}
          duration={3000}
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>
    </IonPage>
  );
}
