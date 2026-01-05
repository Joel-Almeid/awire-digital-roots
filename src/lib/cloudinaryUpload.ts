import axios from "axios";

const CLOUDINARY_CLOUD_NAME = "dzrn84j0i";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

export interface UploadOptions {
  folder?: string;
  tags?: string[];
  maxSize?: number; // in MB
}

export const uploadDocumentCloudinary = async (file: File, options: UploadOptions = {}) => {
  const { folder = "awire", tags = [], maxSize = 10 } = options;

  // Validate file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSize) {
    return { 
      success: false, 
      error: `Arquivo muito grande. Tamanho máximo: ${maxSize}MB. Tamanho atual: ${fileSizeMB.toFixed(2)}MB` 
    };
  }

  // Validate file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    return { 
      success: false, 
      error: 'Tipo de arquivo não permitido. Use PDF, JPG ou PNG.' 
    };
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");
    formData.append("folder", folder);
    if (tags.length > 0) {
      formData.append("tags", tags.join(","));
    }

    const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    });

    const downloadURL = response.data.secure_url;
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error("Erro ao fazer upload do documento no Cloudinary:", error);
    return { success: false, error: "Erro ao fazer upload do arquivo." };
  }
};

// Upload de mídia (imagens E vídeos) com resource_type: auto
export const uploadMediaCloudinary = async (file: File, options: UploadOptions = {}) => {
  const { folder = "awire/galeria", tags = [], maxSize = 100 } = options; // 100MB para vídeos

  // Validate file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSize) {
    return { 
      success: false, 
      error: `Arquivo muito grande. Tamanho máximo: ${maxSize}MB. Tamanho atual: ${fileSizeMB.toFixed(2)}MB` 
    };
  }

  // Validate file type (imagens e vídeos)
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/mov', 'video/quicktime', 'video/webm', 'video/avi'];
  const allAllowedTypes = [...allowedImageTypes, ...allowedVideoTypes];
  
  if (!allAllowedTypes.includes(file.type)) {
    return { 
      success: false, 
      error: 'Tipo de arquivo não permitido. Use JPG, PNG, GIF, WEBP, MP4, MOV ou WEBM.' 
    };
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");
    formData.append("folder", folder);
    if (tags.length > 0) {
      formData.append("tags", tags.join(","));
    }

    // A URL já usa /auto/upload que detecta o tipo automaticamente
    const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    });

    const downloadURL = response.data.secure_url;
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error("Erro ao fazer upload de mídia no Cloudinary:", error);
    return { success: false, error: "Erro ao fazer upload do arquivo." };
  }
};
