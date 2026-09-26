import { useEffect, useState } from "react";
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
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton,
  IonIcon,
  IonToast,
} from "@ionic/react";
import { addOutline, trashOutline } from "ionicons/icons";
import { api } from "../services/api";
import { Partner } from "../models/Partner";
import { Product } from "../models/Product";

interface DraftLine {
  productId: number | null;
  quantity: number;
}

export default function NewOrder() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [partnerId, setPartnerId] = useState<number | null>(null);
  const [lines, setLines] = useState<DraftLine[]>([
    { productId: null, quantity: 1 },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/partners/").then((data) => setPartners(data.results));
    api.get("/products/").then((data) => setProducts(data.results));
  }, []);

  function addLine() {
    setLines([...lines, { productId: null, quantity: 1 }]);
  }

  function removeLine(index: number) {
    setLines(lines.filter((_, i) => i !== index));
  }

  function updateLine(index: number, patch: Partial<DraftLine>) {
    setLines(
      lines.map((line, i) => (i === index ? { ...line, ...patch } : line)),
    );
  }

  function priceOf(productId: number | null): number {
    const product = products.find((p) => p.id === productId);
    return product ? Number(product.price) : 0;
  }

  const total = lines.reduce(
    (sum, line) => sum + priceOf(line.productId) * line.quantity,
    0,
  );

  async function handleSubmit() {
    setError(null);

    if (!partnerId) {
      setError("Choisissez un client");
      return;
    }
    if (lines.some((l) => !l.productId || l.quantity <= 0)) {
      setError("Chaque ligne doit avoir un produit et une quantité valide");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        partner: partnerId,
        lines: lines.map((l) => ({
          product: l.productId,
          quantity: l.quantity,
          unit_price: priceOf(l.productId).toFixed(2),
        })),
      };
      const order = await api.post("/orders/", payload);
      navigate(`/orders/${order.id}`);
    } catch (e) {
      console.log(e);
      setError("Impossible de créer la commande");
    } finally {
      setSaving(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/orders" />
          </IonButtons>
          <IonTitle>Nouvelle commande</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonSelect
            label="Client"
            placeholder="Choisir un client"
            value={partnerId}
            onIonChange={(e) => setPartnerId(e.detail.value)}
          >
            {partners.map((p) => (
              <IonSelectOption key={p.id} value={p.id}>
                {p.name}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <h3 className="ion-margin-top">Lignes</h3>

        {lines.map((line, index) => (
          <IonItem key={index}>
            <IonSelect
              label="Produit"
              placeholder="Produit"
              value={line.productId}
              onIonChange={(e) =>
                updateLine(index, { productId: e.detail.value })
              }
            >
              {products.map((p) => (
                <IonSelectOption key={p.id} value={p.id}>
                  {p.name} ({p.price} €)
                </IonSelectOption>
              ))}
            </IonSelect>
            <IonInput
              type="number"
              min="1"
              value={line.quantity}
              onIonInput={(e) =>
                updateLine(index, { quantity: Number(e.detail.value) || 1 })
              }
              style={{ maxWidth: "80px" }}
            />
            <IonButton
              fill="clear"
              color="danger"
              onClick={() => removeLine(index)}
            >
              <IonIcon icon={trashOutline} slot="icon-only" />
            </IonButton>
          </IonItem>
        ))}

        <IonButton fill="outline" expand="block" onClick={addLine}>
          <IonIcon icon={addOutline} slot="start" />
          Ajouter une ligne
        </IonButton>

        <p className="ion-margin-top">
          <strong>Total : {total.toFixed(2)} €</strong>
        </p>

        <IonButton
          expand="block"
          color="primary"
          disabled={saving}
          onClick={handleSubmit}
        >
          Créer la commande
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
