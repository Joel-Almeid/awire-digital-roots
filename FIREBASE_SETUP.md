# 🔥 Guia de Configuração do Firebase

## 📋 Pré-requisitos

Você precisa ter um projeto criado no Firebase Console e as credenciais configuradas.

## 🚀 Passo a Passo

### 1️⃣ Configurar Variáveis de Ambiente

1. **Copie o arquivo de exemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Obtenha suas credenciais do Firebase:**
   - Acesse o [Console do Firebase](https://console.firebase.google.com)
   - Selecione seu projeto
   - Vá em **Configurações do Projeto** (ícone de engrenagem)
   - Role até a seção **Seus aplicativos**
   - Copie a configuração do SDK

3. **Cole as credenciais no arquivo `.env`:**
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=seu-projeto-id
   VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

### 2️⃣ Configurar Authentication no Firebase

1. No Console do Firebase, vá em **Authentication**
2. Clique em **Começar**
3. Ative o método **E-mail/Senha**
4. Adicione seu primeiro usuário admin manualmente:
   - Vá em **Users** > **Add User**
   - Email: `awiredigital@gmail.com` (ou o email que você quiser)
   - Senha: `AdminAwire2025@` (ou a senha que você quiser)

### 3️⃣ Configurar Firestore Database

1. No Console do Firebase, vá em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha **Iniciar no modo de produção** (vamos configurar as regras depois)
4. Selecione a localização (escolha a mais próxima dos seus usuários)

### 4️⃣ Configurar Regras de Segurança do Firestore

No Firestore Database, vá em **Regras** e adicione:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Regras para artesanatos (público pode ler, apenas admin pode escrever)
    match /artesanatos/{artesanatoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Regras para artesãos (público pode ler, apenas admin pode escrever)
    match /artesaos/{artesaoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Regras para fotos (público pode ler, apenas admin pode escrever)
    match /fotos/{fotoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5️⃣ Configurar Storage (Para Upload de Imagens - Futuro)

1. No Console do Firebase, vá em **Storage**
2. Clique em **Começar**
3. Aceite as regras padrão por enquanto

### 6️⃣ Testar a Aplicação

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Teste o login:**
   - Acesse `/login`
   - Use as credenciais que você criou no passo 2

4. **Teste o cadastro de artesanato:**
   - Após fazer login, acesse `/admin/artesanato`
   - Adicione um novo artesanato
   - Verifique se ele aparece na página pública `/artesanato`

## ✅ Estrutura das Coleções no Firestore

### `artesanatos`
```javascript
{
  nome: string,
  descricao: string,
  imageUrl: string,
  artesaoId: string,
  artesaoNome: string,
  categoria: string,
  aldeia: string,
  createdAt: timestamp
}
```

### `artesaos`
```javascript
{
  nome: string,
  fotoUrl: string,
  whatsapp: string,
  aldeia: string,
  createdAt: timestamp
}
```

### `fotos`
```javascript
{
  imageUrl: string,
  legenda: string,
  createdAt: timestamp
}
```

## 🔒 Segurança

⚠️ **IMPORTANTE**: 
- O arquivo `.env` contém informações sensíveis
- **NUNCA** faça commit do arquivo `.env` no Git
- O arquivo `.env` já está no `.gitignore`

## 📚 Próximos Passos

- [ ] Implementar upload real de imagens para o Storage
- [ ] Adicionar funcionalidade de edição de artesanatos
- [ ] Implementar CRUD completo de artesãos
- [ ] Adicionar paginação nas listagens
- [ ] Implementar busca em tempo real

## 🆘 Problemas Comuns

### Erro: "requested path is invalid" no login
- Verifique as configurações de URL no Firebase Authentication
- Em **Authentication** > **Settings** > **Authorized domains**
- Adicione `localhost` e o domínio do seu site

### Erro: "Missing or insufficient permissions"
- Verifique as regras de segurança do Firestore
- Certifique-se de que o usuário está autenticado

### Imagens não aparecem
- Por enquanto, estamos usando placeholders
- O upload real de imagens será implementado em breve

## 📞 Suporte

Se tiver dúvidas, consulte a [documentação oficial do Firebase](https://firebase.google.com/docs).
