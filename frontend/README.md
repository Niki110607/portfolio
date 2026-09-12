Setup the servers:
backend:
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

frontend:
cd frontend
npm run dev

@theme {
--color-color-main: #0f0f12;
--color-color-secondary: #1b1b22;
--color-color-accent: #00e5ff;
--color-color-text: #e5e7eb;
--color-color-title: #f9fafb;
--color-color-border: #1d4a50;
}

Option 1: Portfolio Deep-Dive (Best for Project Case Studies / Portfolio Websites)
Transformer-Based Chess Engine with MCTS Integration
I built a custom, lightweight Transformer-based chess engine designed to evaluate positions and generate policy distributions over legal moves. Trained on a dataset of 10 million real human positions from Lichess, the 6.5 million parameter model directly outputs two key predictions from any given board state:
Move Policy: A probability distribution across all theoretical legal moves to prioritize high-value candidates.
State Evaluation: An expected positional score to assess White vs. Black's advantage.
Rather than relying on raw policy inference alone, the engine embeds these dual outputs directly into a Monte Carlo Tree Search (MCTS) framework. By utilizing the model's policy distribution to prune non-promising branches and guide tree expansion, the MCTS achieves high efficiency—evaluating roughly 1,000 positions per second.
Depending on the allocated thinking time per move, the engine plays at a strong International Master (IM) to low-end Grandmaster (GM) level, with an estimated playing strength between 2200 and 2400 ELO.
