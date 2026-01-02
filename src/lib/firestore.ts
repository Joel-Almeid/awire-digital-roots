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
  limit,
  startAfter,
  getCountFromServer,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData
} from "firebase/firestore";
import { db } from "./firebase";
import axios from "axios";

// Tipos
export interface Artesanato {
  id?: string;
  nome: string;
  descricao: string;
  imageUrls: string[]; // Array de até 3 URLs de imagens
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
  bio?: string;
  ativo: boolean;
  urlTermoAssinado?: string;
  createdAt: Timestamp;
}

// Update artisan name across all products (cascade update)
export const updateArtesaoWithCascade = async (id: string, data: Partial<Artesao>) => {
  try {
    // Update the artisan document
    await updateDoc(doc(db, "artesaos", id), data);
    
    // If name was updated, update all products by this artisan
    if (data.nome) {
      const productsQuery = query(collection(db, "artesanatos"), where("artesaoId", "==", id));
      const productsSnapshot = await getDocs(productsQuery);
      
      const updatePromises = productsSnapshot.docs.map(productDoc => 
        updateDoc(doc(db, "artesanatos", productDoc.id), { artesaoNome: data.nome })
      );
      
      await Promise.all(updatePromises);
      await logActivity("Edição", `Artesão "${data.nome}" atualizado. ${productsSnapshot.docs.length} produto(s) sincronizado(s).`);
    } else {
      await logActivity("Edição", `Artesão "${data.nome || 'ID: ' + id}" foi atualizado.`);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar artesão com cascade:", error);
    return { success: false, error };
  }
};

export interface Foto {
  id?: string;
  imageUrl: string;
  legenda: string;
  createdAt: Timestamp;
}

export interface ActivityLog {
  id?: string;
  action: string;
  description: string;
  timestamp: Timestamp;
}

// ===== STORAGE (CLOUDINARY) =====

const CLOUDINARY_CLOUD_NAME = "dzrn84j0i";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadImageCloudinary = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const downloadURL = response.data.secure_url;
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error("Erro ao fazer upload da imagem no Cloudinary:", error);
    return { success: false, error };
  }
};

// Alias para manter compatibilidade
export const uploadImage = uploadImageCloudinary;

export const deleteImage = async (imageUrl: string) => {
  // Cloudinary delete requer API server-side - apenas log para não quebrar o fluxo
  console.log("Exclusão de imagem no Cloudinary pulada (requer backend):", imageUrl);
  return { success: true };
};

// ===== ACTIVITY LOG =====

export const logActivity = async (action: string, description: string) => {
  try {
    await addDoc(collection(db, "activityLog"), {
      action,
      description,
      timestamp: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao registrar atividade:", error);
    return { success: false, error };
  }
};

export const getRecentActivity = async (limitCount: number = 10): Promise<ActivityLog[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "activityLog"), orderBy("timestamp", "desc"), limit(limitCount))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ActivityLog[];
  } catch (error) {
    console.error("Erro ao buscar atividades recentes:", error);
    return [];
  }
};

export const getCollectionCount = async (collectionName: string): Promise<number> => {
  try {
    const coll = collection(db, collectionName);
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count;
  } catch (error) {
    console.error(`Erro ao contar documentos em ${collectionName}:`, error);
    return 0;
  }
};

// ===== ARTESANATO =====

export const addArtesanato = async (artesanato: Omit<Artesanato, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "artesanatos"), {
      ...artesanato,
      createdAt: Timestamp.now()
    });
    await logActivity("Adição", `Novo Artesanato: "${artesanato.nome}" foi adicionado.`);
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

