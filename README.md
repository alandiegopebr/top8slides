# Arcade Prisma — Beat Garden

Playground audiovisual para prender jovens por sessões longas: um palco que
mistura batidas, luz e storytelling em tempo real. Você cultiva pulsos, ativa
combos, cumpre missões e mantém o hype ativo como se fosse um idle game artístico.

## Como jogar

1. Abra `index.html` em um navegador moderno (use fones para sentir o synth).
2. Clique em **Ativar áudio** para liberar o motor Web Audio.
3. Toque em **Criar batida** ou clique direto no palco para plantar pulsos.
4. Arraste os pulsos para reposicionar e crie clusters na mesma etapa para combos.
5. Ajuste o slider **Ritmo do universo** (70–160 BPM) para controlar o groove.
6. Ative **Fluxo automático** e deixe o palco gerar ideias sozinho enquanto o hype sobe.
7. Use **Misturar etapas** quando quiser embaralhar todas as batidas em um clique.
8. **Limpar palco** reinicia tudo para outra maratona criativa.
9. No **Sound Lab**, ajuste **Polirritmia**, **Glitch**, **Swing prismático** e **Humanize** para controlar micro variações de tempo e timbre.
10. Suba hype (>95) + streak (>60) para acordar a **Tempestade Aurora** — o sistema dispara pulsos extras, acende melodias e contabiliza a conquista no HUD.
11. Use o **Scene Forge** para capturar snapshots (botão ou clique em um slot) e retomar ideias depois; há quatro bancos.
12. No **Chord Loom**, dispare pads harmônicos para preencher o mix e gerar novos passos nos sequencers.
13. Exporte o projeto em JSON quando quiser remixar ou compartilhar o arranjo.

## Por que prende

- **Feed de combos** registra tudo com timestamp, dando senso de progresso contínuo.
- **Hype/Streak bars** reagem instantaneamente à interação, incentivando sessões longas.
- **Missões diárias** (germinar X pulsos, combos, tempo em auto flow) adicionam metas claras.
- **Tempestades Aurora** surgem quando você mantém hype alto; são micro eventos que iluminam melodias, contam uma história no feed e liberam um boost visual/sonoro.
- **Scene Forge** guarda até quatro cenas completas (pulsos, kits, BPM, FX). Clique em "Carregar" para trocar de seção ao vivo.
- **Chord Loom** injeta progressões prontas que alternam escalas, aumentam hype e disparam notas no sequenciador.
- **Export JSON** transforma todo o estado (palco atual + cenas salvas) em um arquivo portátil para lives ou colaboração.
- **Loops sonoros**: cada pulso tem timbre, frequência e etapa diferentes; quando sincroniza, toca e pisca.
- **Auto flow** funciona como um modo idle — ótimo para deixar rolando e voltar a brincar.

## Novidades sonoras

- **Swing prismático**: adiciona atraso nos contratempos, deixando o groove com cara de MPC.
- **Humanize melódico**: injeta pequenas variações de afinação e tempo para quebrar a sensação de loop perfeito.
- **Aurora HUD**: novo card mostra se o evento está dormindo, em recarga ou no meio da tempestade.
- **Tempestade Aurora**: quando ativa, spawna pulsos extras, reacende passos dos sequencers, aumenta a barra de melodias e desbloqueia uma meta dedicada.
- **Scene Forge + Export**: snapshots completos para arranjar músicas inteiras + botão de exportação para guardar tudo.
- **Chord Loom**: pads harmônicos que alimentam o sequenciador com progressões curadas para cada kit.

## Hackeie o garden

- Ajuste `MAX_PULSES`, `kits` ou `waves` em `app.js` para mudar densidade sonora.
- Reescreva `questConfig` para criar desafios próprios (ex.: streak 80+, combos 5x).
- Brinque com `state.swing`, `state.humanize` e o cálculo de `getSwingDelay()` para criar sensações diferentes (drum'n'bass reto, boom bap, etc.).
- Troque cores, gradientes e efeitos em `style.css` para novos moods (cyberpunk, vapor, pastel).
- Altere as mensagens do feed (`pushFeed`) para narrativas personalizadas ou idioma diferente.
- Amplie `chordPresets`, `Scene Forge` ou o payload exportado para criar workflows específicos (modos aula, batalhas, etc.).

Leve o Arcade Prisma para labs, festivais, salas de aula ou lives e deixe a galera
competir por streaks gigantes enquanto novas batidas nascem sem parar.
