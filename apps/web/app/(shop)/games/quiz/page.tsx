'use client';
import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Badge } from '@gemcart/ui';
import { Sparkles, Trophy, TimerReset, CheckCircle2, XCircle, BookOpen, Globe2, Landmark } from 'lucide-react';

type Question = {
  category: 'History' | 'Geography' | 'Culture';
  question: string;
  options: string[];
  answerIndex: number;
  fact?: string;
};

const ALL_QUESTIONS: Question[] = [
  { category: 'History', question: 'In what year did Nigeria gain independence?', options: ['1957', '1960', '1963', '1970'], answerIndex: 1, fact: 'Nigeria gained independence from Britain on 1 October 1960.' },
  { category: 'History', question: 'Who was Nigeria’s first executive president?', options: ['Nnamdi Azikiwe', 'Olusegun Obasanjo', 'Shehu Shagari', 'Tafawa Balewa'], answerIndex: 2, fact: 'Shehu Shagari served as executive president from 1979 to 1983.' },
  { category: 'Geography', question: 'What is the capital city of Nigeria?', options: ['Lagos', 'Abuja', 'Ibadan', 'Port Harcourt'], answerIndex: 1, fact: 'The capital moved from Lagos to Abuja in 1991.' },
  { category: 'Geography', question: 'Which river is the longest in Nigeria?', options: ['Benue', 'Ogun', 'Niger', 'Osun'], answerIndex: 2, fact: 'The River Niger flows into the Atlantic through the Niger Delta.' },
  { category: 'Culture', question: 'Which Nigerian language group is known for the talking drum?', options: ['Hausa', 'Yorùbá', 'Igbo', 'Tiv'], answerIndex: 1, fact: 'The Yorùbá talking drum (dùndún) can mimic speech tones.' },
  { category: 'Culture', question: 'Jollof rice is a staple in West Africa. Which is a common spice in Nigerian Jollof?', options: ['Saffron', 'Thyme', 'Cardamom', 'Fenugreek'], answerIndex: 1, fact: 'Thyme, curry, and bay leaves are typical in Nigerian Jollof.' },
  { category: 'Geography', question: 'Which state is nicknamed “Centre of Excellence”?', options: ['Kano', 'Lagos', 'Kaduna', 'Enugu'], answerIndex: 1 },
  { category: 'History', question: 'Who delivered the famous “Africa Has Come of Age” speech in 1979?', options: ['Yakubu Gowon', 'Murtala Muhammed', 'Obafemi Awolowo', 'Olusegun Obasanjo'], answerIndex: 3 },
  { category: 'Culture', question: 'The Aso Rock is located in which city?', options: ['Kano', 'Abuja', 'Jos', 'Abeokuta'], answerIndex: 1 },
];

