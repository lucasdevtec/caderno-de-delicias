# Caderno de Delícias - Mobile (Expo / React Native)

Aplicativo mobile do **Caderno de Delícias** (`cadernodedelicias.com.br`), construído com **Expo** e **React Native**.

---

## 📱 Estratégia de Arquitetura

O aplicativo foi desenhado em duas etapas estratégicas:

1. **Fase 1 (Atual - WebApp View / Wrapper de Alto Desempenho)**:
   - Utiliza uma camada otimizada de `react-native-webview` que carrega diretamente `https://cadernodedelicias.com.br`.
   - Inclui proteção de Safe Area (entalhe/notch de iPhone e bordas de Android).
   - Suporte a Gestos de voltar/avançar no iOS e tratamento do botão físico Voltar no Android.
   - Tela de carregamento gastronômica integrada e fallback offline quando o dispositivo estiver sem conexão.
   - PWA / Instalável nativamente em Android (APK/AAB) e iOS (IPA).

2. **Fase 2 (Evolução Progressiva para Telas 100% Nativas)**:
   - Estrutura pronta para adicionar rotas nativas com Expo Router ou React Navigation.
   - Ideias para módulos nativos futuros:
     - **Modo Cozinha**: Tela com tela sempre ligada (*KeepAwake*), fontes gigantes e timers automáticos sincronizados com cada passo da receita.
     - **Scanner de Receitas com Câmera**: Captura de fotos de anotações antigas com OCR para importar para o caderno.
     - **Notificações Push**: Lembretes de receitas sazonais ou avisos de novos cadernos de amigos.

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- Node.js instalado
- Aplicativo **Expo Go** instalado no seu celular (Google Play Store ou Apple App Store)

### 2. Iniciar o Servidor Expo
Na raiz do monorepo:
```bash
npm run dev:mobile
```
Ou dentro da pasta `apps/mobile`:
```bash
npm start
```

### 3. Testando com o Back-end / Web Local
Por padrão, o app aponta para `https://cadernodedelicias.com.br`. Para testar com seu Next.js rodando localmente na sua máquina (`http://localhost:3000`):

Crie um arquivo `.env` dentro de `apps/mobile/`:
```env
# Use o IP local da sua máquina na rede Wi-Fi (ex: 192.168.1.50:3000)
EXPO_PUBLIC_WEB_URL=http://192.168.1.50:3000
```

---

## 📦 Gerando Builds Nativos com EAS

Para gerar os binários de produção para as lojas:

```bash
# Instalar a CLI do EAS
npm install -g eas-cli

# Login na conta Expo
eas login

# Configurar o projeto
eas build:configure

# Gerar APK de teste para Android
eas build -p android --profile preview
```