// Interface para retorno paginado
export interface PaginatedResult<T> {
  items: T[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export const getArtesanatosPaginated = async (
  limitCount: number = 12,
  lastVisible?: QueryDocumentSnapshot<DocumentData> | null
): Promise<PaginatedResult<Artesanato>> => {
  try {
    let q = query(
      collection(db, "artesanatos"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    if (lastVisible) {
      q = query(
        collection(db, "artesanatos"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Artesanato[];

    const lastDoc = querySnapshot.docs.length > 0 
      ? querySnapshot.docs[querySnapshot.docs.length - 1] 
      : null;

    return {
      items,
      lastDoc,
      hasMore: querySnapshot.docs.length === limitCount
    };
  } catch (error) {
    console.error("Erro ao buscar artesanatos paginados:", error);
    return { items: [], lastDoc: null, hasMore: false };
  }
};

export const getArtesanatoById = async (id: string): Promise<Artesanato | null> => {
  try {
    const docRef = doc(db, "artesanatos", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Artesanato;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar artesanato por ID:", error);
    return null;
  }
};

export const getArtesanatosByArtesaoId = async (artesaoId: string): Promise<Artesanato[]> => {
  try {
    // Query simples sem orderBy para evitar necessidade de índice composto
    const querySnapshot = await getDocs(
      query(collection(db, "artesanatos"), where("artesaoId", "==", artesaoId))
    );
    const items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Artesanato[];
    
    // Ordenar manualmente por createdAt desc
    return items.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error("Erro ao buscar artesanatos por artesão:", error);
    return [];
  }
};

export const updateArtesanato = async (id: string, data: Partial<Artesanato>) => {
  try {
    await updateDoc(doc(db, "artesanatos", id), data);
    await logActivity("Edição", `Artesanato "${data.nome || 'ID: ' + id}" foi atualizado.`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar artesanato:", error);
    return { success: false, error };
  }
};

export const deleteArtesanato = async (id: string, nome?: string) => {
  try {
    await deleteDoc(doc(db, "artesanatos", id));
    await logActivity("Exclusão", `Artesanato "${nome || 'ID: ' + id}" foi excluído.`);
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
    await logActivity("Adição", `Novo Artesão: "${artesao.nome}" foi adicionado.`);
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

export const getArtesaoById = async (id: string): Promise<Artesao | null> => {
  try {
    const docRef = doc(db, "artesaos", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Artesao;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar artesão por ID:", error);
    return null;
  }
};

export const updateArtesao = async (id: string, data: Partial<Artesao>) => {
  try {
    await updateDoc(doc(db, "artesaos", id), data);
    await logActivity("Edição", `Artesão "${data.nome || 'ID: ' + id}" foi atualizado.`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar artesão:", error);
    return { success: false, error };
  }
};

export const deleteArtesao = async (id: string, nome?: string) => {
  try {
    await deleteDoc(doc(db, "artesaos", id));
    await logActivity("Exclusão", `Artesão "${nome || 'ID: ' + id}" foi excluído.`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir artesão:", error);
    return { success: false, error };
  }
};

// ===== FOTOS (GALERIA INSTITUCIONAL) =====

export const addFoto = async (foto: Omit<Foto, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, "fotos"), {
      ...foto,
      createdAt: Timestamp.now()
    });
    await logActivity("Adição", `Nova foto adicionada à galeria${foto.legenda ? `: "${foto.legenda}"` : "."}`);
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

export const getFotosPaginated = async (
  limitCount: number = 20,
  lastVisible?: QueryDocumentSnapshot<DocumentData> | null
): Promise<PaginatedResult<Foto>> => {
  try {
    let q = query(
      collection(db, "fotos"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    if (lastVisible) {
      q = query(
        collection(db, "fotos"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Foto[];

    const lastDoc = querySnapshot.docs.length > 0 
      ? querySnapshot.docs[querySnapshot.docs.length - 1] 
      : null;

    return {
      items,
      lastDoc,
      hasMore: querySnapshot.docs.length === limitCount
    };
  } catch (error) {
    console.error("Erro ao buscar fotos paginadas:", error);
    return { items: [], lastDoc: null, hasMore: false };
  }
};

export const deleteFoto = async (id: string, legenda?: string) => {
  try {
    await deleteDoc(doc(db, "fotos", id));
    await logActivity("Exclusão", `Foto excluída da galeria${legenda ? `: "${legenda}"` : "."}`);
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
  notaComoFunciona?: string;
  passo1?: string;
  passo2?: string;
  passo3?: string;
  passo4?: string;
  passo5?: string;
  passo6?: string;
  passo7?: string;
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
