import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Dificuldade, Flashcards } from '../types';

interface NovoCardFormProps {
  onCardCriado: (novoCard: Flashcards) => void;
}

export default function NovoCardForm({ onCardCriado }: NovoCardFormProps) {
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [dificuldade, setDificuldade] = useState<Dificuldade>('medio');
  const [erro, setErro] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!pergunta.trim() || !resposta.trim()) {
      setErro('Preencha a pergunta e a resposta.');
      return;
    }

    setErro('');

    try {
      const response = await fetch('http://localhost:3001/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pergunta: pergunta.trim(),
          resposta: resposta.trim(),
          dificuldade,
        }),
      });

      if (!response.ok) {
        throw new Error(`A API respondeu com o status ${response.status}.`);
      }

      const novoCard: Flashcards = await response.json();
      onCardCriado(novoCard);
      setPergunta('');
      setResposta('');
      setDificuldade('medio');
    } catch (error) {
      console.error('Erro ao cadastrar o card:', error);
      setErro('Não foi possível cadastrar o card. Tente novamente.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <h2 className="text-xl font-bold">Novo Flashcard</h2>

      <input
        type="text"
        placeholder="Pergunta"
        value={pergunta}
        onChange={(event) => setPergunta(event.target.value)}
        required
        className="w-full rounded border border-slate-600 bg-slate-800 p-3 text-white"
      />

      <input
        type="text"
        placeholder="Resposta"
        value={resposta}
        onChange={(event) => setResposta(event.target.value)}
        required
        className="w-full rounded border border-slate-600 bg-slate-800 p-3 text-white"
      />

      <select
        value={dificuldade}
        onChange={(event) => setDificuldade(event.target.value as Dificuldade)}
        className="w-full rounded border border-slate-600 bg-slate-800 p-3 text-white"
      >
        <option value="facil">Fácil</option>
        <option value="medio">Médio</option>
        <option value="dificil">Difícil</option>
      </select>

      {erro && <p role="alert" className="text-sm text-red-400">{erro}</p>}

      <button
        type="submit"
        className="rounded bg-emerald-500 px-4 py-2 font-semibold text-slate-900 hover:bg-emerald-400"
      >
        Cadastrar card
      </button>
    </form>
  );
}
