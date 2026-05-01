import { useState, useMemo, useCallback } from 'react'

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function calculateWinner(squares) {
  for (const [a, b, c] of WIN_LINES) {
    const line = squares[a]
    if (line && line === squares[b] && line === squares[c]) {
      return { player: line, line: [a, b, c] }
    }
  }
  return null
}

function isBoardFull(squares) {
  return squares.every((cell) => cell !== null)
}

export default function TicTacToe() {
  const [squares, setSquares] = useState(() => [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ])
  const [xIsNext, setXIsNext] = useState(true)

  const winnerResult = useMemo(() => calculateWinner(squares), [squares])
  const winner = winnerResult?.player ?? null
  const winnerLineIndices = winnerResult?.line ?? null
  const draw = !winner && isBoardFull(squares)

  const statusMessage = winner
    ? `Pemenang: ${winner}`
    : draw
      ? 'Seri!'
      : `Giliran: ${xIsNext ? 'X' : 'O'}`

  const handleClick = useCallback(
    (index) => {
      if (winner || draw || squares[index] !== null) return

      setSquares((prev) => {
        const next = [...prev]
        next[index] = xIsNext ? 'X' : 'O'
        return next
      })
      setXIsNext((v) => !v)
    },
    [squares, winner, draw, xIsNext],
  )

  const reset = useCallback(() => {
    setSquares([
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ])
    setXIsNext(true)
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8">
      <header className="text-center">
        <h1 className="bg-gradient-to-r from-cyan-200 to-violet-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
          Tic Tac Toe
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          React 19 · Vite 5 · Tailwind CSS
        </p>
      </header>

      <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-md sm:p-8">
        <p
          className="mb-6 text-center text-lg font-semibold tabular-nums sm:text-xl"
          role="status"
          aria-live="polite"
        >
          {winner ? (
            <span className="text-emerald-300">{statusMessage}</span>
          ) : draw ? (
            <span className="text-amber-200">{statusMessage}</span>
          ) : (
            <span className="text-slate-100">
              Giliran:{' '}
              <span className={xIsNext ? 'text-sky-300' : 'text-fuchsia-300'}>
                {xIsNext ? 'X' : 'O'}
              </span>
            </span>
          )}
        </p>

        <div
          className="mx-auto grid w-full max-w-[min(100%,20rem)] grid-cols-3 gap-2 sm:gap-3"
          role="grid"
          aria-label="Papan tic tac toe"
        >
          {squares.map((value, index) => {
            const won = winnerLineIndices?.includes(index) ?? false
            const clickable = !winner && !draw && value === null

            return (
              <button
                key={index}
                type="button"
                role="gridcell"
                aria-label={
                  value
                    ? `Kotak ${index + 1}, ${value}`
                    : `Kotak kosong ${index + 1}`
                }
                disabled={!clickable}
                onClick={() => handleClick(index)}
                className={[
                  'flex aspect-square min-h-[3.5rem] select-none items-center justify-center rounded-xl border-2 text-3xl font-black transition-all duration-200 sm:min-h-[5rem] sm:text-4xl',
                  won
                    ? 'border-emerald-400 bg-emerald-500/35 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-300/80'
                    : value === 'X'
                      ? 'border-sky-500/40 bg-sky-500/15 text-sky-200'
                      : value === 'O'
                        ? 'border-fuchsia-500/40 bg-fuchsia-500/15 text-fuchsia-200'
                        : 'border-white/15 bg-slate-800/40 text-slate-500',
                  clickable
                    ? 'cursor-pointer hover:border-white/35 hover:bg-slate-700/50 hover:shadow-md active:scale-[0.97]'
                    : 'cursor-default',
                  !clickable && !won && !value ? 'opacity-60' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {value ?? ''}
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.98] sm:text-base"
          >
            Reset permainan
          </button>
        </div>
      </div>
    </div>
  )
}
