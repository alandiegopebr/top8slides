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

## Por que prende

- **Feed de combos** registra tudo com timestamp, dando senso de progresso contínuo.
- **Hype/Streak bars** reagem instantaneamente à interação, incentivando sessões longas.
- **Missões diárias** (germinar X pulsos, combos, tempo em auto flow) adicionam metas claras.
- **Loops sonoros**: cada pulso tem timbre, frequência e etapa diferentes; quando sincroniza, toca e pisca.
- **Auto flow** funciona como um modo idle — ótimo para deixar rolando e voltar a brincar.

## Hackeie o garden

- Ajuste `MAX_PULSES`, `notePool` ou `waves` em `app.js` para mudar densidade sonora.
- Reescreva `questConfig` para criar desafios próprios (ex.: streak 80+, combos 5x).
- Troque cores, gradientes e efeitos em `style.css` para novos moods (cyberpunk, vapor, pastel).
- Altere as mensagens do feed (`pushFeed`) para narrativas personalizadas ou idioma diferente.

Leve o Arcade Prisma para labs, festivais, salas de aula ou lives e deixe a galera
competir por streaks gigantes enquanto novas batidas nascem sem parar.
