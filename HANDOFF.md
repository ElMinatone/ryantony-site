# RYANTONY — Handoff de desenvolvimento

**Status:** concluído — validações finais ok  
**Data:** 20/10/2026  
**Dev server:** `http://localhost:4200`  
**Build:** `npm run build`  
**Saída:** `dist/ryantony-site`

---

## Rodada finalizada

Implementação de scroll suave e animações de entrada com estética cinematográfica, além dos ajustes do manifesto.

### Smooth scroll

- `lenis@1.3.27` instalado.
- `SmoothScrollService` criado em `src/app/core/smooth-scroll.service.ts`.
- Inicializado no `App` (`ngAfterViewInit`).
- Intercepta links `href="#..."`, atualiza o hash e faz scroll com inércia.
- Respeita `prefers-reduced-motion` (sem Lenis nesse caso).
- Para/retoma automaticamente quando o modal ou o menu mobile bloqueiam o scroll.
- Botão "Voltar ao topo" do footer usa o serviço.
- CSS do Lenis integrado em `src/styles.scss`.

### Animações de entrada

- `RevealDirective` com variantes:
  - `up` (padrão)
  - `left`
  - `right`
  - `scale`
  - `fade`
- Efeito base: `opacity + translate3d + blur`.
- `IntersectionObserver` com `threshold: 0.01` e sem margem negativa.
- Títulos de seção, CTA e manifesto com animação `title-rise` (`clip-path`).
- Reveals individuais/escalonados em:
  - serviços;
  - etapas e notas do processo;
  - FAQ;
  - lista de projetos;
  - princípios de tecnologias;
  - itens 01–04 do manifesto;
  - colunas, wordmark e rodapé do footer.

### Ajustes do manifesto

- Removido o quadradinho preto de "constrói ideias".
- Removido o bloco `manifesto__ticker` e o array `words`.
- Removidos os estilos do ticker e do pixel.
- Respiro à esquerda nos itens 01–04:
  - desktop: `padding-left: clamp(14px, 1.6vw, 24px)`
  - mobile: `padding: 18px 16px`
- Padding inferior da faixa verde ajustado após a remoção do ticker.

---

## Correções importantes aplicadas

### Offset das âncoras

O Lenis já aplica o `scroll-padding-top` do documento. O serviço passava `offset: -88` adicionalmente, resultando em ~180px de espaço.

Correção:

```ts
if (this.lenis) {
  this.lenis.start();
  // O Lenis já aplica o scroll-padding-top do documento.
  this.lenis.scrollTo(target, { offset: 0, duration: 1.2 });
  return;
}
```

Fallback sem Lenis continua usando o offset manual de `-92px`.

**Resultado:** seção para com o topo a **92px** da viewport.

### Reveals no fim da página

O `rootMargin` negativo impedia que os últimos itens do footer fossem observados. Removido:

```ts
{ threshold: 0.01 }
```

**Resultado:** 85/85 elementos com `appReveal` ficaram visíveis após percorrer a página.

### Variante `mask`

A variante `mask` usava `clip-path` no próprio elemento observado, o que impedia o `IntersectionObserver` de detectar interseção. Ela foi removida da diretiva e do CSS. O footer agora usa `scale`.

---

## Validações realizadas

### Build

```text
main: 294.38 kB raw / 71.66 kB transfer
polyfills: 34.59 kB / 11.33 kB
styles: 8.14 kB / 2.32 kB
total inicial: 337.11 kB raw / 85.32 kB transfer
```

Sem erros de build.

### Desktop

- Clique em `#servicos`:
  - `scrollY`: 1917
  - topo da seção: 92px
  - hash atualizado: `#servicos`
- Modal:
  - ao abrir: `body.has-modal` + `html.lenis-stopped`
  - ao fechar: classes removidas e scroll liberado
- Nenhuma exceção no console.
- 85 reveals encontrados; após percorrer a página, **0 ocultos**.
- Manifesto verificado visualmente:
  - sem quadradinho;
  - sem ticker;
  - itens 01–04 com respiro;
  - fechamento da faixa verde correto.

### Mobile (390px)

- `scrollWidth: 390` / `clientWidth: 390` — sem overflow horizontal.
- Manifesto e itens 01–04 verificados visualmente.
- Card do símbolo continua centralizado.
- Footer wordmark dentro da largura.

### Screenshots de referência

- `C:\Users\Juan\AppData\Local\Temp\opencode\v7-full.png`
- `C:\Users\Juan\AppData\Local\Temp\opencode\v7-manifesto.png`
- `C:\Users\Juan\AppData\Local\Temp\opencode\v7-m-manifesto.png`

---

## Arquivos alterados nesta rodada final

- `src/app/core/smooth-scroll.service.ts`
- `src/app/shared/reveal.directive.ts`
- `src/app/components/footer/footer.html`
- `src/styles.scss`

`HANDOFF.md` é um arquivo novo, ainda não rastreado.

O restante da implementação já estava commitado no repositório.

---

## Comandos úteis

```bash
npm run build
npm run start
```

### Screenshot headless

Usar `--force-prefers-reduced-motion` para evitar capturar reveals no meio da transição:

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --headless=new `
  --disable-gpu `
  --no-sandbox `
  --hide-scrollbars `
  --force-prefers-reduced-motion `
  --virtual-time-budget=7000 `
  --window-size=1440,13000 `
  "--screenshot=C:\Users\Juan\AppData\Local\Temp\opencode\full.png" `
  http://localhost:4200
```

Para testar o Lenis, **não** usar `--force-prefers-reduced-motion`.
