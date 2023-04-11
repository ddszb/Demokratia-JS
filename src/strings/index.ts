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
  pollStartDescription: 'Inicia uma nova enquete',
  pollCloseDescription: 'Encerra uma enquete aberta',
  pollStatusDescription: 'Verifica o status de enquete',
  pollCancelDescription: 'Cancela uma enquete',
  pollMovieNotFound: 'Filme não encontrado',
  pollUserOpenedPoll:
    'Você abriu a enquete para o tema **{0}**. Aguarde todos votarem antes de fechar com _/enquete fechar_',
  pollAlreadyOpenedEditPrompt:
    'Já existe uma enquete aberta (**{0}**), deseja trocar o tema? Se já houver indicações, elas serão movidas para o novo tema.',
  pollNoSuggestionsReceived: 'Ainda não houve nenhuma indicação para o tema **{0}**',
  pollNotEnoughOptions: 'Não há opções suficientes para voto',
  pollVoteEmbedTitle: '📢 Votação Próximo Filme',
  pollVoteEmbedDescription: `\n\n🍿 Tema: **{0}**. \n\n Utilize **/votar** para votar!`,
  pollVotingEmbedField: '#{0} 🎬 **{1}**',
  pollVotingEmbedFooter: 'Total: {0} votos.',
  pollSuggestions: 'Indicações:',
  pollCancelPrompt:
    'Deseja cancelar a enquete para o tema **{0}**? Essa ação é irreversível.',
  pollCancelledSuccess: 'Enquete para o tema **{0}** cancelada!',
  pollStatusTitle: 'Status:',
  pollReceivingSuggestions: '```yaml\n Recebendo indicações```',
  pollVotingStage: '```fix\nEm votação```',
  pollTieBreakStage: '```fix\nAguardando desempate```',
  pollStarted: 'Você iniciou uma enquete, e apenas você poderá encerrá-la.',
  pollButtonDisabled: 'Finalizar (🔒 {0}s)',
  pollButtonEnabled: 'Finalizar',
  pollIsTied:
    '**Empate**! Utilize /desempate para iniciar a votação de desempate. \n ⚠️ _Apenas uma pessoa precisa utilizar o comando_',
  pollTiedFinishPrompt: '**Empate**! Após todos votarem, encerre o desempate.\n {0}',
  pollSecondTieMessage:
    '\n🍿 Votação encerrada!\n\n Houve um segundo empate!\n Decidam por outro critério e use **/desempate** para escolher o vencedor dentre os filmes empatados (_não haverá uma outra votação_) \n\n **{0}** \n⚠️ _Apenas uma pessoa precisa utilizar o comando_',
  pollTiedVotingPrompt: 'Vote em um filme para desempatar.',
  pollManualSelectionPrompt:
    'Selecione o filme que ganhou no segundo critério de desempate.',
  pollManualSelectionUser: '{0}, você definiu {1} como filme vencedor! 🍿',
  pollManualSelectionWinner: 'Próximo filme: **{0}** 🍿 ',
  pollTiebreakConfirmButton: 'Finalizar',
  pollHasntStarted:
    'A enquete não foi iniciada. Utilize /enquete iniciar para iniciar a enquete para o tema atual.',
  pollPickPrompt: 'Escolha os filmes!',
  pollUserAlreadyVoted: 'Você já voltou nessa enquete! (**{0}**)',
  pollNoneToVote: 'Não há nenhuma enquete aguardando votação.',
  pollEmbedTitle: 'Votação próximo filme',
  pollTieBreakEmbedTitle: 'Desempate de filmes',
  pollTieBreakEmbedDescription: 'Escolha o filme que ganhou no critério de desempate',
  pollSuggestionsEmbedField: '🎬 **{0}**',
  pollNextMovie: 'Próximo filme',
  pollNoDraws: 'Não há desempates pendentes.',
  pollTieBreakDescription: 'Inicia o desempate entre filmes na enquete',
  pollTieBreakCategory: 'Indicações',
  pollEndedTitle: 'Votação encerrada',
  pollManualConfirmPrompt:
    'Deseja definir manualmente o filme **{0}** como vencedor da enquete atual?\n',
  pollManualWinner:
    'Enquete Fechada!\n Próximo filme: \n\n 🎬 **{0}** \n\n(_definido manualmente por {1}_).',
  /*
   * SUGGESTION MESSAGES
   */
  suggestionCategory: 'Indicações de Filmes',
  suggestionDescription: 'Operações relacionadas a indicações',
  suggestionOptionsDescription: 'Opções relacionadas a indicações (remover, listar)',
  suggestionListDescription: 'Lista as indicações para o tema atual.',
  suggestionListTitle: '🍿 Indicações 🍿',
  suggestionListDescriptionTheme: 'Tema: **{0}**',
  suggestionsNoneSuggested: 'Você ainda não indicou nenhum filme.',
  suggestionsUser: 'Suas indicações',
  suggestionOthers: 'Outras indicações',
  suggestionTotalFooter: 'Total: {0} indicações',
  suggestionAllRemoved: 'Você removeu todas as indicações!',
  suggestionRemoveTitle: 'Remover indicações',
  suggestionRemoveDescription: 'Remova indicações para o tema atual',
  suggestionAddDescription: 'Cria uma nova enquete a partir de um tema especificado',
  suggestionFeatDescription: 'Adicione uma mensagem de "feat." caso seu filme vença!',
  suggestionRemovePrompt: 'Selecione as opções para remover',
  suggestionRemovePlaceholder: 'Nenhum selecionado',
  suggestionsRemovedSuccess: 'Indicações removidas!',
  /**
   * VOTE MESSAGES
   */
  voteDescription: 'Vote no próximo filme para o tema atual',
  votingMenuPrompt: 'Vote no próximo filme!',
  votingSuccess: 'Voto confirmado! **{0}**',
  votingNoPollAvailable: 'Nenhuma enquete encontrada',
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
  sessionEmbedFeatDescription: '\n**ft.** {0}',
  sessionEmbedTheme: 'Tema: {0}',
  sessionEmbedUser: 'Sugestão: <@{0}>',
  sessionInviteURL: `**[MARCAR INTERESSE]({0})**`,
  sessionDateFormat: 'ddd [,] D [de] MMMM',
  /*
   * SCORE MESSAGES
   */

  scoreEmbedTitle: 'Nota do filme',
  scoreMultipleDescription:
    'Existe mais de um filme aguardando nota.\n Qual filme você gostaria de avaliar?',
  scoreWrongValue: 'Por favor insira um valor entre 0 e 100.',
  scoreSent: 'Nota enviada! **{0}** : **{1}** ',
  scoreUserSentEmbed: '\n <@{0}> ✅',
  scoreCategory: 'Filmes',
  scoreDescription: 'Operações de filmes',
  scoreEvaluationDescription: 'Inicia a avaliação de filmes',
  scoreOpDescription: 'Iniciar ou Fechar uma avaliação de filme',
  scoreValueDescription: 'Dê a nota para um filme',
  scoreValueOpDescription: 'Nota do filme (0 a 100)',
  /*
   * MOVIE MESSAGES
   */
  movieRatingTitle: '🍿 Avaliação do Filme 🍿',
  movieRatingPrompt:
    '\u200b\nUse **/nota** para dar uma nota para o filme atual.\n\n _Apenas quem iniciou a avaliação poderá encerrá-la_ ({0}).\n\u200b \n 🎬 **{1}** - indicado por <@{2}>\n\u200b  ',
  movieRatingUser: 'Indicação: <@{0}>',
  movieRatingMovieName: 'Nome do filme',
  movieRatingAlreadyStarted: 'Já existe um filme aguardando notas ({0})',
  movieRatingNoneToClose:
    'Não há nenhuma avaliação de filme aberta.\n Utilize **/filme avaliação iniciar** antes.',
  movieRatingNoVotesReceived:
    'O filme **{0}** não recebeu nota de nenhum usuário, e a avaliação foi cancelada. utilize /avaliação para iniciar uma nova avaliação.',
  movieRatingStarted:
    'Você iniciou a avaliação de filme, e apenas você poderá encerrá-la.',
  movieRatingEmbedWinner: '🎬 {0}',
  movieRatingEmbedSuggestion: '👤 <@{0}> (+{1} 🍿)',
  movieRatingUserScore: '👤<@{0}>: **({1}✨)**',
  movieRatingEmbedTheme: 'Tema: **{0}**',
  movieRatingEmbedFooter: 'Total: {0} votos.',
  movieRatingEmbedScore: 'Nota: **{0}** ⭐',
  movieRatingMovieNotFound: 'Filme não encontrado.',
  movieRatingMovieWaitingScore: 'O filme **{0}** já está aguardando nota.',
  /*
   * CLUB MESSAGES
   */
  clubCommandDescription: 'Comando para realizar ações por outros membros',
  clubSuggestionDescription: 'Envia a indicação de outro usuário',
  clubPollUserSuggested: '<@{0}> indicou **{1}** (via <@{2}>)',
  clubScoreDescription: 'Quem deu a nota do filme',
};

export default MSG;
