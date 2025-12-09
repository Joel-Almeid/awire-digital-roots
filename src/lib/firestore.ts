import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  setDoc,
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

// ===== CONFIGURAÇÕES =====

export interface Configuracoes {
  textoComoFunciona: string;
  textoSobreProjeto: string;
}

export const getConfiguracoes = async (): Promise<Configuracoes | null> => {
  try {
    const docRef = doc(db, "configuracoes", "geral");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Configuracoes;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return null;
  }
};

export const saveConfiguracoes = async (config: Configuracoes) => {
  try {
    await setDoc(doc(db, "configuracoes", "geral"), config);
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    return { success: false, error };
  }
};

// ===== CATEGORIAS =====

export interface Categoria {
  id?: string;
  nome: string;
  createdAt: Timestamp;
}

export const getCategorias = async (): Promise<Categoria[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "categorias"), orderBy("createdAt", "asc"))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Categoria[];
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return [];
  }
};

export const addCategoria = async (nome: string) => {
  try {
    const docRef = await addDoc(collection(db, "categorias"), {
      nome,
      createdAt: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Erro ao adicionar categoria:", error);
    return { success: false, error };
  }
};

export const updateCategoria = async (id: string, nome: string) => {
  try {
    await updateDoc(doc(db, "categorias", id), { nome });
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return { success: false, error };
  }
};

export const deleteCategoria = async (id: string) => {
  try {
    await deleteDoc(doc(db, "categorias", id));
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
    return { success: false, error };
  }
};

// ===== ALDEIAS =====

export interface Aldeia {
  id?: string;
  nome: string;
  createdAt: Timestamp;
}

export const getAldeias = async (): Promise<Aldeia[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "aldeias"), orderBy("createdAt", "asc"))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Aldeia[];
  } catch (error) {
    console.error("Erro ao buscar aldeias:", error);
    return [];
  }
};

export const addAldeia = async (nome: string) => {
  try {
    const docRef = await addDoc(collection(db, "aldeias"), {
      nome,
      createdAt: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Erro ao adicionar aldeia:", error);
    return { success: false, error };
  }
};

export const updateAldeia = async (id: string, nome: string) => {
  try {
    await updateDoc(doc(db, "aldeias", id), { nome });
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar aldeia:", error);
    return { success: false, error };
  }
};

export const deleteAldeia = async (id: string) => {
  try {
    await deleteDoc(doc(db, "aldeias", id));
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir aldeia:", error);
    return { success: false, error };
  }
};
