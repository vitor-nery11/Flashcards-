// 1. Importamos a função 'useState' do React para criar variáveis que a tela consegue monitorar e redesenhar
import { useState } from 'react';

// 2. Importamos o contrato do Flashcard que definimos no arquivo de tipos
import type { ChangeEvent, MouseEvent } from 'react';
import type { Dificuldade, Flashcards } from '../types';

// 3. Definimos a interface com as propriedades (props) que este componente exige receber de fora
interface CardProps {
  card: Flashcards; // O componente precisa receber um objeto no formato Flashcards
}

// 4. Declaramos o componente Card recebendo a propriedade 'card' desestruturada
export default function Card({ card }: CardProps) {
  // 5. Criamos o estado 'virado' iniciando com valor falso (false) e a função 'setVirado' para alterá-lo
  const [virado, setVirado] = useState(false);
  const [dificuldade, setDificuldade] = useState<Dificuldade>(
    card.dificuldade ?? 'medio',
  );
  const [erro, setErro] = useState('');

  // 6. Função disparada ao clicar no cartão para inverter o valor (se for false vira true, se for true vira false)
  function alternarCard() {
    setVirado(!virado);
  }

  async function atualizarDificuldade(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const novaDificuldade = event.target.value as Dificuldade;

    try {
      const response = await fetch(`http://localhost:3001/cards/${card.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dificuldade: novaDificuldade }),
      });

      if (!response.ok) {
        throw new Error(`A API respondeu com o status ${response.status}.`);
      }

      setDificuldade(novaDificuldade);
      setErro('');
    } catch (erro) {
      console.error('Erro ao atualizar dificuldade', erro);
      setErro('Não foi possível atualizar a dificuldade.');
    }
  }

  return (
    // 7. Div principal com evento onClick para chamar a função e classes Tailwind para formato, cores e sombra
    <div
      onClick={alternarCard}
      className="w-full max-w-md p-6 bg-slate-800 text-white rounded-xl shadow-lg border border-slate-700 cursor-pointer select-none transition-all hover:border-slate-500"
    >
      {/* 8. Barra superior com o indicador de status e o crachá de dificuldade */}
      <div className="flex justify-between items-center mb-4">
        {/* 9. Operador ternário: se 'virado' for verdadeiro exibe 'Resposta', senão exibe 'Pergunta' */}
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
          {virado ? '💡 Resposta' : '❓ Pergunta'}
        </span>

        {/* 10. Renderização condicional: só desenha o selo se o card tiver uma dificuldade definida */}
        <label className="text-xs text-slate-400">
          Dificuldade
          <select
            value={dificuldade}
            onClick={(event: MouseEvent<HTMLSelectElement>) =>
              event.stopPropagation()
            }
            onChange={atualizarDificuldade}
            className="ml-2 rounded bg-slate-700 px-2 py-1 text-emerald-400"
          >
            <option value="facil">Fácil</option>
            <option value="medio">Médio</option>
            <option value="dificil">Difícil</option>
          </select>
        </label>
      </div>

      {/* 11. Texto central: alterna dinamicamente entre exibir a pergunta ou a resposta */}
      <p className="text-lg font-medium text-center min-h-20 flex items-center justify-center">
        {virado ? card.resposta : card.pergunta}
      </p>

      {/* 12. Texto de rodapé com dica de interação para o usuário */}
      <p className="text-xs text-center text-slate-500 mt-4">
        Clique para {virado ? 'ver a pergunta' : 'revelar a resposta'}
      </p>
      {erro && <p role="alert" className="mt-2 text-center text-xs text-red-400">{erro}</p>}
    </div>
  );
}