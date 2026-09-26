import { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  RefresherCustomEvent,
  IonSpinner,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { api } from "../services/api";
import { Partner } from "../models/Partner";

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  async function getPartners() {
    try {
      const data = await api.get("/partners/");
      setPartners(data.results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPartners();
  }, []);

  function handleRefresh(event: RefresherCustomEvent) {
    getPartners().finally(() => event.detail.complete());
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Clients</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/partners/new">
              <IonIcon icon={addOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {loading && <IonSpinner />}

        <IonList>
          {partners.map((partner) => (
            <IonItem key={partner.id}>
              <IonLabel>
                <h2>{partner.name}</h2>
                <p>
                  {partner.email} — {partner.phone}
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
