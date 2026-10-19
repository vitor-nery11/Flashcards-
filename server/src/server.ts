import express, {Request, Response} from 'express';
import cors from 'cors';
import {randomUUID} from 'node:crypto';

const app = express();
app.use(cors());
app.use(express.json());


type Dificuldade = 'facil' | 'medio' | 'dificil';

interface Flashcards {
    id: string;
    pergunta: string;
    resposta: string;
    dificuldade?: Dificuldade;
}


const cards: Flashcards[] = [
    {
    id:'1',
    pergunta: 'pra que serve o typescript',
    resposta: 'Para adicionar tipagem estatica ao javascript para evitar bugs',
    }

]


app.get('/cards', (req, res) => {
    return res.json(cards)
})



type CriarCardPost = Omit <Flashcards, 'id'>;


app.post('/cards', (req: Request, res: Response) => {

    const {pergunta, resposta, dificuldade}: CriarCardPost = req.body;

    const novoCard: Flashcards = {

        id: randomUUID(),
        pergunta,
        resposta, 
        dificuldade
    }

    cards.push(novoCard);


    return res.status(201).json(novoCard);

});


app.patch('/cards/:id', (req: Request, res: Response)=> {
    const {id} = req.params;
    const {dificuldade} = req.body;

    const cardEncontrado = cards.find((card) => card.id === id);

    if (!cardEncontrado){
        return res.status(404).json({erro: 'Card não encontrado'})
    }

    if(dificuldade !== undefined) {
        cardEncontrado.dificuldade = dificuldade;
    }

    return res.json(cardEncontrado)
})



app.listen (3001, ()=> {
    console.log('O servidor esta rodando na porta 3001');

})