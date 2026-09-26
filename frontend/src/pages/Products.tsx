import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Product } from "../models/Product";
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
  IonText,
  IonRefresher,
  IonRefresherContent,
  RefresherCustomEvent,
  IonSearchbar,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";

export default function Products() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  async function getProducts() {
    setError(null);
    try {
      const data = await api.get("/products/");
      setProducts(data.results);
    } catch (e) {
      console.error(e);
      setError("Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  function handleRefresh(event: RefresherCustomEvent) {
    getProducts().finally(() => event.detail.complete());
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Liste des produits</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/products/new">
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
        <IonSearchbar
          onIonInput={(e) => setSearch(e.detail.value ?? "")}
        ></IonSearchbar>
        <IonList>
          {filteredProducts.map((product: Product) => (
            <IonItem key={product.id}>
              <IonLabel>
                {product.reference} : {product.name} | {product.price} €
                {product.stock > 10 && (
                  <IonBadge color="success">{product.stock}</IonBadge>
                )}
                {product.stock <= 10 && product.stock > 0 && (
                  <IonBadge color="warning">{product.stock}</IonBadge>
                )}
                {product.stock == 0 && (
                  <IonBadge color="danger">{product.stock}</IonBadge>
                )}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
