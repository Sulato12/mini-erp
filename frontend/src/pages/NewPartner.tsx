import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonToast,
} from "@ionic/react";
import { api } from "../services/api";

export default function NewPartner() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    try {
      await api.post("/partners/", { name, email, phone, address });
      navigate("/partners");
    } catch (e) {
      console.log(e);
      setError("Impossible de créer ce client");
    } finally {
      setSaving(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/partners" />
          </IonButtons>
          <IonTitle>Nouveau client</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonInput
            label="Nom"
            labelPlacement="stacked"
            value={name}
            onIonInput={(e) => setName(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonInput
            label="Email"
            labelPlacement="stacked"
            type="email"
            value={email}
            onIonInput={(e) => setEmail(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonInput
            label="Téléphone"
            labelPlacement="stacked"
            value={phone}
            onIonInput={(e) => setPhone(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonInput
            label="Adresse"
            labelPlacement="stacked"
            value={address}
            onIonInput={(e) => setAddress(e.detail.value ?? "")}
          />
        </IonItem>

        <IonButton
          expand="block"
          className="ion-margin-top"
          disabled={saving}
          onClick={handleSubmit}
        >
          Créer
        </IonButton>

        <IonToast
          isOpen={!!error}
          message={error ?? ""}
          duration={3000}
          onDidDismiss={() => setError(null)}
        />
      </IonContent>
    </IonPage>
  );
}
