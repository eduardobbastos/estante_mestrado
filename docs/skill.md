# Skill: Estante Virtual (Vision & Structure)

## Project Spirit
The Estante Virtual is more than a list; it is a premium academic curator. It transforms raw data from Google Sheets into a visually stunning, organized "shelf" of knowledge for Master's students. It embodies the Afya/Unigranrio excellence through a clean, responsive, and dynamic interface.

## Core Capabilities
1.  **Dynamic Data Ingestion**: Seamlessly connects to Google Sheets via CSV export to fetch real-time data for Disciplines, Schedules, and Evaluations.
2.  **Structural Integrity**: Maintains complex relationships between entities (Discipline -> Cronograma -> Avaliação) without a backend.
3.  **Visual Excellence**: Implements a "Shelf" metaphor using curated color palettes (Magentas and Deep Blues) and premium card designs.

## Structural Rules
1.  **Data First**: No data should be hardcoded. The application must treat the Google Sheet as the source of truth, reloading on every refresh.
2.  **Relationship Matching**: Entities are linked by the `Disciplina` key. Matching must be case-insensitive and trimmed.
3.  **Hierarchy**: Each Discipline section must include:
    *   **Header**: Showing both professors and their contact emails.
    *   **Content Area**: Cards for the schedule/lessons.
    *   **Evaluation Footer**: A dedicated section at the bottom of each discipline for evaluation cards.
4.  **Unified Card Design**:
    *   All cards (Schedule and Evaluation) must follow a rigorous, identical structure.
    *   Access to content must be represented by an **icon** instead of a text button.
5.  **Premium Aesthetics**:
    *   Use Google Fonts (Inter/Outfit).
    *   Apply glassmorphism effects for cards.
    *   Ensure smooth micro-animations on hover.

## Technical Architecture
*   **Engine**: Vanilla JavaScript (Motor).
*   **Styling**: Vanilla CSS (Premium Afya Design System).
*   **Hosting**: GitHub Pages.
*   **Database**: Google Sheets (via Gviz CSV API).
