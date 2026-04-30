#  Civic Assistant (2026 Indian Assembly Elections)

An authoritative, real-time digital assistant designed for the **2026 Indian Assembly Elections**. This application serves as the **Chief Digital Election Officer (CDEO)**, providing verified polling data, civic education, and a countdown to Counting Day.

## 🏛️ Project Details

### Vertical: Civic Tech & E-Governance
This project targets the civic technology space, specifically election management and voter education. It bridges the gap between complex election data and citizen accessibility.

### Approach and Logic
The application uses the **Oracle Framework** for AI responses:
1. **Direct Answer**: Immediate factual retrieval from a verified JSON-based state machine.
2. **Real-time Status**: Contextual updates based on the system date (April 30, 2026), marking polling as complete.
3. **Deep Dive**: Educational "Did You Know?" snippets to increase civic literacy.
4. **Attribution**: Transparent source citing for every response.

### How the Solution Works
- **State Machine Backend**: Uses `national_election_2026.json` as the single source of truth for turnout, candidates, and milestones.
- **AI Integration**: Leverages Google Gemini (Gemini 1.5 Flash) with a strictly constrained system prompt to prevent hallucinations and maintain non-partisan neutrality.
- **Dynamic UI**: A React-based high-performance dashboard that synchronizes headers and assistant logic to a fixed temporal point (April 30, 2026).

### Assumptions Made
1. **Temporal Context**: The app assumes the current date is April 30, 2026, for the sake of demonstrating a "Post-Poll, Pre-Counting" scenario.
2. **Data Scope**: Covers 5 major regions (TN, WB, Kerala, Assam, Puducherry) as these are the primary 2026 election cycles.
3. **Connectivity**: Assumes active internet for the Gemini API, but falls back to static data for core election facts.

## 🛠️ Tech Stack

- **Framework**: React 18+ with Vite
- **AI Engine**: Google Gemini API (@google/genai)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (motion/react)
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your environment variables in a `.env` file:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## ⚖️ Neutrality Policy
Grounded in ECI April 30, 2026 Official Bulletins. This assistant does NOT provide political predictions or exit polls.
