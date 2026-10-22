export type Dificuldade = 'facil' | 'medio' | 'dificil';

export interface Flashcards {
    id: string;
    pergunta: string;
    resposta: string;
    dificuldade?: Dificuldade
}