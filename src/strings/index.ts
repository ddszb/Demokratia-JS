const MSG = {
  /*
   * COMMON MESSAGES
   */
  errorOcurred: 'Ocorreu um erro.',
  empty: '\u200b',
  timeout: 'Tempo esgotado.',
  confirm: 'confirmar',
  confirmedAlert: 'CONFIRMADO!',
  cancel: 'cancelar',
  yes: 'sim',
  no: 'não',
  votes: 'votos',
  /*
   * THEME MESSAGES
   */
  themeCategory: 'Temas',
  themeDescription: 'Comandos relacionados a temas',
  themeListDescription: 'Lista os temas ativos',
  themeAddDescription: 'Adiciona um tema. Adicione * no final para recorrente',
  themeRollDescription: 'Sorteia um tema',
  themeRollOptionsDescription: 'Número de usuários participantes.',
  themeDelDescription: 'Remove um tema',
  themeSetDescription:
    'Define o tema atual manualmente. Permite trocar um tema já sorteado.',
  themeNamePrompt: 'Nome do tema',
  themeReRollCounter: 're-roll ({0}/{1})',
  themeConfirmCounter: 'confirm ({0}/{1})',
  themeSelected: '🍿 **{0}**',
  themeSelectedCounter: '🍿 **{0}**({1})',
  themeSelectedEmbedTitle: 'Tema selecionado',
  themeSelectedEmbedFooter:
    'É necessário {0} votos para re-roll ou confirmar o tema.\nA votação dura 5min. Se nenhum tema for selecionado ao final do tempo,\no comando será cancelado.',
  themeNext: 'Próximo Tema',
  themeNextFormatter: '🍿\t{0}\t🍿',
  themeAdded: '<@{0}> Adicionou **{1}** à lista de temas {2}',
  themeNoThemesLeft: 'Não há temas restantes!',
  themesLeftTitle: 'Temas restantes:\n',
  themeNotFound: 'O tema **{0}** não está na lista',
  themeDeleted: 'Tema **{0}** removido da lista.',
  themeActiveError:
    'Já existe uma sessão de indicações aberta para o tema **{0}**. Caso queira trocar o tema atual, utilize **/tema set**.',
  themePickedTip: 'Utilize "/indicar" para indicar um filme para a próxima sessão!',
  themeSetUser: '<@{0}> alterou o tema atual para **{1}**',
  /*
   * POLL MESSAGES
   */
  pollCategory: 'Filmes',
  pollSuggestionDescription: 'Realiza a indicação de um filme.',
  pollUserSuggested: '<@{0}> indicou **{1}**',
  pollSuggestionSent: 'Indicação enviada: **{0}**',
  pollNoneOpened:
    'Não há nenhuma enquete aberta. Utilize /tema roll ou /tema set para rolar ou definir um tema novo e criar uma nova enquete.',
  pollNoneToCancel: 'Não há nenhuma enquete aberta.',
  pollStartedCantSuggest:
    'A votação já começou, não é possível alterar ou adicionar indicação.',
  pollOptionsDescription: 'Operações relacionadas a enquete',
  pollAlreadyOpenedEditPrompt:
    'Já existe uma enquete aberta (**{0}**), deseja trocar o tema? Se já houver indicações, elas serão movidas para o novo tema.',
  pollNoSuggestionsReceived: 'Ainda não houve nenhuma indicação para o tema **{0}**',
  pollNotEnoughOptions: 'Não há opções suficientes para voto',
  pollVoteEmbedTitle: '📢 Votação Próximo Filme',
  pollVoteEmbedDescription: `\n\n🍿 Tema: **{0}**. \n\n Utilize /votar para votar!`,
  pollVotingEmbedField: '#{0} 🎬 **{1}**',
  pollVotingEmbedFooter: 'Total: {0} votos.',
  pollCreated: 'Enquete criada!',
  pollSuggestions: 'Indicações:',
  pollCancelPrompt:
    'Deseja cancelar a enquete para o tema **{0}**? Essa ação é irreversível.',
  pollCancelledSuccess: 'Enquete para o tema **{0}** cancelada!',
  pollStatusTitle: 'Status:',
  pollReceivingSuggestions: '```yaml\n Recebendo indicações```',
  pollVotingStage: '```fix\nEm votação```',
  pollTieBreakStage: '```fix\nAguardando desempate```',
  pollIsTied: 'Enquete em empate! utilize /desempate para registrar o vencedor.',
  pollHasntStarted:
    'A enquete não foi iniciada. Utilize /enquete iniciar para iniciar a enquete para o tema atual.',
  pollPickPrompt: 'Escolha os filmes!',
  pollUserAlreadyVoted: 'Você já voltou nessa enquete! (**{0}**)',
  pollNoneToVote: 'Não há nenhuma enquete aguardando votação.',
  pollEmbedTitle: 'Votação próximo filme',
  pollTieBreakEmbedTitle: 'Desempate de filmes',
  pollTieBreakEmbedDescription: 'Escolha o filme que ganhou no critério de desempate',
  pollDrawDescription:
    '**Empate!** Decidam entre: **{0}** e utilize /desempate para registrar o vencedor',
  pollSuggestionsEmbedField: '🎬 **{0}**\n sugestão de <@{1}>',
  pollNextMovie: 'Próximo filme',
  pollNoDraws: 'Não há desempates pendentes.',
  pollTieBreakDescription: 'Seleciona o filme  que venceu o critério de desempate',
  pollTieBreakCategory: 'Indicações',
  pollEndedTitle: 'Votação encerrada',
  /*
   * SUGGESTION MESSAGES
   */
  suggestionCategory: 'Indicações de Filmes',
  suggestionDescription: 'Operações relacionadas a indicações',
  suggestionOptionsDescription: 'Opções relacionadas a indicações (remover, listar)',
  suggestionListTitle: '🍿 Indicações 🍿',
  suggestionListDescription: 'Tema: **{0}**',
  suggestionsNoneSuggested: 'Você ainda não indicou nenhum filme.',
  suggestionsUser: 'Suas indicações',
  suggestionOthers: 'Outras indicações',
  suggestionTotalFooter: 'Total: {0} indicações',
  suggestionAllRemoved: 'Você removeu todas as indicações!',
  suggestionRemoveTitle: 'Remover indicações',
  suggestionRemoveDescription: 'Remova indicações para o tema atual',
  suggestionAddDescription: 'Cria uma nova enquete a partir de um tema especificado',
  suggestionFeatDescription: 'Adicione uma mensagem de "feat." caso seu filme vença!',
  /**
   * MEMBER MESSAGES
   */
  memberRankingTitle: 'Clube do Cinema',
  memberFieldFormatter: '#{0} {1} <@{2}> **{3}** 🍿',
  /*
   * RANKING MESSAGES
   */
  rankingCategory: 'Filmes',
  rankingDescription: 'Exibe o ranking dos filmes votados',
  rankingEmbedTitle: '🏆 Ranking do Filme 🏆',
  rankingFieldFormatter: '#{0} **{1}** - {2} ⭐',
  /*
   * SESSION MESSAGES
   */
  sessionCategory: 'Filmes',
  sessionDescription: 'Cria uma sessão de filme manualmente',
  sessionMovieDescription: 'Nome do filme',
  sessionUserDescription: 'Quem indicou o filme',
  sessionThemeDescription: 'Tema do filme',
  sessionDateDescription: 'Dia do evento',
  sessionTimeDescription: 'Horário do filme (default: 21:30)',
  sessionEventName: 'Sessão de Filme: {0}',
  sessionEmbedTitle: '🍿 Sessão de Filme 🍿',
  sessionEmbedDescription: '\nFilme: **{0}**',
  sessionEmbedFeatDescription: '\n**feat.** {0}',
  sessionEmbedTheme: 'Tema: {0}',
  sessionEmbedUser: 'Sugestão: <@{0}>',
  sessionInviteURL: `**[MARCAR INTERESSE]({0})**`,
  sessionDateFormat: 'ddd [,] D [de] MMMM',
  /*
   * SCORE MESSAGES
   */
  scoreNoneToVote: 'Não há nenhum filme aguardando receber nota.',
  scoreEmbedTitle: 'Nota do filme',
  scoreMultipleDescription:
    'Existe mais de um filme aguardando nota.\n Qual filme você gostaria de avaliar?',
  scoreWrongValue: 'Por favor insira um valor entre 0 e 100.',
  scoreSent: 'Nota enviada! **{0}** : **{1}** ',
  scoreUserSentEmbed: '\n 👤<@{0}> avaliou.',
  scoreCategory: 'Filmes',
  scoreDescription: 'Operações de filmes',
  scoreEvaluationDescription: 'Permite iniciar ou fechar uma avaliação de filme',
  scoreOpDescription: 'Iniciar ou Fechar uma avaliação de filme',
  scoreValueDescription: 'Dê a nota para um filme',
  scoreValueOpDescription: 'Nota do filme (0 a 100)',
  /*
   * MOVIE MESSAGES
   */
  movieRatingTitle: '🍿 Avaliação do Filme 🍿',
  movieRatingPrompt: 'Use **/filme nota** para dar uma nota para o filme atual',
  movieRatingUser: 'Indicação: <@{0}>',
  movieRatingAlreadyStarted: 'Já existe um filme aguardando notas ({0})',
  movieRatingNoneToClose:
    'Não há nenhuma avaliação de filme aberta.\n Utilize **/filme avaliação iniciar** antes.',
  movieRatingNoVotesReceived: 'O filme **{0}** ainda não recebeu nota de nenhum usuário.',
  movieRatingEmbedWinner: '🎬 {0}',
  movieRatingEmbedSuggestion: '👤 <@{0}> (+{1} 🍿)',
  movieRatingUserScore: '👤<@{0}>: **({1}✨)**',
  movieRatingEmbedTheme: 'Tema: **{0}**',
  movieRatingEmbedFooter: 'Total: {0} votos.',
  movieRatingEmbedScore: 'Nota: **{0}** ⭐',
  /*
   * CLUB MESSAGES
   */
  clubCommandDescription: 'Comando para realizar ações por outros membros',
  clubSuggestionDescription: 'Envia a indicação de outro usuário',
  clubPollUserSuggested: '<@{0}> indicou **{1}** (via <@{2}>)',
  clubScoreDescription: 'Quem deu a nota do filme',
};

export default MSG;
