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
- **Subir / +**: aquece o balão, consome combustível e aumenta a altitude.
- **Descer / −**: reduz altitude.
- **Esquerda / Direita**: direciona o balão.
- No computador, também é possível usar as setas ou WASD.

## Recursos do MVP 0.2
- Cena 3D com balão, cesta, queimador, nuvens e relevo.
- Interface mobile-first em orientação vertical.
- Controles por toque e teclado.
- HUD com altitude, velocidade, vento e combustível.
- Vento variável que influencia a deriva horizontal.
- Marcadores aéreos para atravessar e acumular pontos.
- Indicador de combustível consumido pelo queimador.

## Deploy na Vercel
Importe este repositório na Vercel. O preset Vite será detectado automaticamente:
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

## Validação
O workflow em `.github/workflows/build.yml` executa instalação e build em pushes e pull requests. A execução real do build e os testes em dispositivo Android ainda precisam ser confirmados.

## Próximas evoluções
1. Física de vento por altitude e condições meteorológicas.
2. Cenários brasileiros e missões estruturadas.
3. Áudio, modelos 3D e otimização de desempenho.
4. Persistência de progresso e backend online.
