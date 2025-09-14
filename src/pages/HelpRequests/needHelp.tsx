import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  useIonToast,
  IonSpinner
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { firestore, auth, storage } from '../../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const NeedHelp: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('media');
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPhoto(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      present({ message: 'Você precisa estar logado para criar um pedido.', duration: 3000, color: 'danger' });
      history.push('/login');
      return;
    }

    if (!title || !description || !category) {
      present({ message: 'Por favor, preencha todos os campos obrigatórios.', duration: 3000, color: 'warning' });
      return;
    }

    setIsSubmitting(true);

    try {
      let photoURL = '';
      if (photo) {
        const photoRef = ref(storage, `helpRequests/${user.uid}/${Date.now()}_${photo.name}`);
        const snapshot = await uploadBytes(photoRef, photo);
        photoURL = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(firestore, 'helpRequests'), {
        title,
        description,
        category,
        urgency,
        photoURL,
        requesterId: user.uid,
        requesterName: user.displayName || 'Anônimo',
        requesterPhotoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        status: 'aberto',
      });

      present({ message: 'Seu pedido de ajuda foi enviado com sucesso!', duration: 2000, color: 'success' });
      history.push('/feed');
    
    } catch (error) {
      console.error("Erro ao criar pedido: ", error);
      present({ message: 'Ocorreu um erro ao enviar seu pedido. Tente novamente.', duration: 3000, color: 'danger' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Pedir Ajuda</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonList>
            <IonItem><IonLabel position="floating">Título do Pedido</IonLabel><IonInput value={title} onIonChange={e => setTitle(e.detail.value!)} required /></IonItem>
            <IonItem><IonLabel position="floating">Descreva sua necessidade</IonLabel><IonTextarea value={description} onIonChange={e => setDescription(e.detail.value!)} rows={5} required /></IonItem>
            <IonItem><IonLabel>Categoria</IonLabel><IonSelect value={category} placeholder="Selecione uma" onIonChange={e => setCategory(e.detail.value)} required><IonSelectOption value="alimentacao">Alimentação</IonSelectOption><IonSelectOption value="moradia">Moradia</IonSelectOption><IonSelectOption value="saude">Saúde</IonSelectOption><IonSelectOption value="educacao">Educação</IonSelectOption><IonSelectOption value="transporte">Transporte</IonSelectOption><IonSelectOption value="outros">Outros</IonSelectOption></IonSelect></IonItem>
            <IonItem><IonLabel>Nível de Urgência</IonLabel><IonSelect value={urgency} onIonChange={e => setUrgency(e.detail.value)}><IonSelectOption value="baixa">Baixa</IonSelectOption><IonSelectOption value="media">Média</IonSelectOption><IonSelectOption value="alta">Alta</IonSelectOption></IonSelect></IonItem>
            <IonItem><IonLabel>Foto (Opcional)</IonLabel><input type="file" accept="image/*" onChange={handlePhotoChange} style={{ marginTop: '10px' }} /></IonItem>
          </IonList>
          <IonButton type="submit" expand="block" className="ion-margin-top" disabled={isSubmitting}>{isSubmitting ? <IonSpinner name="crescent" /> : 'Enviar Pedido'}</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default NeedHelp;