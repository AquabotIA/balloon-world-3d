# BALLOON WORLD 3D

MVP inicial de um jogo de balonismo 3D, mobile-first e otimizado para navegador Android.

## Tecnologias
- Vite
- Three.js
- JavaScript ES Modules
- Vercel (deploy estático)

## Executar localmente
```bash
npm install
npm run dev
```

## Gerar build de produção
```bash
npm run build
npm run preview
```

## Controles
- **Subir / +**: aumenta a sustentação e ganha altitude.
- **Descer / −**: reduz altitude.
- **Esquerda / Direita**: direciona o balão.
- No computador, também é possível usar as setas ou WASD.

## Deploy na Vercel
Importe este repositório na Vercel. O preset Vite será detectado automaticamente:
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

## Escopo do MVP 0.1
- Cena 3D com balão, cesta, queimador, nuvens e relevo.
- HUD com altitude e velocidade estimadas.
- Controles por toque e teclado.
- Interface vertical adaptável.

## Próximas evoluções
1. Física de vento e temperatura.
2. Objetivos, checkpoints e pontuação.
3. Modelos 3D e cenários regionais.
4. Áudio, efeitos e otimização de desempenho.
5. Persistência de progresso e backend online.
