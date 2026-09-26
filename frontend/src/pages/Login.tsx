import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonText,
} from "@ionic/react";
import { api, setToken } from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleLogin() {
    setError(null);
    try {
      const data = await api.post("/login/", { username, password });
      await setToken(data.token);
      navigate("/products");
    } catch (e) {
      console.error(e);
      setError("Identifiants incorrects");
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Connexion</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonInput
            label="Nom d'utilisateur"
            labelPlacement="stacked"
            value={username}
            onIonInput={(e) => setUsername(e.detail.value ?? "")}
          />
        </IonItem>
        <IonItem>
          <IonInput
            label="Mot de passe"
            labelPlacement="stacked"
            type="password"
            value={password}
            onIonInput={(e) => setPassword(e.detail.value ?? "")}
          />
        </IonItem>

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={handleLogin}
        >
          Se connecter
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
