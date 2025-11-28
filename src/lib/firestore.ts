import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";

// Tipos
export interface Artesanato {
  id?: string;
  nome: string;
  descricao: string;
  imageUrl: string;
  artesaoId: string;
  artesaoNome: string;
  categoria: string;
  aldeia: string;
  createdAt: Timestamp;
}

export interface Artesao {
  id?: string;
  nome: string;
  fotoUrl: string;
  whatsapp: string;
  aldeia: string;
  createdAt: Timestamp;
}

export interface Foto {
  id?: string;
  imageUrl: string;
  legenda: string;
  createdAt: Timestamp;
}

// ===== STORAGE =====

export const uploadImage = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    return { success: false, error };
  }
};

export const deleteImage = async (imageUrl: string) => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir imagem:", error);
    return { success: false, error };
  }
};

// ===== ARTESANATO =====

export const addArtesanato = async (artesanato: Omit<Artesanato, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "artesanatos"), {
      ...artesanato,
      createdAt: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Erro ao adicionar artesanato:", error);
    return { success: false, error };
  }
};

export const getArtesanatos = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "artesanatos"), orderBy("createdAt", "desc"))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Artesanato[];
  } catch (error) {
    console.error("Erro ao buscar artesanatos:", error);
    return [];
  }
};

export const updateArtesanato = async (id: string, data: Partial<Artesanato>) => {
  try {
    await updateDoc(doc(db, "artesanatos", id), data);
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar artesanato:", error);
    return { success: false, error };
  }
};

export const deleteArtesanato = async (id: string) => {
  try {
    await deleteDoc(doc(db, "artesanatos", id));
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir artesanato:", error);
    return { success: false, error };
  }
};

// ===== ARTESÃOS =====

export const addArtesao = async (artesao: Omit<Artesao, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "artesaos"), {
      ...artesao,
      createdAt: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Erro ao adicionar artesão:", error);
    return { success: false, error };
  }
};

export const getArtesaos = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "artesaos"), orderBy("createdAt", "desc"))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Artesao[];
  } catch (error) {
    console.error("Erro ao buscar artesãos:", error);
    return [];
  }
};

// ===== FOTOS =====

export const addFoto = async (foto: Omit<Foto, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "fotos"), {
      ...foto,
      createdAt: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Erro ao adicionar foto:", error);
    return { success: false, error };
  }
};

export const getFotos = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "fotos"), orderBy("createdAt", "desc"))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Foto[];
  } catch (error) {
    console.error("Erro ao buscar fotos:", error);
    return [];
  }
};

export const deleteFoto = async (id: string) => {
  try {
    await deleteDoc(doc(db, "fotos", id));
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir foto:", error);
    return { success: false, error };
  }
};
