# Virtual Stock Market Simulator


A comprehensive, professional-grade stock market simulation game built with Node.js. Experience realistic trading with advanced features including technical analysis, news impact, portfolio analytics, and more.

## Features

### Core Trading
- **Real-time Price Updates**: Live market simulation with automatic price changes
- **Multiple Stocks**: Trade 15+ major company stocks with realistic volatility
- **Multi-Player Support**: Create and switch between multiple player accounts
- **Persistent Data**: Automatic saving and loading of game progress

### Advanced Analytics
- **Technical Indicators**: SMA, RSI, trend analysis, and volatility metrics
- **Portfolio Analytics**: Diversification scoring, risk assessment, and performance tracking
- **ASCII Charts**: Visual price charts and portfolio allocation graphs
- **Market Summary**: Real-time market trends and top performers

### News & Market Events
- **Dynamic News System**: Random news generation that impacts stock prices
- **Market Sentiment**: Bullish/bearish indicators based on recent news
- **Event-Driven Trading**: News events create realistic market reactions

### Professional Features
- **Data Export**: Export portfolios in JSON or CSV format
- **Transaction History**: Complete trading history with timestamps
- **Leaderboard**: Competitive ranking system
- **Backup System**: Automatic data backups and recovery

## Installation

```bash
npm install -g virtual-stock-market-simulator
```

Or clone and run locally:

```bash
git clone https://github.com/professional-developer/stock-market-simulator.git
cd stock-market-simulator
npm install
npm start
```

## Usage

### Starting the Game
```bash
stock-simulator
# or
npm start
```

### Commands

| Command | Description |
|---------|-------------|
| `b/buy` | Purchase stocks |
| `s/sell` | Sell stocks |
| `a/add` | Add new player |
| `w/switch` | Switch between players |
| `n/news` | View latest news |
| `t/technical` | Technical analysis |
| `c/chart` | View price charts |
| `p/portfolio` | Portfolio analytics |
| `m/market` | Market summary |
| `e/export` | Export portfolio |
| `l/leaderboard` | View rankings |
| `r/run` | Toggle auto-updates |
| `q/quit` | Save and exit |

### Trading Basics

1. **Add a Player**: Start by creating a player account
2. **Buy Stocks**: Select stocks by number or symbol
3. **Monitor Performance**: Use technical analysis and charts
4. **Stay Informed**: Check news for market-moving events
5. **Manage Risk**: Analyze portfolio diversification

## Project Structure

```
stock-market-simulator/
├── src/
│   ├── models/          # Data models (Stock, Player, News)
│   ├── services/        # Business logic (Market, Data, Charts)
│   ├── utils/           # Utilities (colors, helpers, indicators)
│   └── cli/             # Command interface (display, commands)
├── config/              # Configuration files
├── data/                # Saved game data
├── exports/             # Portfolio exports
├── index.js             # Main entry point
└── package.json         # Project metadata
```

## Technical Details

- **Language**: Node.js with modern ES6+ features
- **Architecture**: Modular design with separation of concerns
- **Data Persistence**: JSON-based storage with automatic backups
- **Real-time Updates**: Event-driven price simulation
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Configuration

Edit `config/default.json` to customize:
- Market update intervals
- Starting cash amounts
- Display preferences
- Data retention settings

## Data Management

- **Auto-Save**: Game progress saved automatically
- **Backups**: Regular data backups in `data/backups/`
- **Export**: Portfolio data exportable to JSON/CSV
- **Recovery**: Automatic loading of previous sessions

## Contributing

This project demonstrates professional development practices:
- Modular architecture
- Clean code principles
- Comprehensive error handling
- Extensive documentation
- Automated data management

## License

MIT License - see LICENSE file for details

