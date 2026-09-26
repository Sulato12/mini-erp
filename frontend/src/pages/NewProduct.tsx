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
  IonToggle,
  IonLabel,
  IonButton,
  IonToast,
} from "@ionic/react";
import { api } from "../services/api";

export default function NewProduct() {
  const navigate = useNavigate();
  const [reference, setReference] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [tva, setTva] = useState("20.00");
  const [active, setActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    try {
      await api.post("/products/", { reference, name, price, tva, active });
      navigate("/products");
    } catch (e) {
      console.log(e);
      setError("Impossible de créer ce produit (référence déjà utilisée ?)");
    } finally {
      setSaving(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/products" />
          </IonButtons>
          <IonTitle>Nouveau produit</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonInput
            label="Référence"
            labelPlacement="stacked"
            value={reference}
            onIonInput={(e) => setReference(e.detail.value ?? "")}
          />
        </IonItem>
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
            label="Prix (€)"
            labelPlacement="stacked"
            type="number"
            value={price}
            onIonInput={(e) => setPrice(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonInput
            label="TVA (%)"
            labelPlacement="stacked"
            type="number"
            value={tva}
            onIonInput={(e) => setTva(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonLabel>Actif</IonLabel>
          <IonToggle
            checked={active}
            onIonChange={(e) => setActive(e.detail.checked)}
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
