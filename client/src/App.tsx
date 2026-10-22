
import { useState, useEffect } from 'react';
import Card from './components/Cards';
import NovoCardForm from './components/NovoCardForm';
import type { Flashcards } from './types';

export default function App() {
  
  const [cards, setCards] = useState<Flashcards[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/cards')

    .then((resposta) => resposta.json())

    .then((dados: Flashcards[]) => {
      setCards(dados);
    })

    .catch((erro) => {
      console.log('Erro ao bsucar cards da API:', erro)
    })


  },[])


  function handleCardCriado(novoCard: Flashcards) {
    setCards((cardsAtuais) => [novoCard, ...cardsAtuais]);
  }

return (
    // 11. Container principal estilizado para ocupar a tela toda com fundo escuro e espaçamento
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      {/* 12. Título principal do projeto */}
      <h1 className="text-3xl font-bold mb-8 text-emerald-400">
        Flashcards Dev ⚡
      </h1>

      <NovoCardForm onCardCriado={handleCardCriado} />

      {/* 13. Grid responsivo para organizar os cards em colunas quando houver múltiplos itens */}
      <div className="mt-8 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
        {/* 14. Usamos o método .map() para iterar sobre a lista de cards e transformar cada um em um componente <Card /> */}
        {cards.map((card) => (
          // 15. Renderizamos o componente passando o objeto 'card' e a propriedade obrigatória 'key' com o ID único
          <Card key={card.id} card={card} />
        ))}
      </div>
    </main>
  );
}