export default function QuizGame() {
  const [category, setCategory] = useState<'All' | Question['category']>('All');
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(20);
  const [finished, setFinished] = useState(false);

  const questions = useMemo(() => {
    const pool = category === 'All' ? ALL_QUESTIONS : ALL_QUESTIONS.filter(q => q.category === category);
    // simple shuffle
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 8);
  }, [category, started]);

  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft <= 0) {
      handleSubmitAnswer(null);
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, started, finished]);

  function handleSubmitAnswer(choice: number | null) {
    if (finished) return;
    const current = questions[index];
    const correct = current.answerIndex;
    const isCorrect = choice === correct;
    if (isCorrect) setScore(s => s + 100);
    else setLives(l => Math.max(0, l - 1));

    setSelected(choice);
    setTimeout(() => {
      if (index + 1 >= questions.length || lives - (isCorrect ? 0 : 1) <= 0) {
        setFinished(true);
      } else {
        setIndex(i => i + 1);
        setSelected(null);
        setTimeLeft(20);
      }
    }, 900);
  }

  function restart() {
    setStarted(false);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setLives(3);
    setTimeLeft(20);
    setFinished(false);
  }

  return (
    <div className="grid gap-4 md:grid-cols-[auto_320px]">
      <Card className="p-6">
        {!started ? (
          <div className="text-center">
            <Badge variant="gem" className="mb-3">Naija Trivia</Badge>
            <h1 className="text-2xl font-bold">Test your knowledge</h1>
            <p className="mt-2 text-zinc-400">History, geography, and culture questions. Earn gems for correct answers.</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <Button variant={category === 'All' ? 'primary' : 'secondary'} onClick={() => setCategory('All')}>All</Button>
              <Button variant={category === 'History' ? 'primary' : 'secondary'} onClick={() => setCategory('History')}><Landmark className="mr-1 h-4 w-4"/>History</Button>
              <Button variant={category === 'Geography' ? 'primary' : 'secondary'} onClick={() => setCategory('Geography')}><Globe2 className="mr-1 h-4 w-4"/>Geography</Button>
              <Button variant={category === 'Culture' ? 'primary' : 'secondary'} onClick={() => setCategory('Culture')}><BookOpen className="mr-1 h-4 w-4"/>Culture</Button>
            </div>
            <Button className="mt-6" size="lg" onClick={() => { setStarted(true); setTimeLeft(20); }}>
              Start Quiz
            </Button>
          </div>
        ) : finished ? (
          <div className="text-center">
            <Trophy className="mx-auto mb-3 h-10 w-10 text-amber-400" />
            <h2 className="text-xl font-semibold">Your score: {score}</h2>
            <p className="mt-1 text-zinc-400">Great job! Claim your gems and try another category.</p>
            <form action="/api/games/score" method="post" className="mt-4 flex items-center justify-center gap-2">
              <input type="hidden" name="game" value="naija-quiz" />
              <input type="hidden" name="score" value={score} />
              <Button type="submit"><Sparkles className="mr-1 h-4 w-4"/>Save score</Button>
              <Button variant="secondary" onClick={(e) => { e.preventDefault(); restart(); }}>Play again</Button>
            </form>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="gem">{category}</Badge>
                <Badge variant="success">Q{index + 1}/{questions.length}</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-amber-400"><TimerReset className="h-4 w-4" />{timeLeft}s</div>
                <div className="flex items-center gap-1 text-green-400"><Sparkles className="h-4 w-4" />{score}</div>
                <div className="flex items-center gap-1 text-red-400"><XCircle className="h-4 w-4" />{lives}</div>
              </div>
            </div>

            {/* Question */}
            <div className="rounded-xl bg-zinc-900/50 p-4">
              <p className="text-lg font-medium">{questions[index].question}</p>
            </div>

            {/* Options */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {questions[index].options.map((opt, i) => {
                const isCorrect = i === questions[index].answerIndex;
                const isSelected = selected === i;
                return (
                  <Button
                    key={i}
                    variant={selected == null ? 'secondary' : isSelected ? (isCorrect ? 'success' : 'danger') : 'secondary'}
                    className="justify-start"
                    onClick={() => selected == null && handleSubmitAnswer(i)}
                  >
                    {opt}
                  </Button>
                );
              })}
            </div>

            {/* Fact */}
            {selected !== null && questions[index].fact && (
              <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-sm text-zinc-300">
                <CheckCircle2 className="mr-2 inline h-4 w-4 text-green-400" />
                {questions[index].fact}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Sidebar */}
      <Card className="p-6">
        <div className="text-lg font-semibold">How it works</div>
        <ul className="mt-3 space-y-2 text-sm text-zinc-400">
          <li>• 100 points per correct answer</li>
          <li>• 3 lives per game</li>
          <li>• 20 seconds per question</li>
          <li>• Save score to earn gems</li>
        </ul>
        {started && !finished && (
          <Button className="mt-4 w-full" variant="secondary" onClick={restart}>Restart</Button>
        )}
      </Card>
    </div>
  );
}












